import { isProgressReport, isSubscription, isTime, isTimeZone, saveReminder } from '@/lib/server/reminders';

/** Turns on, or changes the time of, the daily goal reminder for one device. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isSubscription(body?.subscription) || !isTime(body?.time) || !isTimeZone(body?.timeZone)) {
    return Response.json({ error: 'Invalid reminder' }, { status: 400 });
  }
  await saveReminder(body.subscription, body.time, body.timeZone, isProgressReport(body.progress) ? body.progress : undefined);
  return new Response(null, { status: 204 });
}
