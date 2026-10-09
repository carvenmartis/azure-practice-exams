import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout/page-layout';
import { BackupSync } from '@/components/settings/backup-sync';
import { DailyGoalSettings } from '@/components/settings/daily-goal-settings';
import { OfflineStatus } from '@/components/settings/offline-status';
import { ThemePicker } from '@/components/settings/theme-picker';

export const metadata: Metadata = { title: 'Settings' };

/**
 * Settings page. The theme choice applies across the whole site; the daily
 * goal and its reminder, backup and sync, and whether exams work without
 * internet follow.
 */
export default function Settings() {
  return (
    <PageLayout headerTitle="Settings">
      <div className="mx-auto max-w-2xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-sm font-medium text-ink-subtle">Preferences</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tighter sm:text-4xl">Settings</h1>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <ThemePicker />
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <DailyGoalSettings />
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <BackupSync />
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <OfflineStatus />
        </div>
      </div>
    </PageLayout>
  );
}
