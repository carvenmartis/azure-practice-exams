import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout/page-layout';
import { BackupSync } from '@/components/settings/backup-sync';
import { DailyGoalSettings } from '@/components/settings/daily-goal-settings';
import { OfflineStatus } from '@/components/settings/offline-status';
import { PageContainer } from '@/components/ui/page-container';
import { PageIntro } from '@/components/ui/page-intro';
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
      <PageContainer width="reading">
        <PageIntro title="Settings" lede="Theme, daily goal, backup and offline use. Everything is saved on this device." />
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
          {[ThemePicker, DailyGoalSettings, BackupSync, OfflineStatus].map((Section, index) => (
            <div key={index} className="p-6 sm:p-8">
              <Section />
            </div>
          ))}
        </div>
      </PageContainer>
    </PageLayout>
  );
}
