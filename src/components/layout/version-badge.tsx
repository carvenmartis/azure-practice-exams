'use client';

import { useOnline } from '@/lib/connection';
import { appVersion, commitSha } from '@/lib/version';

/**
 * The build version in the bottom-right corner of every page, with a note when
 * offline. On desktop it sits just left of the side navigation (SideNav, w-96)
 * so it doesn't cover the menu's buttons.
 */
export function VersionBadge() {
  const online = useOnline();
  return (
    <div className="pointer-events-none absolute bottom-2 right-3 z-50 lg:right-[calc(24rem+0.75rem)] select-none rounded-full bg-canvas/85 px-2 py-0.5 text-[0.7rem] tracking-wide text-ink-subtle backdrop-blur-sm">
      {!online && <span className="font-semibold text-accent-strong">Offline · </span>}
      v{appVersion}
      {commitSha && ` (${commitSha})`}
    </div>
  );
}
