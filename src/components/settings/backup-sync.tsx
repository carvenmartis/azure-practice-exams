'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { downloadBackup, importBackup, readBackup } from '@/lib/backup';
import type { BackupSummary } from '@/lib/backup';

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function formatDate(iso: string) {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'an unknown date';
}

/**
 * Settings section to move progress between devices: export saves attempts,
 * mistakes, bookmarks and the daily goal to a file; import adds a file's
 * contents to this device after asking.
 */
export function BackupSync() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<BackupSummary | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setMessage(null);
    try {
      setPending(await readBackup(file));
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Could not read this file.', error: true });
    }
  };

  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Backup and sync</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Your progress, mistakes, bookmarks and daily goal are saved only in this browser. Export them to a file, then
        import that file on another device to carry on there.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          onClick={() => {
            downloadBackup();
            setMessage({ text: 'Backup saved. On iPhone and iPad it is in the Files app, under Downloads.' });
          }}
        >
          Export backup
        </Button>
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          Import backup
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>
      {message && (
        <p className={message.error ? 'mt-3 text-sm font-semibold text-danger' : 'mt-3 text-sm text-ink-muted'} role="status">
          {message.text}
        </p>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Import this backup?"
        message={
          pending
            ? `It was made on ${formatDate(pending.exportedAt)} and holds ${plural(pending.attempts, 'attempt')}, ${plural(pending.mistakes, 'mistake')} and ${plural(pending.bookmarks, 'bookmark')}. They are added to what is saved here; nothing on this device is deleted.`
            : ''
        }
        confirmLabel="Import"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (pending) importBackup(pending);
          setPending(null);
          setMessage({ text: 'Backup imported.' });
        }}
        onCancel={() => setPending(null)}
      />
    </section>
  );
}
