import { buildId } from '@/lib/version';

/** One question as served from public/exam-data/<slug>.json. */
export interface ExamQuestion {
  /** Stable id from scripts/build-exam-data.mjs, used for mistakes and bookmarks. */
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  link?: string;
  /** Why each wrong option is wrong, keyed by the option text (options get shuffled). */
  wrongAnswers?: Record<string, string>;
}

/*
 * Every downloaded question file is also kept in IndexedDB, so exams keep
 * working without a connection even where the service worker can't run
 * (it needs https; IndexedDB doesn't).
 */
const dbName = 'exam-data';
const storeName = 'questions';
/** Key under which the build id of the last full download is kept. */
const savedBuildKey = '__build';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readSaved<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName).objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

async function save(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(value, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function download(slug: string): Promise<ExamQuestion[]> {
  const res = await fetch(`/exam-data/${slug}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const questions = (await res.json()) as ExamQuestion[];
  // Saving is best effort: storage may be full or blocked (private mode).
  save(slug, questions).catch(() => {});
  return questions;
}

/**
 * Every question of one exam, in data file order. Downloads them when
 * possible and otherwise uses the copy saved on this device.
 */
export async function fetchExamQuestions(slug: string): Promise<ExamQuestion[]> {
  try {
    return await download(slug);
  } catch (error) {
    const saved = await readSaved<ExamQuestion[]>(slug).catch(() => undefined);
    if (saved) return saved;
    throw error;
  }
}

/**
 * Saves the questions of every exam on this device, once per build, so any
 * exam can be started offline even if it was never opened.
 */
export async function saveAllExamsForOffline(slugs: string[]) {
  if ((await readSaved<string>(savedBuildKey)) === buildId) return;
  await Promise.all(slugs.map(download));
  await save(savedBuildKey, buildId);
}
