import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { emptyProgress, normalizeProgress, normalizeSyncCode } from '@/lib/progress-data';
import type { SyncCopy } from '@/lib/progress-data';

/**
 * Progress sync (server side). There are no accounts: a device picks a sync
 * code in Settings, and every device with the same code shares one copy of
 * the progress. The code is only stored as a SHA-256 hash, which names the
 * profile's file. Each save bumps `revision`, and a save based on an older
 * revision is refused so the device merges the newer copy first.
 *
 * Profiles live in SYNC_DATA_DIR (default ./sync-data, /app/sync-data in the
 * Docker image). The NAS replaces the container on every image update, so a
 * NAS folder has to be mapped to that path to keep them; otherwise devices
 * upload their progress again after an update, which loses nothing they hold.
 */

const dataDir = process.env.SYNC_DATA_DIR || path.join(process.cwd(), 'sync-data');

const copies = new Map<string, Promise<SyncCopy>>();
/** Saves go one after another, so two devices can't both save on the same revision. */
let queue: Promise<unknown> = Promise.resolve();

/** The profile file for a sync code, or null if the code isn't valid. */
export function profileFor(code: string | null) {
  const normalized = normalizeSyncCode(code ?? '');
  if (!normalized) return null;
  return path.join(dataDir, `${createHash('sha256').update(normalized).digest('hex')}.json`);
}

async function readCopy(file: string): Promise<SyncCopy> {
  try {
    const saved = JSON.parse(await readFile(file, 'utf8')) as Partial<SyncCopy>;
    return {
      revision: Number.isInteger(saved.revision) ? Number(saved.revision) : 0,
      updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : null,
      progress: normalizeProgress(saved.progress)
    };
  } catch {
    return { revision: 0, updatedAt: null, progress: emptyProgress };
  }
}

/** The profile's copy of the progress; empty with revision 0 for a new code. */
export function getSyncCopy(file: string) {
  let copy = copies.get(file);
  if (!copy) {
    copy = readCopy(file);
    copies.set(file, copy);
  }
  return copy;
}

/**
 * Replaces the profile's copy if `revision` is still the current one. Returns
 * the new copy, or the current one with `saved: false` when another device
 * saved in between.
 */
export function saveSyncCopy(file: string, revision: number, progress: unknown) {
  const task = queue.then(async () => {
    const current = await getSyncCopy(file);
    if (revision !== current.revision) return { saved: false, copy: current };
    const next: SyncCopy = {
      revision: current.revision + 1,
      updatedAt: new Date().toISOString(),
      progress: normalizeProgress(progress)
    };
    await mkdir(dataDir, { recursive: true });
    const temp = `${file}.tmp`;
    await writeFile(temp, JSON.stringify(next));
    await rename(temp, file);
    copies.set(file, Promise.resolve(next));
    return { saved: true, copy: next };
  });
  queue = task.catch(() => undefined);
  return task;
}
