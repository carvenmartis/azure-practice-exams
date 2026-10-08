import { removeReminder } from '@/lib/server/reminders';

/** Turns off the daily goal reminder for one device. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint !== 'string') return Response.json({ error: 'Invalid endpoint' }, { status: 400 });
  await removeReminder(body.endpoint);
  return new Response(null, { status: 204 });
}
