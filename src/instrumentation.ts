/** Runs once when the server starts: begins sending daily goal reminders. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { startReminderScheduler } = await import('./lib/server/reminders');
  startReminderScheduler();
}
