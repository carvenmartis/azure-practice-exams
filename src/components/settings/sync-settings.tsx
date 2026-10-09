'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSyncCode, isValidSyncCode, setSyncCode, syncNow, useSyncStatus } from '@/lib/sync';
import type { SyncState } from '@/lib/sync';
import { cn, focusRing } from '@/lib/utils';

const titles: Record<Exclude<SyncState, 'off'>, string> = {
  idle: 'Not synced yet',
  syncing: 'Syncing...',
  synced: 'Up to date',
  offline: 'Waiting for the server',
  error: 'Could not sync'
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function detail(state: SyncState, lastSyncedAt: string | null) {
  const last = lastSyncedAt ? `Last synced ${formatTime(lastSyncedAt)}.` : 'This device has not synced yet.';
  if (state === 'offline') return `The server can't be reached right now. Progress is saved here and syncs when it's back. ${last}`;
  if (state === 'error') return `The server could not save the progress. Try again in a moment. ${last}`;
  return last;
}

/** Turning sync on: make a new code, or type the one from another device. */
function SyncCodeForm() {
  const [typed, setTyped] = useState('');
  const [error, setError] = useState(false);
  return (
    <>
      <div className="mt-4">
        <Button onClick={() => setSyncCode(createSyncCode())}>Create a sync code</Button>
      </div>
      <form
        className="mt-4 flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isValidSyncCode(typed)) {
            setError(true);
            return;
          }
          setSyncCode(typed);
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink-muted">Or enter the code from another device</span>
          <input
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value);
              setError(false);
            }}
            placeholder="k7mq-x3fp-9tdw"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={error}
            className={cn('w-56 rounded-lg border border-line-strong bg-surface px-3 py-2 font-mono text-ink', focusRing)}
          />
        </label>
        <Button type="submit" variant="secondary">
          Use code
        </Button>
      </form>
      {error && (
        <p className="mt-3 text-sm font-semibold text-danger" role="status">
          A sync code is 8 to 64 letters, digits and dashes.
        </p>
      )}
    </>
  );
}

/**
 * Settings section for progress sync. Devices that use the same sync code
 * share progress through the server; the section shows the code, whether
 * this device is in step, and lets you sync right away or stop.
 */
export function SyncSettings() {
  const { state, code, lastSyncedAt } = useSyncStatus();
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Sync</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Devices with the same sync code share progress, mistakes, bookmarks, review dates and the daily goal through
        the server. There are no accounts: anyone who has the code can see and change that progress. Everything is
        saved on this device first, so it keeps working offline.
      </p>
      {state === 'off' || !code ? (
        <SyncCodeForm />
      ) : (
        <>
          <p className="mt-4 text-sm text-ink-muted">
            Sync code: <span className="select-all font-mono font-semibold text-ink">{code}</span>
            <br />
            Enter it in Settings on your other devices.
          </p>
          <div className="mt-4 rounded-xl border border-line bg-surface-muted px-4 py-3" role="status">
            <p className={state === 'synced' ? 'font-semibold text-success' : 'font-semibold text-ink'}>{titles[state]}</p>
            {state !== 'syncing' && <p className="mt-1 text-sm text-ink-muted">{detail(state, lastSyncedAt)}</p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" disabled={state === 'syncing'} onClick={() => void syncNow()}>
              Sync now
            </Button>
            <Button variant="ghost" onClick={() => setSyncCode(null)}>
              Stop syncing on this device
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
