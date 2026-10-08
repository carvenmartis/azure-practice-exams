import { getProgress, localDay, mergeProgress, normalizeProgress } from './progress-store';
import type { ProgressData } from './progress-store';

/** Marks a file as a backup of this app, so other JSON files are refused. */
const backupApp = 'azure-practice-exams';
const backupVersion = 1;

interface BackupFile {
  app: typeof backupApp;
  version: number;
  /** ISO date and time the backup was made. */
  exportedAt: string;
  progress: ProgressData;
}

/** What a backup file holds, for the import confirmation. */
export interface BackupSummary {
  exportedAt: string;
  attempts: number;
  mistakes: number;
  bookmarks: number;
  progress: ProgressData;
}

function countIds(lists: Record<string, string[]>) {
  return Object.values(lists).reduce((sum, ids) => sum + (Array.isArray(ids) ? ids.length : 0), 0);
}

/** Downloads everything saved in this browser as a JSON file. */
export function downloadBackup() {
  const backup: BackupFile = {
    app: backupApp,
    version: backupVersion,
    exportedAt: new Date().toISOString(),
    progress: getProgress()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `azure-exams-backup-${localDay()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari needs the URL a little longer than the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Reads a backup file; throws an Error with a readable message if it isn't one. */
export async function readBackup(file: File): Promise<BackupSummary> {
  let parsed: Partial<BackupFile>;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error('This file is not a backup from this app.');
  }
  if (parsed?.app !== backupApp || typeof parsed.progress !== 'object') {
    throw new Error('This file is not a backup from this app.');
  }
  if (Number(parsed.version) > backupVersion) {
    throw new Error('This backup comes from a newer version of the app. Update the app on this device first.');
  }
  const progress = normalizeProgress(parsed.progress);
  return {
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
    attempts: progress.attempts.length,
    mistakes: countIds(progress.mistakes),
    bookmarks: countIds(progress.bookmarks),
    progress
  };
}

/** Adds the backup to the progress saved here; nothing on this device is deleted. */
export function importBackup(summary: BackupSummary) {
  mergeProgress(summary.progress);
}
