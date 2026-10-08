'use client';

import Link from 'next/link';
import { exams } from '@/lib/exams';
import { reviewQueue, useProgress } from '@/lib/progress-store';
import { cn, focusRing } from '@/lib/utils';

/** Dashboard link to Review mistakes, shown while missed questions are due again. */
export function ReviewDueBanner() {
  const progress = useProgress();
  const dueCount = exams.reduce((sum, exam) => sum + reviewQueue(progress, exam.slug).due.length, 0);
  if (!dueCount) return null;

  return (
    <Link
      href="/review"
      className={cn(
        'mt-6 flex items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-surface px-5 py-4 shadow-card transition-colors hover:border-accent',
        focusRing
      )}
    >
      <span>
        <span className="block font-semibold">
          {dueCount} missed question{dueCount === 1 ? ' is' : 's are'} due for review
        </span>
        <span className="block text-sm text-ink-muted">They come back less often each time you get them right.</span>
      </span>
      <span aria-hidden="true" className="text-xl text-accent">→</span>
    </Link>
  );
}
