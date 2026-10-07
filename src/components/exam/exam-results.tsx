import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';

/** Microsoft certification exams are passed with 700 out of 1000. */
const passingScore = 700;

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
  const passed = score >= passingScore;
  const stats = [
    { label: 'Correct', value: correctCount },
    { label: 'Wrong', value: answeredCount - correctCount },
    { label: 'Unanswered', value: total - answeredCount }
  ];

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {endedEarly ? 'Exam ended early' : 'Exam complete'}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Your results</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">
        {endedEarly
          ? `You answered ${answeredCount} of ${total} questions, ${correctCount} of them correctly.`
          : `You answered ${correctCount} out of ${total} questions correctly.`}
      </p>

      <Card className="mt-8 w-full px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">Score</p>
        <p className="mt-2 font-display text-6xl font-semibold tracking-tight lining-nums">
          {score}
          <span className="text-2xl text-ink-subtle"> / 1000</span>
        </p>
        <p className={passed ? 'mt-3 text-sm font-semibold text-success' : 'mt-3 text-sm font-semibold text-danger'}>
          {passed ? 'Above' : 'Below'} the passing score of {passingScore}
        </p>
      </Card>

      {endedEarly && (
        <dl className="mt-4 grid w-full grid-cols-3 gap-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </dl>
      )}

      <Link href="/" className={buttonClasses({ className: 'mt-10' })}>
        Back to Dashboard
      </Link>
    </div>
  );
}
