import { reminderStatus } from '@/lib/server/reminders';

export const dynamic = 'force-dynamic';

/** Whether the server has this device's reminder and what it will do today, for Settings. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint !== 'string') return Response.json({ error: 'Invalid endpoint' }, { status: 400 });
  return Response.json(await reminderStatus(body.endpoint), { headers: { 'Cache-Control': 'no-store' } });
}
