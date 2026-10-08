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
  /** Time from the first question to the results; missing on older attempts. */
  durationSeconds?: number;
  /** Keyed by skill area name. */
  topics: Record<string, TopicTally>;
}

/** When a missed question comes back for review. */
export interface ReviewSchedule {
  /** ISO date and time (local midnight) from which the question is due. */
  due: string;
  /** Index into `reviewIntervals`: how many due reviews were answered right in a row. */
  step: number;
}

/** Everything saved on this device. */
export interface ProgressData {
  attempts: Attempt[];
  /** Question ids answered wrong and not yet learned, per exam slug. */
  mistakes: Record<string, string[]>;
  /**
   * When each id in `mistakes` is due again, per exam slug and question id.
   * Ids without an entry (saved before spaced repetition) are due now.
   */
  reviewSchedule: Record<string, Record<string, ReviewSchedule>>;
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

/**
 * Spaced repetition: days until a missed question is due again. A miss
 * starts at the first interval; each right answer once it's due moves to the
 * next one, and a right answer at the last interval means it's learned and
 * leaves the review list. A miss at any point starts over.
 */
export const reviewIntervals = [3, 7, 14, 30];

const dayMs = 24 * 60 * 60 * 1000;

const emptyData: ProgressData = { attempts: [], mistakes: {}, reviewSchedule: {}, bookmarks: {} };

let cache: ProgressData | null = null;
const listeners = new Set<() => void>();

function read(): ProgressData {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    cache = {
      attempts: Array.isArray(parsed?.attempts) ? parsed.attempts : [],
      mistakes: parsed?.mistakes ?? {},
      reviewSchedule: parsed?.reviewSchedule ?? {},
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

/** Local midnight `days` days after `from`, so a question is due for the whole day. */
function dueAfter(days: number, from: Date) {
  const midnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  midnight.setDate(midnight.getDate() + days);
  return midnight.toISOString();
}

/** The question's place in the review schedule; due now if it has none yet. */
export function scheduleFor(data: ProgressData, slug: string, id: string): ReviewSchedule {
  return data.reviewSchedule[slug]?.[id] ?? { due: new Date(0).toISOString(), step: 0 };
}

/** Whether a question on the review list is due at `now`. */
export function isDue(schedule: ReviewSchedule, now = Date.now()) {
  return Date.parse(schedule.due) <= now;
}

/** The exam's review list split into questions due now and ones coming back later. */
export function reviewQueue(data: ProgressData, slug: string, now = Date.now()) {
  const due: string[] = [];
  const later: string[] = [];
  let nextDue: string | null = null;
  for (const id of data.mistakes[slug] ?? []) {
    const schedule = scheduleFor(data, slug, id);
    if (isDue(schedule, now)) {
      due.push(id);
    } else {
      later.push(id);
      if (!nextDue || schedule.due < nextDue) nextDue = schedule.due;
    }
  }
  return { due, later, nextDue };
}

/** Days from `now` until the review list item comes back, at least 1. */
export function daysUntil(due: string, now = Date.now()) {
  return Math.max(1, Math.ceil((Date.parse(due) - now) / dayMs));
}

/**
 * Updates the review list and its spaced repetition schedule. A wrong answer
 * puts the question on the list, due in a few days. A right answer to a
 * question that is due pushes it further out, or takes it off the list after
 * the last interval; a right answer before it's due changes nothing.
 */
export function recordAnswers(slug: string, results: AnswerResult[]) {
  if (!results.length) return;
  const now = new Date();
  write((data) => {
    const mistakes = new Set(data.mistakes[slug] ?? []);
    const schedule = { ...data.reviewSchedule[slug] };
    for (const result of results) {
      if (!result.correct) {
        mistakes.add(result.id);
        schedule[result.id] = { due: dueAfter(reviewIntervals[0], now), step: 0 };
        continue;
      }
      if (!mistakes.has(result.id)) continue;
      const current = scheduleFor(data, slug, result.id);
      if (!isDue(current, now.getTime())) continue;
      const step = current.step + 1;
      if (step >= reviewIntervals.length) {
        mistakes.delete(result.id);
        delete schedule[result.id];
      } else {
        schedule[result.id] = { due: dueAfter(reviewIntervals[step], now), step };
      }
    }
    return {
      ...data,
      mistakes: { ...data.mistakes, [slug]: Array.from(mistakes) },
      reviewSchedule: { ...data.reviewSchedule, [slug]: schedule }
    };
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
    const reviewSchedule = { ...data.reviewSchedule };
    delete reviewSchedule[slug];
    return {
      ...data,
      attempts: data.attempts.filter((attempt) => attempt.slug !== slug),
      mistakes,
      reviewSchedule
    };
  });
}
