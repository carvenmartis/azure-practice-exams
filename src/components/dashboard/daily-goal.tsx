'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { dailyStatus, useProgress } from '@/lib/progress-store';
import { syncReminder } from '@/lib/reminders';
import { cn, focusRing } from '@/lib/utils';

/**
 * Dashboard card with today's answered questions against the daily goal and
 * the streak of days the goal was reached. Every answered question counts:
 * exams, reviews, drills, bookmarks and study mode. Opening the dashboard
 * (where the Home Screen app starts) also re-registers the daily reminder.
 */
export function DailyGoal() {
  useEffect(() => {
    void syncReminder();
  }, []);
  const status = dailyStatus(useProgress());
  const share = Math.min(status.today / status.goal, 1);
  const left = status.goal - status.today;

  return (
    <Card className="px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-subtle">Daily goal</p>
          <p className="mt-2 font-display text-xl font-semibold tracking-tight tabular-nums">
            {status.today} <span className="text-ink-subtle">of {status.goal} questions today</span>
          </p>
          <p className={cn('mt-1 text-sm', status.reached ? 'font-semibold text-success' : 'text-ink-muted')}>
            {status.reached
              ? 'Goal reached. See you tomorrow.'
              : `${left} to go. Any exam, review, drill or study question counts.`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-ink-subtle">Streak</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
            {status.streak} <span className="text-base text-ink-subtle">day{status.streak === 1 ? '' : 's'}</span>
          </p>
        </div>
      </div>
      <div
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-label="Daily goal"
        aria-valuemin={0}
        aria-valuemax={status.goal}
        aria-valuenow={Math.min(status.today, status.goal)}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', status.reached ? 'bg-success' : 'bg-accent')}
          style={{ width: `${share * 100}%` }}
        />
      </div>
      <Link
        href="/settings#daily-goal"
        className={cn('mt-3 inline-block text-sm text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink', focusRing)}
      >
        Change goal or set a reminder
      </Link>
    </Card>
  );
}
