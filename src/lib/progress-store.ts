import { useSyncExternalStore } from 'react';
import { emptyProgress, maxAttempts, maxDailyDays, mergeProgressData, normalizeProgress } from './progress-data';
import type { AnswerResult, Attempt, ProgressData, ReviewSchedule } from './progress-data';

// Callers import everything about progress from here.
export * from './progress-data';

const storageKey = 'practice-progress';

/**
 * Spaced repetition: days until a missed question is due again. A miss
 * starts at the first interval; each right answer once it's due moves to the
 * next one, and a right answer at the last interval means it's learned and
 * leaves the review list. A miss at any point starts over.
 */
export const reviewIntervals = [3, 7, 14, 30];

const dayMs = 24 * 60 * 60 * 1000;

let cache: ProgressData | null = null;
const listeners = new Set<() => void>();

function read(): ProgressData {
  if (cache) return cache;
  try {
    cache = normalizeProgress(JSON.parse(window.localStorage.getItem(storageKey) ?? 'null'));
  } catch {
    cache = emptyProgress;
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

/** Calls `listener` whenever the progress changes, in this tab or another one. */
export function subscribeProgress(listener: () => void) {
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
  return useSyncExternalStore(subscribeProgress, read, () => emptyProgress);
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

/** The local calendar day of `date` as '2026-10-08'. */
export function localDay(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Counts one answered question towards today's goal. */
export function countDailyAnswer() {
  const today = localDay();
  write((data) => {
    const daily = { ...data.daily, [today]: (data.daily[today] ?? 0) + 1 };
    const days = Object.keys(daily).sort();
    for (const old of days.slice(0, -maxDailyDays)) delete daily[old];
    return { ...data, daily };
  });
}

/** Changes how many questions a day reach the daily goal. */
export function setDailyGoal(goal: number) {
  write((data) => ({ ...data, dailyGoal: goal }));
}

/**
 * Today's count against the goal and the streak: days in a row on which the
 * goal was reached, up to today. Today only breaks the streak once it's over,
 * so before reaching the goal the streak still counts from yesterday.
 */
export function dailyStatus(data: ProgressData, now = new Date()) {
  const today = data.daily[localDay(now)] ?? 0;
  const reached = today >= data.dailyGoal;
  let streak = reached ? 1 : 0;
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  while ((data.daily[localDay(day)] ?? 0) >= data.dailyGoal) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return { today, goal: data.dailyGoal, reached, streak };
}

/**
 * Adds progress from a backup file to what's saved here, without deleting
 * anything: attempts, mistakes and bookmarks are combined, a question in both
 * review schedules keeps the later due date, each day keeps the higher count,
 * and the daily goal comes from the backup.
 */
export function mergeProgress(incoming: ProgressData) {
  write((data) => ({ ...mergeProgressData(emptyProgress, data, incoming), dailyGoal: incoming.dailyGoal }));
}

/**
 * Takes in the result of a sync. `sent` is the copy that went to the server
 * and `synced` what came back; anything saved here while the sync was under
 * way is kept on top.
 */
export function applySyncedProgress(sent: ProgressData, synced: ProgressData) {
  write((data) => (data === sent ? synced : mergeProgressData(sent, data, synced)));
}
