'use client';

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { setServerReachable } from '@/lib/connection';
import { buildId } from '@/lib/version';
import type { VersionResponse } from '@/lib/version';
import { cn, focusRing } from '@/lib/utils';

const pollInterval = 60 * 1000;

/**
 * Checks /api/version every minute and whenever the tab comes back into
 * view. When the server runs a newer build than the one this page loaded
 * with, it shows a notice; clicking it reloads the page onto the new version.
 *
 * The notice is absolute inside the app shell rather than fixed, because iOS
 * Safari misplaces fixed elements over the scrolling <main>, so a tap meant
 * for the notice could open the card underneath. After the tap a clear layer
 * covers the page until the reload, so nothing else reacts to it.
 */
export function UpdateNotice() {
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);

  const reload = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setReloading(true);
    window.location.reload();
  };

  useEffect(() => {
    let cancelled = false;

    const checkVersion = async () => {
      try {
        // The timestamp keeps iOS from answering with a cached response.
        const res = await fetch(`/api/version?t=${Date.now()}`, { cache: 'no-store' });
        setServerReachable(res.ok);
        if (!res.ok) return;
        const latest = (await res.json()) as VersionResponse;
        if (!cancelled && latest.buildId && latest.buildId !== buildId) {
          setNewVersion(latest.version);
        }
      } catch {
        // Offline or the server is restarting; try again on the next check.
        setServerReachable(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkVersion();
    };

    // iOS Safari restores pages from the back/forward cache and resumes
    // home-screen apps without always firing focus or visibilitychange, so
    // also check on load, on pageshow and when the connection comes back.
    checkVersion();
    const timer = window.setInterval(checkVersion, pollInterval);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkVersion);
    window.addEventListener('pageshow', checkVersion);
    window.addEventListener('online', checkVersion);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkVersion);
      window.removeEventListener('pageshow', checkVersion);
      window.removeEventListener('online', checkVersion);
    };
  }, []);

  return (
    <>
      {reloading && <div aria-hidden="true" className="absolute inset-0 z-[60]" />}
      <AnimatePresence>
        {newVersion && (
          <motion.div
            role="status"
            className="absolute inset-x-4 bottom-10 z-50 sm:left-auto sm:right-4 sm:w-96"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={reload}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-left text-on-primary shadow-lifted transition-colors hover:bg-primary-hover',
                focusRing
              )}
            >
              <span className="flex-1">
                <span className="block font-semibold">A new version is available</span>
                <span className="block text-sm text-on-primary/80">
                  Version {newVersion}. Tap to refresh.
                </span>
              </span>
              <span aria-hidden="true" className="text-xl">↻</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
