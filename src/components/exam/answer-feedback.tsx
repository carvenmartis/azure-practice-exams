import { Button } from '@/components/ui/button';
import { findAbbreviations } from '@/lib/abbreviations';
import type { ExamQuestion } from '@/lib/exam-data';
import { cn } from '@/lib/utils';

interface AnswerFeedbackProps {
  question: ExamQuestion;
  /** Index of the option picked, if any (study mode can reveal without picking). */
  selectedIndex?: number;
  isLastQuestion: boolean;
  onNext: () => void;
  /** Replaces the default 'Next Question' / 'View Results' label. */
  nextLabel?: string;
}

const sectionLabel = 'text-xs font-medium';

/**
 * Shown after answering: the correct answer and why, why each other option
 * is wrong (the picked one first), the abbreviations used, a docs link and Next.
 */
export function AnswerFeedback({ question, selectedIndex, isLastQuestion, onNext, nextLabel }: AnswerFeedbackProps) {
  const { options, answerIndex, explanation, link, wrongAnswers } = question;
  const picked = selectedIndex !== undefined && selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const wrongOptions = options
    .filter((option, idx) => idx !== answerIndex && wrongAnswers?.[option])
    .sort((a, b) => Number(b === picked) - Number(a === picked));
  const abbreviations = findAbbreviations([
    question.question,
    ...options,
    explanation,
    ...wrongOptions.map((option) => wrongAnswers?.[option] ?? '')
  ]);

  return (
    <div className="mt-8 flex w-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7">
      <p className={cn(sectionLabel, 'text-accent')}>Correct answer</p>
      <p className="mt-2 font-semibold">{options[answerIndex]}</p>
      <p className="mt-4 border-t border-line pt-4 leading-relaxed text-ink-muted">{explanation}</p>
      {wrongOptions.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className={cn(sectionLabel, 'text-ink-subtle')}>Why the other answers are wrong</p>
          <ul className="mt-3 flex flex-col gap-3">
            {wrongOptions.map((option) => (
              <li
                key={option}
                className={cn(
                  'rounded-xl border px-4 py-3',
                  option === picked ? 'border-danger bg-danger-soft' : 'border-line bg-surface-muted'
                )}
              >
                <p className="font-semibold">
                  {option}
                  {option === picked && <span className="ml-2 text-xs font-semibold text-danger">Your answer</span>}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{wrongAnswers?.[option]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {abbreviations.length > 0 && (
        <div className="mt-5 border-t border-line pt-4">
          <p className={cn(sectionLabel, 'text-ink-subtle')}>Abbreviations</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {abbreviations.map(({ term, meaning }) => (
              <div key={term} className="contents">
                <dt className="font-semibold">{term}</dt>
                <dd className="text-ink-muted">{meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {link && (
        <a
          href={link}
          className="mt-5 inline-block self-start text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          target="_blank"
          rel="noreferrer"
        >
          Read the Microsoft documentation
        </a>
      )}
      <Button className="mt-6 self-end" onClick={onNext}>
        {nextLabel ?? (isLastQuestion ? 'View Results' : 'Next Question')}
      </Button>
    </div>
  );
}
