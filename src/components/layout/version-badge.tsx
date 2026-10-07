import { appVersion, commitSha } from '@/lib/version';

/** The build version in the bottom-right corner of every page. */
export function VersionBadge() {
  return (
    <div className="fixed bottom-2 right-3 z-50 select-none rounded-sm bg-white/85 px-1.5 py-0.5 text-xs text-gray-500 backdrop-blur-sm dark:bg-black/85 dark:text-gray-400">
      v{appVersion}
      {commitSha && ` (${commitSha})`}
    </div>
  );
}
