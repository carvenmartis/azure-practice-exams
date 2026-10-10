import { log } from './lib/server/log';
import { startReminderScheduler } from './lib/server/reminders';
import { buildId } from './lib/version';

/**
 * Node-only start-up for src/instrumentation.ts: logs the build and starts the
 * reminder scheduler. It is imported only when NEXT_RUNTIME is 'nodejs', so the
 * Edge build never sees process.version, node:fs or web-push.
 */
export function startServer() {
  log.info('server started', { build: buildId || 'local', node: process.version, logLevel: process.env.LOG_LEVEL || 'info' });
  startReminderScheduler();
}
