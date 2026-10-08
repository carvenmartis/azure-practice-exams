import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { formatDuration } from '@/lib/utils';

/** Microsoft certification exams are passed with 700 out of 1000. */
const passingScore = 700;

interface ExamResultsProps {
  total: number;
  answeredCount: number;
  correctCount: number;
  /** True when the user exited before answering every question. */
  endedEarly: boolean;
  /** Time taken, from the first question to the results. */
  durationSeconds?: number;
  /** Review and bookmark rounds show no score and link back to their list. */
  mode?: 'exam' | 'review' | 'bookmarks';
}

/**
 * Final score out of 1000. Unanswered questions count towards the total but
 * score nothing; an early exit also breaks the result down.
 */
export function ExamResults({
  total,
  answeredCount,
  correctCount,
  endedEarly,
  durationSeconds,
  mode = 'exam'
}: ExamResultsProps) {
  const timeTaken = durationSeconds ? (
    <p className="mt-2 text-sm text-ink-subtle">
      Time taken: <span className="font-semibold text-ink-muted lining-nums">{formatDuration(durationSeconds)}</span>
    </p>
  ) : null;

  if (mode === 'bookmarks') {
    return (
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {endedEarly ? 'Bookmarks round ended early' : 'Bookmarks round complete'}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {correctCount} of {answeredCount} right
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Your bookmarks stay until you remove them on the Bookmarks page.
        </p>
        {timeTaken}
        <Link href="/bookmarks" className={buttonClasses({ className: 'mt-10' })}>
          Back to Bookmarks
        </Link>
      </div>
    );
  }

  if (mode === 'review') {
    const stillWrong = answeredCount - correctCount;
    return (
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {endedEarly ? 'Review ended early' : 'Review complete'}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {correctCount} of {answeredCount} fixed
        </h1>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Questions you answered right leave your review list.{' '}
          {stillWrong
            ? `${stillWrong} you missed again stay on it for next time.`
            : 'You got every one of them right this time.'}
        </p>
        {timeTaken}
        <Link href="/review" className={buttonClasses({ className: 'mt-10' })}>
          Back to Review mistakes
        </Link>
      </div>
    );
  }

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
        {timeTaken}
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
