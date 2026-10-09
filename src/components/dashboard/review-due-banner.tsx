'use client';

import Link from 'next/link';
import { exams, splitExamName } from '@/lib/exams';
import { reviewQueue, useProgress } from '@/lib/progress-store';
import { buttonClasses } from '@/components/ui/button';
import { cn, focusRing } from '@/lib/utils';

/**
 * Dashboard link to review, shown while missed questions are due again. It
 * names the exams they come from; with one exam it starts that exam's review
 * round directly, otherwise it opens Review mistakes to pick one.
 */
export function ReviewDueBanner() {
  const progress = useProgress();
  const dueExams = exams
    .map((exam) => ({ exam, due: reviewQueue(progress, exam.slug).due.length }))
    .filter((item) => item.due > 0);
  const dueCount = dueExams.reduce((sum, item) => sum + item.due, 0);
  if (!dueCount) return null;

  const href = dueExams.length === 1 ? `/exams/${dueExams[0].exam.slug}?mode=review` : '/review';

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4 transition-colors hover:border-accent sm:flex-row sm:items-center sm:justify-between',
        focusRing
      )}
    >
      <span className="min-w-0">
        <span className="block font-semibold">
          {dueCount} missed question{dueCount === 1 ? ' is' : 's are'} due for review
        </span>
        <span className="mt-0.5 block text-sm text-ink-muted">
          From{' '}
          {dueExams.map((item, index) => (
            <span key={item.exam.slug}>
              {index > 0 && (index === dueExams.length - 1 ? ' and ' : ', ')}
              <span className="font-mono text-xs text-ink">{splitExamName(item.exam).code}</span>{' '}
              <span className="tabular-nums">({item.due})</span>
            </span>
          ))}
          . They come back less often each time you get them right.
        </span>
      </span>
      <span className={buttonClasses({ className: 'shrink-0 self-start sm:self-auto' })} aria-hidden="true">
        Start review
        <span className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none">
          →
        </span>
      </span>
    </Link>
  );
}
