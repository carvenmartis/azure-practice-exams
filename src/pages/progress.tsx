import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { ExamProgress } from '@/components/progress/exam-progress';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { exams } from '@/lib/exams';
import { useProgress } from '@/lib/progress-store';

/**
 * My progress: every practice exam taken on this device, grouped by exam,
 * with score trends and the weakest skill areas.
 */
export default function Progress() {
  const { attempts, mistakes } = useProgress();
  const taken = exams
    .map((exam) => ({ exam, attempts: attempts.filter((attempt) => attempt.slug === exam.slug) }))
    .filter((item) => item.attempts.length > 0);

  const answered = attempts.reduce((sum, attempt) => sum + attempt.answered, 0);
  const correct = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const stats = [
    { label: 'Attempts', value: attempts.length },
    { label: 'Questions answered', value: answered },
    { label: 'Answered right', value: answered ? `${Math.round((correct / answered) * 100)}%` : '–' }
  ];

  return (
    <PageLayout pageTitle="My progress" headerTitle="My progress">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your history</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">My progress</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          Every practice exam you finish or exit is saved in this browser, so your history stays on this device.
        </p>

        {taken.length ? (
          <>
            <dl className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </dl>
            <div className="mt-8 space-y-6">
              {taken.map(({ exam, attempts: examAttempts }) => (
                <ExamProgress
                  key={exam.slug}
                  exam={exam}
                  attempts={examAttempts}
                  mistakeCount={mistakes[exam.slug]?.length ?? 0}
                />
              ))}
            </div>
          </>
        ) : (
          <Card className="mt-10 px-6 py-10 text-center">
            <p className="font-display text-2xl font-semibold">No attempts yet</p>
            <p className="mt-3 text-ink-muted">Finish a practice exam and your score and weakest topics appear here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
