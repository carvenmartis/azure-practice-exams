import { PageLayout } from '@/components/layout/page-layout';
import { ThemePicker } from '@/components/settings/theme-picker';

/** Settings page. The theme choice applies across the whole site. */
export default function Settings() {
  return (
    <PageLayout pageTitle="Settings" headerTitle="Settings" >
      <div className="mx-auto max-w-2xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Preferences</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Settings</h1>
        <div className="mt-10 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <ThemePicker />
        </div>
      </div>
    </PageLayout>
  );
}
