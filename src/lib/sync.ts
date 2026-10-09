import { useSyncExternalStore } from 'react';
import { setServerReachable } from './connection';
import {
  applySyncedProgress,
  emptyProgress,
  getProgress,
  mergeProgressData,
  normalizeProgress,
  normalizeSyncCode,
  subscribeProgress
} from './progress-store';
import type { ProgressData, SyncCopy } from './progress-store';

export type SyncState = 'off' | 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncStatus {
  state: SyncState;
  /** This device's sync code; null when sync is off. */
  code: string | null;
  /** ISO date and time this device last synced, if ever. */
  lastSyncedAt: string | null;
}

/** The copy this device last synced, kept as the base for the next merge. */
interface SyncedBase {
  /** The sync code it belongs to; a base from another code doesn't count. */
  code: string;
  revision: number;
  syncedAt: string;
  progress: ProgressData;
}

const baseKey = 'practice-progress-synced';
const codeKey = 'practice-sync-code';
/** Letters and digits that can't be mistaken for each other when typed. */
const codeAlphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
const endpoint = '/api/sync';
/** Give up on an unreachable server after this long and stay local. */
const timeoutMs = 8000;
/** Wait for a burst of answers to finish before syncing them. */
const changeDelayMs = 2000;
/** Pick up other devices' changes while the app stays open. */
const pollMs = 2 * 60 * 1000;

let status: SyncStatus = { state: 'off', code: null, lastSyncedAt: null };
const listeners = new Set<() => void>();

function setStatus(next: Partial<SyncStatus>) {
  status = { ...status, ...next };
  listeners.forEach((listener) => listener());
}

function readCode(): string | null {
  try {
    return normalizeSyncCode(window.localStorage.getItem(codeKey) ?? '');
  } catch {
    return null;
  }
}

function readBase(code: string | null): SyncedBase | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(baseKey) ?? 'null');
    if (!saved || !code || saved.code !== code || !Number.isInteger(saved.revision)) return null;
    return { code, revision: saved.revision, syncedAt: String(saved.syncedAt), progress: normalizeProgress(saved.progress) };
  } catch {
    return null;
  }
}

function writeBase(base: SyncedBase) {
  try {
    window.localStorage.setItem(baseKey, JSON.stringify(base));
  } catch {
    // Storage full or blocked: the next sync merges without a base, which only adds.
  }
}

/** A new random sync code such as 'k7mq-x3fp-9tdw', about 59 bits. */
export function createSyncCode() {
  const values = crypto.getRandomValues(new Uint32Array(12));
  const letters = Array.from(values, (value) => codeAlphabet[value % codeAlphabet.length]).join('');
  return letters.match(/.{4}/g)!.join('-');
}

/** Whether `code` can be used as a sync code. */
export function isValidSyncCode(code: string) {
  return normalizeSyncCode(code) !== null;
}

/**
 * Starts syncing this device with every device that uses `code`, merging
 * what is saved here into that profile; null stops syncing (progress stays
 * on this device).
 */
export function setSyncCode(code: string | null) {
  const normalized = code ? normalizeSyncCode(code) : null;
  try {
    window.localStorage.removeItem(baseKey);
    if (normalized) window.localStorage.setItem(codeKey, normalized);
    else window.localStorage.removeItem(codeKey);
  } catch {
    // Storage blocked: sync for this visit only.
  }
  status = { state: normalized ? 'idle' : 'off', code: normalized, lastSyncedAt: null };
  listeners.forEach((listener) => listener());
  if (normalized) void syncNow();
}

class Unreachable extends Error {}

async function request(code: string, init?: RequestInit): Promise<{ status: number; copy: SyncCopy }> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
      ...init,
      headers: { ...init?.headers, 'X-Sync-Code': code }
    });
  } catch {
    throw new Unreachable();
  }
  if (response.status !== 200 && response.status !== 409) throw new Error(`Sync failed (${response.status})`);
  const copy = (await response.json()) as SyncCopy;
  return { status: response.status, copy: { ...copy, progress: normalizeProgress(copy.progress) } };
}

/** Whether a sync is writing its result into the progress store right now. */
let applying = false;
let running: Promise<void> | null = null;
let again = false;

/**
 * Merges this device's progress with the server's copy and saves the result
 * on both. Progress is always saved on the device first, so being offline
 * only delays this. Safe to call often: calls during a sync run once more
 * after it.
 */
export function syncNow(): Promise<void> {
  if (!status.code) return Promise.resolve();
  if (running) {
    again = true;
    return running;
  }
  running = (async () => {
    setStatus({ state: 'syncing' });
    try {
      do {
        again = false;
        await syncOnce();
      } while (again);
      if (!status.code) return;
      setStatus({ state: 'synced', lastSyncedAt: readBase(status.code)?.syncedAt ?? null });
      setServerReachable(true);
    } catch (error) {
      if (error instanceof Unreachable) setServerReachable(false);
      if (!status.code) return;
      setStatus({ state: error instanceof Unreachable ? 'offline' : 'error' });
    } finally {
      running = null;
    }
  })();
  return running;
}

async function syncOnce() {
  const code = status.code;
  if (!code) return;
  const base = readBase(code);
  // Another device may save in between; then merge its copy and try again.
  for (let tries = 0; tries < 5; tries += 1) {
    const sent = getProgress();
    const { copy: server } = await request(code);
    const merged = mergeProgressData(base?.progress ?? emptyProgress, sent, server.progress);
    let result = server;
    if (JSON.stringify(merged) !== JSON.stringify(server.progress)) {
      const saved = await request(code, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: server.revision, progress: merged })
      });
      if (saved.status === 409) continue;
      result = saved.copy;
    }
    // Sync was stopped or the code changed meanwhile: don't take this result.
    if (status.code !== code) return;
    if (JSON.stringify(result.progress) !== JSON.stringify(sent)) {
      applying = true;
      try {
        applySyncedProgress(sent, result.progress);
      } finally {
        applying = false;
      }
    }
    writeBase({ code, revision: result.revision, syncedAt: new Date().toISOString(), progress: result.progress });
    return;
  }
  throw new Error('Sync kept conflicting');
}

/**
 * Keeps this device in sync, if it has a sync code, while the app is open: once now, shortly after
 * every change, when the connection comes back or the app returns to the
 * foreground, and every few minutes. Returns a function that stops it.
 */
export function startSync() {
  const code = readCode();
  status = { state: code ? 'idle' : 'off', code, lastSyncedAt: readBase(code)?.syncedAt ?? null };
  let changeTimer: number | undefined;
  const sync = () => {
    window.clearTimeout(changeTimer);
    void syncNow();
  };
  const handleChange = () => {
    if (applying) return;
    window.clearTimeout(changeTimer);
    changeTimer = window.setTimeout(sync, changeDelayMs);
  };
  const handleVisible = () => {
    if (document.visibilityState === 'visible') sync();
  };
  const stopWatching = subscribeProgress(handleChange);
  const poll = window.setInterval(() => document.visibilityState === 'visible' && sync(), pollMs);
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', handleVisible);
  sync();
  return () => {
    stopWatching();
    window.clearTimeout(changeTimer);
    window.clearInterval(poll);
    window.removeEventListener('online', sync);
    document.removeEventListener('visibilitychange', handleVisible);
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Whether this device's progress is in sync with the server, for Settings. */
export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => status
  );
}
