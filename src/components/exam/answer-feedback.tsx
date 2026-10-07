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
    <div className="mt-6 flex w-full flex-col items-center rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-center font-semibold">Correct answer: {correctAnswer}</p>
      <p className="mt-2 text-center text-gray-700 dark:text-gray-200">{explanation}</p>
      {link && (
        <a
          href={link}
          className="mt-2 inline-block text-center text-blue-600 underline dark:text-blue-400"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      )}
      <Button className="mt-4" onClick={onNext}>
        {isLastQuestion ? 'View Results' : 'Next Question'}
      </Button>
    </div>
  );
}
