import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout/page-layout';
import { BackupSync } from '@/components/settings/backup-sync';
import { DailyGoalSettings } from '@/components/settings/daily-goal-settings';
import { OfflineStatus } from '@/components/settings/offline-status';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
import { SyncSettings } from '@/components/settings/sync-settings';
import { ThemePicker } from '@/components/settings/theme-picker';

export const metadata: Metadata = { title: 'Settings' };

/**
 * Settings page. The theme choice applies across the whole site; the daily
 * goal and its reminder, sync with other devices, backup, and whether exams work without
 * internet follow.
 */
export default function Settings() {
  return (
    <PageLayout headerTitle="Settings">
      <PageContainer width="reading">
        <PageIntro title="Settings" lede="Theme, daily goal, sync, backup and offline use." />
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
          {[ThemePicker, DailyGoalSettings, SyncSettings, BackupSync, OfflineStatus].map((Section, index) => (
            <div key={index} className="p-6 sm:p-8">
              <Section />
            </div>
          ))}
        </div>
      </PageContainer>
    </PageLayout>
  );
}
