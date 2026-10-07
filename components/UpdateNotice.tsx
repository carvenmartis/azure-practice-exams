import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildId } from '../lib/version';
import type { VersionResponse } from '../lib/version';

const pollInterval = 5 * 60 * 1000;

/**
 * Checks /api/version every few minutes and whenever the tab comes back into
 * view. When the server runs a newer build than the one this page loaded
 * with, it shows a notice; clicking it reloads the page onto the new version.
 */
export default function UpdateNotice() {
  const [newVersion, setNewVersion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkVersion = async () => {
      try {
        // The timestamp keeps iOS from answering with a cached response.
        const res = await fetch(`/api/version?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const latest = (await res.json()) as VersionResponse;
        if (!cancelled && latest.buildId && latest.buildId !== buildId) {
          setNewVersion(latest.version);
        }
      } catch {
        // Offline or the server is restarting; try again on the next check.
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
    <AnimatePresence>
      {newVersion && (
        <motion.div
          role="status"
          className="fixed inset-x-4 bottom-10 z-50 sm:left-auto sm:right-4 sm:w-96"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-left text-white shadow-lg transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400"
          >
            <span className="flex-1">
              <span className="block font-semibold">A new version is available</span>
              <span className="block text-sm text-blue-100">
                Version {newVersion}. Tap to refresh.
              </span>
            </span>
            <span aria-hidden="true" className="text-xl">↻</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
