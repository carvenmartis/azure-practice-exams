import { publicKey } from '@/lib/server/reminders';

export const dynamic = 'force-dynamic';

/** The public VAPID key browsers subscribe to daily goal reminders with. */
export async function GET() {
  return Response.json({ publicKey: await publicKey() }, { headers: { 'Cache-Control': 'no-store' } });
}
