/**
 * The shape of saved progress and the pure helpers on it, kept free of React
 * so the server (src/lib/server/sync.ts) can use them too.
 */

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
  /** Questions answered per local day ('2026-10-08'), in any mode, for the daily goal. */
  daily: Record<string, number>;
  /** Questions per day that count as reaching the daily goal. */
  dailyGoal: number;
}

/** One answered question, for updating the mistakes list. */
export interface AnswerResult {
  id: string;
  correct: boolean;
}

/** The progress shared by every device through the server (src/app/api/sync). */
export interface SyncCopy {
  /** Goes up by one with every save; 0 before the first one. */
  revision: number;
  /** ISO date and time of the last save, null before the first one. */
  updatedAt: string | null;
  progress: ProgressData;
}

/**
 * A sync code as typed: lower case, without spaces, dashes kept. Null unless
 * it is 8 to 64 letters, digits and dashes, so a typo can't reach the server.
 */
export function normalizeSyncCode(code: string) {
  const normalized = code.trim().toLowerCase().replace(/\s+/g, '');
  return /^[a-z0-9-]{8,64}$/.test(normalized) ? normalized : null;
}

/** Keep the history small enough for localStorage. */
export const maxAttempts = 500;

export const defaultDailyGoal = 20;
/** Days of daily counts to keep; plenty for any streak worth showing. */
export const maxDailyDays = 400;

export const emptyProgress: ProgressData = {
  attempts: [],
  mistakes: {},
  reviewSchedule: {},
  bookmarks: {},
  daily: {},
  dailyGoal: defaultDailyGoal
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Saved or imported progress with every field present; anything malformed is dropped. */
export function normalizeProgress(parsed: unknown): ProgressData {
  const value = isRecord(parsed) ? parsed : {};
  const goal = Number(value.dailyGoal);
  return {
    attempts: Array.isArray(value.attempts) ? value.attempts : [],
    mistakes: isRecord(value.mistakes) ? (value.mistakes as ProgressData['mistakes']) : {},
    reviewSchedule: isRecord(value.reviewSchedule) ? (value.reviewSchedule as ProgressData['reviewSchedule']) : {},
    bookmarks: isRecord(value.bookmarks) ? (value.bookmarks as ProgressData['bookmarks']) : {},
    daily: isRecord(value.daily) ? (value.daily as ProgressData['daily']) : {},
    dailyGoal: Number.isInteger(goal) && goal > 0 ? goal : defaultDailyGoal
  };
}

function sameEntry(a: ReviewSchedule | undefined, b: ReviewSchedule | undefined) {
  return a?.due === b?.due && a?.step === b?.step;
}

/**
 * Combines two lists that both started from `base`: anything added on either
 * side is kept, and anything removed on either side stays removed.
 */
function mergeIds(base: string[] = [], ours: string[] = [], theirs: string[] = []) {
  const before = new Set(base);
  const inOurs = new Set(ours);
  const inTheirs = new Set(theirs);
  const kept = (id: string) => (inOurs.has(id) && inTheirs.has(id)) || !before.has(id);
  return Array.from(new Set(ours.concat(theirs))).filter(kept);
}

function mergeIdLists(base: Record<string, string[]>, ours: Record<string, string[]>, theirs: Record<string, string[]>) {
  const merged: Record<string, string[]> = {};
  for (const slug of Array.from(new Set(Object.keys(ours).concat(Object.keys(theirs))))) {
    const ids = mergeIds(base[slug], ours[slug], theirs[slug]);
    if (ids.length || (slug in ours && slug in theirs)) merged[slug] = ids;
  }
  return merged;
}

/**
 * Combines two copies of the progress that both started from `base` (the
 * copy from the last sync, or nothing for a first sync or a backup):
 * additions on either side are kept and removals on either side stay
 * removed, so a bookmark taken off on one device doesn't come back from
 * another. A question rescheduled on both sides keeps the later due date,
 * each day keeps the higher count, and the daily goal comes from the side
 * that changed it.
 */
export function mergeProgressData(base: ProgressData, ours: ProgressData, theirs: ProgressData): ProgressData {
  const attemptKey = (attempt: Attempt) => `${attempt.slug}|${attempt.finishedAt}`;
  const attemptsByKey = new Map(ours.attempts.concat(theirs.attempts).map((attempt) => [attemptKey(attempt), attempt]));
  const attempts = mergeIds(base.attempts.map(attemptKey), ours.attempts.map(attemptKey), theirs.attempts.map(attemptKey))
    .map((key) => attemptsByKey.get(key)!)
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt))
    .slice(-maxAttempts);

  const mistakes = mergeIdLists(base.mistakes, ours.mistakes, theirs.mistakes);

  // Only questions still on the review list keep a schedule.
  const reviewSchedule: ProgressData['reviewSchedule'] = {};
  for (const [slug, ids] of Object.entries(mistakes)) {
    const entries: Record<string, ReviewSchedule> = {};
    for (const id of ids) {
      const before = base.reviewSchedule[slug]?.[id];
      const mine = ours.reviewSchedule[slug]?.[id];
      const other = theirs.reviewSchedule[slug]?.[id];
      let entry: ReviewSchedule | undefined;
      if (!mine || sameEntry(mine, before)) entry = other ?? mine;
      else if (!other || sameEntry(other, before)) entry = mine;
      else entry = other.due > mine.due ? other : mine;
      if (entry) entries[id] = entry;
    }
    reviewSchedule[slug] = entries;
  }

  const daily = { ...ours.daily };
  for (const [day, count] of Object.entries(theirs.daily)) daily[day] = Math.max(daily[day] ?? 0, count);
  for (const old of Object.keys(daily).sort().slice(0, -maxDailyDays)) delete daily[old];

  return {
    attempts,
    mistakes,
    reviewSchedule,
    bookmarks: mergeIdLists(base.bookmarks, ours.bookmarks, theirs.bookmarks),
    daily,
    dailyGoal: ours.dailyGoal !== base.dailyGoal ? ours.dailyGoal : theirs.dailyGoal
  };
}
