import { isProgressReport, saveProgress } from '@/lib/server/reminders';

/** Today's answers on one device, so no reminder goes out once the goal is reached. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint !== 'string' || !isProgressReport(body?.progress)) {
    return Response.json({ error: 'Invalid progress' }, { status: 400 });
  }
  await saveProgress(body.endpoint, body.progress);
  return new Response(null, { status: 204 });
}
