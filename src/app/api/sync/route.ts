import { log } from '@/lib/server/log';
import { getSyncCopy, profileFor, profileId, saveSyncCopy } from '@/lib/server/sync';

// Answer every request from the saved copy rather than a build-time one.
export const dynamic = 'force-dynamic';

/** A device's progress is a few hundred KB at most; refuse anything far bigger. */
const maxBodyBytes = 5 * 1024 * 1024;

const noStore = { 'Cache-Control': 'no-store' };

function invalidCode(method: string) {
  log.warn('sync refused: invalid code', { method });
  return Response.json({ error: 'Invalid sync code' }, { status: 400 });
}

/** The progress of the profile named by the X-Sync-Code header, with its revision. */
export async function GET(request: Request) {
  const file = profileFor(request.headers.get('x-sync-code'));
  if (!file) return invalidCode('GET');
  const copy = await getSyncCopy(file);
  log.debug('sync read', { profile: profileId(file), revision: copy.revision });
  return Response.json(copy, { headers: noStore });
}

/**
 * Saves a device's merged progress to its profile. 409 with the current copy
 * when another device saved since `revision`; the device merges that and
 * tries again.
 */
export async function PUT(request: Request) {
  const file = profileFor(request.headers.get('x-sync-code'));
  if (!file) return invalidCode('PUT');
  const profile = profileId(file);
  const text = await request.text();
  if (text.length > maxBodyBytes) {
    log.warn('sync refused: too large', { profile, bytes: text.length });
    return Response.json({ error: 'Too large' }, { status: 413 });
  }
  let body: { revision?: unknown; progress?: unknown } | null = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Handled below.
  }
  if (!Number.isInteger(body?.revision) || typeof body?.progress !== 'object' || body.progress === null) {
    log.warn('sync refused: invalid progress', { profile });
    return Response.json({ error: 'Invalid progress' }, { status: 400 });
  }
  const result = await saveSyncCopy(file, Number(body.revision), body.progress);
  if (result.saved) log.info('sync saved', { profile, revision: result.copy.revision, bytes: text.length });
  else log.info('sync conflict, device will merge', { profile, sent: Number(body.revision), current: result.copy.revision });
  return Response.json(result.copy, { status: result.saved ? 200 : 409, headers: noStore });
}
