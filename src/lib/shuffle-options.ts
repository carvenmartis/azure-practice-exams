export interface MultipleChoice {
  options: string[];
  answerIndex: number;
}

// Options like "None of the above" only make sense where the author put them.
const PINNED_OPTION = /^(all|none) of the above\.?$/i;

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Returns a copy of the question with its options in a random order and
 * answerIndex pointing at the correct option's new position. The correct
 * answer avoids its position in the data file and `avoidIndex` (the previous
 * question's correct position) whenever the free slots allow it.
 */
export function shuffleOptions<T extends MultipleChoice>(question: T, avoidIndex?: number): T {
  const { options, answerIndex } = question;
  const freeSlots = options.map((_, idx) => idx).filter((idx) => !PINNED_OPTION.test(options[idx]));
  if (!freeSlots.includes(answerIndex)) return question;

  const preferred = freeSlots.filter((idx) => idx !== answerIndex && idx !== avoidIndex);
  const fallback = freeSlots.filter((idx) => idx !== avoidIndex);
  const candidates = preferred.length ? preferred : fallback.length ? fallback : freeSlots;
  const newAnswerIndex = candidates[Math.floor(Math.random() * candidates.length)];

  const shuffled = [...options];
  shuffled[newAnswerIndex] = options[answerIndex];
  const others = shuffleInPlace(freeSlots.filter((idx) => idx !== answerIndex).map((idx) => options[idx]));
  for (const slot of freeSlots) {
    if (slot !== newAnswerIndex) shuffled[slot] = others.pop() as string;
  }
  return { ...question, options: shuffled, answerIndex: newAnswerIndex };
}

/** Shuffles every question's options so the correct position never repeats back to back. */
export function shuffleAllOptions<T extends MultipleChoice>(questions: T[]): T[] {
  let previous: number | undefined;
  return questions.map((question) => {
    const shuffled = shuffleOptions(question, previous);
    previous = shuffled.answerIndex;
    return shuffled;
  });
}
