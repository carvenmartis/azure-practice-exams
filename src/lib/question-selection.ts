interface SelectableQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

const wordPattern = /[a-z0-9]+/g;

function normalized(value: string) {
  return value.toLowerCase().match(wordPattern)?.join(' ') ?? '';
}

function shuffled<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

/**
 * Picks questions in a random order while keeping each attempt varied. Every
 * question has the same chance of being chosen, but repeated stems and
 * repeated correct answers are held back until no fresh ones are left, which
 * matters for older banks that contain several wordings of the same fact.
 */
export function selectVariedQuestions<T extends SelectableQuestion>(
  questions: T[],
  limit = questions.length,
  random: () => number = Math.random
) {
  if (!questions.length || limit <= 0) return [];

  const order = shuffled(questions, random);
  const selected: T[] = [];
  const selectedItems = new Set<T>();
  const stems = new Set<string>();
  const answers = new Set<string>();

  const add = (requireNewStem: boolean, requireNewAnswer: boolean) => {
    for (const question of order) {
      if (selected.length >= limit) return;
      if (selectedItems.has(question)) continue;
      const stem = normalized(question.question);
      const answer = normalized(question.options[question.answerIndex] ?? '');
      if (requireNewStem && stems.has(stem)) continue;
      if (requireNewAnswer && answers.has(answer)) continue;
      selected.push(question);
      selectedItems.add(question);
      stems.add(stem);
      answers.add(answer);
    }
  };

  add(true, true);
  add(true, false);
  add(false, false);

  return selected;
}
