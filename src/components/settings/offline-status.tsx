'use client';

import { useEffect, useState } from 'react';

type OfflineState = 'checking' | 'ready' | 'downloading' | 'not-set-up' | 'needs-https' | 'unsupported';

const messages: Record<Exclude<OfflineState, 'checking'>, { title: string; detail: string }> = {
  ready: {
    title: 'Ready',
    detail: 'All exams are saved on this device and work without internet.'
  },
  downloading: {
    title: 'Downloading',
    detail: 'The exams are being saved for offline use. Keep the app open for a moment while online.'
  },
  'not-set-up': {
    title: 'Not set up yet',
    detail: 'Open the app once while online and the exams are saved for offline use.'
  },
  'needs-https': {
    title: 'Not available on this address',
    detail:
      'Browsers only allow offline use on https addresses. This page was opened over http, so it needs a connection to the server.'
  },
  unsupported: {
    title: 'Not supported',
    detail: 'This browser cannot save the app for offline use.'
  }
};

/** Whether the service worker (public/sw.js) has saved the app for offline use on this device. */
async function checkOffline(): Promise<OfflineState> {
  if (!window.isSecureContext) return 'needs-https';
  if (!('serviceWorker' in navigator)) return 'unsupported';
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration?.installing || registration?.waiting) return 'downloading';
  if (registration?.active) {
    const names = await caches.keys();
    if (names.some((name) => name.startsWith('azure-exams-'))) return 'ready';
  }
  return 'not-set-up';
}

/** Settings section showing whether the exams work offline on this device, and why not. */
export function OfflineStatus() {
  const [state, setState] = useState<OfflineState>('checking');

  useEffect(() => {
    let cancelled = false;
    const update = () => {
      checkOffline()
        .then((next) => !cancelled && setState(next))
        .catch(() => !cancelled && setState('not-set-up'));
    };
    update();
    // Follow a download in progress until it finishes.
    const timer = window.setInterval(update, 2000);
    navigator.serviceWorker?.addEventListener('controllerchange', update);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      navigator.serviceWorker?.removeEventListener('controllerchange', update);
    };
  }, []);

  const message = state === 'checking' ? null : messages[state];
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Offline use</h2>
      <p className="mt-1 text-sm text-ink-muted">Practise without Wi-Fi once the app has been opened online.</p>
      <div className="mt-4 rounded-xl border border-line bg-surface-muted px-4 py-3" role="status">
        {message ? (
          <>
            <p className={state === 'ready' ? 'font-semibold text-success' : 'font-semibold text-ink'}>{message.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{message.detail}</p>
          </>
        ) : (
          <p className="text-sm text-ink-muted">Checking...</p>
        )}
      </div>
    </section>
  );
}
