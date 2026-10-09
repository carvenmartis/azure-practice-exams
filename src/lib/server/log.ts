/**
 * Server log lines for the container log (Synology Container Manager >
 * Container > Log), e.g.
 *
 *   2026-10-09T11:32:36.123Z INFO  sync saved profile=3f9a1c2e revision=5
 *
 * Info goes to stdout, warnings and errors to stderr. LOG_LEVEL picks the
 * lowest level written: debug, info (default), warn or error. Never pass sync
 * codes, push endpoints or progress here; profiles are named by the first
 * characters of their hash (profileId in src/lib/server/sync.ts).
 */

type Level = 'debug' | 'info' | 'warn' | 'error';
type Fields = Record<string, string | number | boolean | null | undefined>;

const levels: Level[] = ['debug', 'info', 'warn', 'error'];
const requested = levels.indexOf((process.env.LOG_LEVEL ?? '').toLowerCase() as Level);
const minimum = requested === -1 ? levels.indexOf('info') : requested;

/** `key=value` pairs, quoting values with spaces so lines stay easy to scan. */
function format(fields: Fields) {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const text = String(value);
      return `${key}=${/[\s"=]/.test(text) || text === '' ? JSON.stringify(text) : text}`;
    })
    .join(' ');
}

/** Writes one line; an `error` adds its message to the line, and its stack below errors. */
function write(level: Level, message: string, fields: Fields = {}, error?: unknown) {
  if (levels.indexOf(level) < minimum) return;
  const reason = error === undefined ? undefined : error instanceof Error ? error.message : String(error);
  const line = [new Date().toISOString(), level.toUpperCase().padEnd(5), message, format({ ...fields, error: reason })]
    .filter(Boolean)
    .join(' ');
  const stack = error instanceof Error && error.stack ? `\n${error.stack}` : '';
  if (level === 'error') console.error(line + stack);
  else if (level === 'warn') console.error(line);
  else console.log(line);
}

export const log = {
  debug: (message: string, fields?: Fields) => write('debug', message, fields),
  info: (message: string, fields?: Fields) => write('info', message, fields),
  warn: (message: string, fields?: Fields, error?: unknown) => write('warn', message, fields, error),
  error: (message: string, fields?: Fields, error?: unknown) => write('error', message, fields, error)
};
