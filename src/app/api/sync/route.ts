import { getSyncCopy, profileFor, saveSyncCopy } from '@/lib/server/sync';

// Answer every request from the saved copy rather than a build-time one.
export const dynamic = 'force-dynamic';

/** A device's progress is a few hundred KB at most; refuse anything far bigger. */
const maxBodyBytes = 5 * 1024 * 1024;

const noStore = { 'Cache-Control': 'no-store' };

function invalidCode() {
  return Response.json({ error: 'Invalid sync code' }, { status: 400 });
}

/** The progress of the profile named by the X-Sync-Code header, with its revision. */
export async function GET(request: Request) {
  const file = profileFor(request.headers.get('x-sync-code'));
  if (!file) return invalidCode();
  return Response.json(await getSyncCopy(file), { headers: noStore });
}

/**
 * Saves a device's merged progress to its profile. 409 with the current copy
 * when another device saved since `revision`; the device merges that and
 * tries again.
 */
export async function PUT(request: Request) {
  const file = profileFor(request.headers.get('x-sync-code'));
  if (!file) return invalidCode();
  const text = await request.text();
  if (text.length > maxBodyBytes) return Response.json({ error: 'Too large' }, { status: 413 });
  let body: { revision?: unknown; progress?: unknown } | null = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Handled below.
  }
  if (!Number.isInteger(body?.revision) || typeof body?.progress !== 'object' || body.progress === null) {
    return Response.json({ error: 'Invalid progress' }, { status: 400 });
  }
  const result = await saveSyncCopy(file, Number(body.revision), body.progress);
  return Response.json(result.copy, { status: result.saved ? 200 : 409, headers: noStore });
}
