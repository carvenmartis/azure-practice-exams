import { PageLayout } from '@/components/layout/page-layout';
import { ThemePicker } from '@/components/settings/theme-picker';

/** Settings page. The theme choice applies across the whole site. */
export default function Settings() {
  return (
    <PageLayout pageTitle="Settings" headerTitle="Settings" className="bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <div className="mt-8">
          <ThemePicker />
        </div>
      </div>
    </PageLayout>
  );
}
