import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';

interface ExamResultsProps {
  total: number;
  answeredCount: number;
  correctCount: number;
  /** True when the user exited before answering every question. */
  endedEarly: boolean;
}

/**
 * Final score out of 1000. Unanswered questions count towards the total but
 * score nothing; an early exit also breaks the result down.
 */
export function ExamResults({ total, answeredCount, correctCount, endedEarly }: ExamResultsProps) {
  const score = Math.round((correctCount / total) * 1000);
  const stats = [
    { label: 'Correct', value: correctCount },
    { label: 'Wrong', value: answeredCount - correctCount },
    { label: 'Unanswered', value: total - answeredCount }
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-3xl font-bold">{endedEarly ? 'Exam Ended Early' : 'Exam Complete'}</h1>
      <p className="mb-2 text-center text-lg">
        {endedEarly
          ? `You answered ${answeredCount} of ${total} questions, ${correctCount} of them correctly.`
          : `You answered ${correctCount} out of ${total} questions correctly.`}
      </p>
      {endedEarly && (
        <dl className="my-4 grid w-full max-w-md grid-cols-3 gap-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} className="text-center" />
          ))}
        </dl>
      )}
      <p className="mb-6 text-2xl font-semibold">Score: {score} / 1000</p>
      <Link href="/" className={buttonClasses()}>
        Back to Dashboard
      </Link>
    </div>
  );
}
