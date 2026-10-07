import { Button } from '@/components/ui/button';

interface AnswerFeedbackProps {
  correctAnswer: string;
  explanation: string;
  link?: string;
  isLastQuestion: boolean;
  onNext: () => void;
}

/** Shown after answering: the correct answer, why, a docs link and Next. */
export function AnswerFeedback({ correctAnswer, explanation, link, isLastQuestion, onNext }: AnswerFeedbackProps) {
  return (
    <div className="mt-8 flex w-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">Correct answer</p>
      <p className="mt-2 font-semibold">{correctAnswer}</p>
      <p className="mt-4 border-t border-line pt-4 leading-relaxed text-ink-muted">{explanation}</p>
      {link && (
        <a
          href={link}
          className="mt-3 inline-block self-start text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          target="_blank"
          rel="noreferrer"
        >
          Read the Microsoft documentation
        </a>
      )}
      <Button className="mt-6 self-end" onClick={onNext}>
        {isLastQuestion ? 'View Results' : 'Next Question'}
      </Button>
    </div>
  );
}
