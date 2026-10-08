import { isProgressReport, pushErrorDetail, sendTest } from '@/lib/server/reminders';

/** Sends one reminder right away, for the test button in Settings. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint !== 'string') return Response.json({ error: 'Invalid endpoint' }, { status: 400 });
  try {
    const found = await sendTest(body.endpoint, isProgressReport(body.progress) ? body.progress : undefined);
    return found ? new Response(null, { status: 204 }) : Response.json({ error: 'Unknown device' }, { status: 404 });
  } catch (error) {
    const detail = pushErrorDetail(error);
    console.error('Test reminder failed:', detail);
    return Response.json({ error: `The push service refused the reminder (${detail}).` }, { status: 502 });
  }
}
