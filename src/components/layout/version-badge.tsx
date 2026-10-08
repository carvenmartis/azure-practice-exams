'use client';

import { useOnline } from '@/lib/connection';
import { appVersion, commitSha } from '@/lib/version';

/** The build version in the bottom-right corner of every page, with a note when offline. */
export function VersionBadge() {
  const online = useOnline();
  return (
    <div className="fixed bottom-2 right-3 z-50 select-none rounded-full bg-canvas/85 px-2 py-0.5 text-[0.7rem] tracking-wide text-ink-subtle backdrop-blur-sm">
      {!online && <span className="font-semibold text-accent-strong">Offline · </span>}
      v{appVersion}
      {commitSha && ` (${commitSha})`}
    </div>
  );
}
