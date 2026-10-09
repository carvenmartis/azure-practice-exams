'use client';

import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { ExamProgress } from '@/components/progress/exam-progress';
import { buttonClasses } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { exams } from '@/lib/exams';
import { reviewQueue, useProgress } from '@/lib/progress-store';

/**
 * My progress: every practice exam taken on this device, grouped by exam,
 * with score trends and the weakest skill areas.
 */
export function ProgressOverview() {
  const progress = useProgress();
  const { attempts } = progress;
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
    <PageLayout headerTitle="My progress">
      <PageContainer width="wide">
        <PageIntro
          title="My progress"
          lede="Your history. Every practice exam you finish or exit is saved in this browser, so your history stays on this device."
        />

        {taken.length ? (
          <>
            <dl className="grid grid-cols-3 gap-3 sm:gap-5">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </dl>
            <div className="mt-12 space-y-14">
              {taken.map(({ exam, attempts: examAttempts }) => (
                <ExamProgress
                  key={exam.slug}
                  exam={exam}
                  attempts={examAttempts}
                  mistakeCount={reviewQueue(progress, exam.slug).due.length}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-8">
            <p className="font-display text-xl font-semibold tracking-tight">No attempts yet</p>
            <p className="mt-2 max-w-[60ch] text-ink-muted">Finish a practice exam and your score and weakest topics appear here.</p>
            <Link href="/" className={buttonClasses({ className: 'mt-6' })}>
              Choose an exam
            </Link>
          </div>
        )}
      </PageContainer>
    </PageLayout>
  );
}
