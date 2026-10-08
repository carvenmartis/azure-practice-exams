'use client';

import { useSyncExternalStore } from 'react';
import { appVersion, commitSha } from '@/lib/version';

function subscribe(listener: () => void) {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
}

/** The build version in the bottom-right corner of every page, with a note when offline. */
export function VersionBadge() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  return (
    <div className="fixed bottom-2 right-3 z-50 select-none rounded-full bg-canvas/85 px-2 py-0.5 text-[0.7rem] tracking-wide text-ink-subtle backdrop-blur-sm">
      {!online && <span className="font-semibold text-accent-strong">Offline · </span>}
      v{appVersion}
      {commitSha && ` (${commitSha})`}
    </div>
  );
}
