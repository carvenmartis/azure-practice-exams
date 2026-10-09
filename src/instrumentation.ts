import type { Instrumentation } from 'next';

/** Runs once when the server starts: logs the build and begins sending daily goal reminders. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { log } = await import('./lib/server/log');
  const { buildId } = await import('./lib/version');
  log.info('server started', { build: buildId || 'local', node: process.version, logLevel: process.env.LOG_LEVEL || 'info' });
  const { startReminderScheduler } = await import('./lib/server/reminders');
  startReminderScheduler();
}

/**
 * Logs every error a page or API route throws, with the route it came from.
 * Next.js already prints the stack just above, so only the message goes here.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { log } = await import('./lib/server/log');
  const digest = (error as { digest?: string } | null)?.digest;
  log.error(
    'request failed',
    { method: request.method, path: request.path.split('?')[0], route: context.routePath, type: context.routeType, digest },
    error instanceof Error ? error.message : error
  );
};
