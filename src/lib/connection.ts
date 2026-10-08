import { useSyncExternalStore } from 'react';

/**
 * Whether the last /api/version check reached the server. navigator.onLine
 * alone misses Wi-Fi without internet, so the update notice reports here too.
 */
let serverReachable = true;
const listeners = new Set<() => void>();

/** Called by the update notice after every version check. */
export function setServerReachable(reachable: boolean) {
  if (reachable === serverReachable) return;
  serverReachable = reachable;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
}

/** False when the device has no connection or the server doesn't answer. */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, () => navigator.onLine && serverReachable, () => true);
}
