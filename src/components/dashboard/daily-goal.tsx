'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { dailyStatus, useProgress } from '@/lib/progress-store';
import { syncReminder } from '@/lib/reminders';
import { cn, focusRing } from '@/lib/utils';

/** Radius of the progress ring in its 44 x 44 viewBox. */
const ringRadius = 18;
const ringLength = 2 * Math.PI * ringRadius;

/**
 * Dashboard card with today's answered questions against the daily goal, as a
 * count and a ring, and the streak of days the goal was reached (only shown
 * once there is one). Every answered question counts: exams, reviews, drills,
 * bookmarks and study mode. Opening the dashboard (where the Home Screen app
 * starts) also re-registers the daily reminder.
 */
export function DailyGoal() {
  useEffect(() => {
    void syncReminder();
  }, []);
  const status = dailyStatus(useProgress());
  const share = Math.min(status.today / status.goal, 1);
  const left = status.goal - status.today;

  return (
    <Card className="flex flex-col px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-ink-subtle">Daily goal</p>
        {status.streak > 0 && (
          <p className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-strong tabular-nums">
            {status.streak}-day streak
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="font-display tabular-nums">
            <span className="text-4xl font-semibold tracking-tight">{status.today}</span>
            <span className="ml-1.5 text-base text-ink-subtle">/ {status.goal} questions</span>
          </p>
          <p className={cn('mt-1.5 text-sm', status.reached ? 'font-semibold text-success' : 'text-ink-muted')}>
            {status.reached
              ? 'Goal reached. See you tomorrow.'
              : `${left} to go. Any exam, review, drill or study question counts.`}
          </p>
        </div>
        <div
          className="relative size-16 shrink-0"
          role="progressbar"
          aria-label="Daily goal"
          aria-valuemin={0}
          aria-valuemax={status.goal}
          aria-valuenow={Math.min(status.today, status.goal)}
        >
          <svg viewBox="0 0 44 44" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="22" cy="22" r={ringRadius} fill="none" strokeWidth="3" className="stroke-surface-muted" />
            <circle
              cx="22"
              cy="22"
              r={ringRadius}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={ringLength}
              strokeDashoffset={ringLength * (1 - share)}
              className={cn(
                'transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none',
                status.reached ? 'stroke-success' : 'stroke-accent',
                share === 0 && 'opacity-0'
              )}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
            {Math.round(share * 100)}%
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <Link
          href="/settings#daily-goal"
          className={cn(
            'text-sm text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink',
            focusRing
          )}
        >
          Change goal or set a reminder
        </Link>
      </div>
    </Card>
  );
}
