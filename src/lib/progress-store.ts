import { useSyncExternalStore } from 'react';

/** Right and total answers for one skill area in one attempt. */
export interface TopicTally {
  correct: number;
  total: number;
}

/** One finished (or exited) practice exam. */
export interface Attempt {
  slug: string;
  /** ISO date and time the attempt ended. */
  finishedAt: string;
  /** Questions in the attempt, answered or not. */
  total: number;
  answered: number;
  correct: number;
  /** Out of 1000, unanswered questions count as wrong. */
  score: number;
  endedEarly: boolean;
  /** Keyed by skill area name. */
  topics: Record<string, TopicTally>;
}

/** Everything saved on this device. */
export interface ProgressData {
  attempts: Attempt[];
  /** Question ids answered wrong and not answered right since, per exam slug. */
  mistakes: Record<string, string[]>;
  /** Bookmarked question ids per exam slug, oldest first. */
  bookmarks: Record<string, string[]>;
}

/** One answered question, for updating the mistakes list. */
export interface AnswerResult {
  id: string;
  correct: boolean;
}

const storageKey = 'practice-progress';
/** Keep the history small enough for localStorage. */
const maxAttempts = 500;

const emptyData: ProgressData = { attempts: [], mistakes: {}, bookmarks: {} };

let cache: ProgressData | null = null;
const listeners = new Set<() => void>();

function read(): ProgressData {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    cache = {
      attempts: Array.isArray(parsed?.attempts) ? parsed.attempts : [],
      mistakes: parsed?.mistakes ?? {},
      bookmarks: parsed?.bookmarks ?? {}
    };
  } catch {
    cache = emptyData;
  }
  return cache;
}

function write(update: (data: ProgressData) => ProgressData) {
  cache = update(read());
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(cache));
  } catch {
    // Storage full or blocked (private mode): keep the change for this visit only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab saved progress: drop the cache so the next read sees it.
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    cache = null;
    listener();
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

/** The saved progress, for use in effects and handlers outside React rendering. */
export function getProgress(): ProgressData {
  return read();
}

/**
 * The progress saved in this browser: attempts, mistakes and bookmarks.
 * Empty during the server render and hydration, filled in right after.
 */
export function useProgress(): ProgressData {
  return useSyncExternalStore(subscribe, read, () => emptyData);
}

/** Adds wrong answers to the exam's mistakes and removes ones now answered right. */
export function recordAnswers(slug: string, results: AnswerResult[]) {
  if (!results.length) return;
  write((data) => {
    const mistakes = new Set(data.mistakes[slug] ?? []);
    for (const result of results) {
      if (result.correct) mistakes.delete(result.id);
      else mistakes.add(result.id);
    }
    return { ...data, mistakes: { ...data.mistakes, [slug]: Array.from(mistakes) } };
  });
}

/** Saves a finished practice exam to the history. */
export function recordAttempt(attempt: Attempt) {
  write((data) => ({ ...data, attempts: [...data.attempts, attempt].slice(-maxAttempts) }));
}

/** Bookmarks the question, or removes the bookmark if it has one. */
export function toggleBookmark(slug: string, id: string) {
  write((data) => {
    const current = data.bookmarks[slug] ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    return { ...data, bookmarks: { ...data.bookmarks, [slug]: next } };
  });
}

/** Deletes the attempt history and mistakes of one exam; bookmarks stay. */
export function clearExamHistory(slug: string) {
  write((data) => {
    const mistakes = { ...data.mistakes };
    delete mistakes[slug];
    return { ...data, attempts: data.attempts.filter((attempt) => attempt.slug !== slug), mistakes };
  });
}
