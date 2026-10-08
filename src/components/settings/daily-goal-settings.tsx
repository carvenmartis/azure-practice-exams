'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioCard } from '@/components/ui/radio-card';
import { changeDailyGoal, dailyGoalChoices } from '@/lib/daily-goal';
import { useProgress } from '@/lib/progress-store';
import {
  defaultReminderTime,
  disableReminder,
  enableReminder,
  getReminderSettings,
  reminderSupport,
  sendTestReminder
} from '@/lib/reminders';
import type { ReminderSupport } from '@/lib/reminders';
import { cn, focusRing } from '@/lib/utils';

const supportMessages: Record<Exclude<ReminderSupport, 'ok'>, string> = {
  'needs-https':
    'Reminders need an https address. This page was opened over http, so the browser does not allow notifications here.',
  'needs-home-screen':
    'On iPhone and iPad, reminders work in the app added to the Home Screen (Share, then Add to Home Screen) and opened from there. It needs iOS 16.4 or later.',
  unsupported: 'This browser cannot show reminders.',
  blocked: 'Notifications are turned off for this app. Allow them in your device settings, then come back here.'
};

/**
 * Settings section for the daily goal (questions per day, shown on the
 * dashboard) and the reminder notification at a chosen time on days the goal
 * isn't reached yet.
 */
export function DailyGoalSettings() {
  const { dailyGoal } = useProgress();
  const [support, setSupport] = useState<ReminderSupport | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(defaultReminderTime);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Support and the saved reminder are only known in the browser.
  useEffect(() => {
    const saved = getReminderSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupport(reminderSupport());
    setEnabled(saved.enabled);
    setTime(saved.time);
  }, []);

  const run = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage({ text: success });
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Something went wrong.', error: true });
    } finally {
      setBusy(false);
      setEnabled(getReminderSettings().enabled);
      setSupport(reminderSupport());
    }
  };

  return (
    <section id="daily-goal" className="scroll-mt-24">
      <fieldset>
        <legend className="font-display text-xl font-semibold">Daily goal</legend>
        <p className="mt-1 text-sm text-ink-muted">
          Questions to answer each day. The dashboard shows how far you are and your streak of days in a row.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {dailyGoalChoices.map((goal) => (
            <RadioCard
              key={goal}
              name="daily-goal"
              value={String(goal)}
              label={`${goal} a day`}
              checked={dailyGoal === goal}
              onChange={() => changeDailyGoal(goal)}
            />
          ))}
        </div>
      </fieldset>

      <h3 className="mt-8 font-semibold">Reminder</h3>
      <p className="mt-1 text-sm text-ink-muted">
        A notification at this time on days you haven&apos;t reached your goal yet.
      </p>
      {support && support !== 'ok' && (
        <p className="mt-4 rounded-xl border border-line bg-surface-muted px-4 py-3 text-sm text-ink-muted" role="status">
          {supportMessages[support]}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink-muted">Time</span>
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value || defaultReminderTime)}
            className={cn('rounded-xl border border-line-strong bg-surface px-3 py-2 text-ink lining-nums', focusRing)}
          />
        </label>
        <Button
          disabled={busy || support !== 'ok'}
          onClick={() =>
            run(() => enableReminder(time), enabled ? `Reminder moved to ${time}.` : `Reminder set for ${time} every day.`)
          }
        >
          {enabled ? 'Update reminder' : 'Turn on reminder'}
        </Button>
        {enabled && (
          <>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => run(sendTestReminder, 'Test reminder sent. It should appear in a few seconds.')}
            >
              Send a test
            </Button>
            <Button variant="ghost" disabled={busy} onClick={() => run(disableReminder, 'Reminder turned off.')}>
              Turn off
            </Button>
          </>
        )}
      </div>
      {message && (
        <p className={message.error ? 'mt-3 text-sm font-semibold text-danger' : 'mt-3 text-sm text-ink-muted'} role="status">
          {message.text}
        </p>
      )}
    </section>
  );
}
