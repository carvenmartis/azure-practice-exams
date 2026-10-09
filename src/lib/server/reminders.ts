import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import webpush from 'web-push';
import type { PushSubscription } from 'web-push';
import { log } from '@/lib/server/log';

/**
 * Daily goal reminders (server side). Each device that turns the reminder on
 * in Settings stores its push subscription here with a time of day and time
 * zone; once a minute the scheduler sends a notification to every device
 * whose time has come and whose goal for today isn't reached yet.
 *
 * Everything lives in REMINDER_DATA_DIR (default ./reminder-data): the VAPID
 * keys, made on first use unless VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are
 * set, and the subscriptions. The NAS replaces the container on every image
 * update, which empties the folder; devices then register again when the app
 * opens (syncReminder in src/lib/reminders.ts). Web push only works for pages
 * opened over https.
 */

/** What the browser last told us about today's goal. */
export interface ProgressReport {
  /** The device's local day, '2026-10-08'. */
  day: string;
  count: number;
  goal: number;
  streak: number;
}

interface Reminder {
  subscription: PushSubscription;
  /** Local time of day, '19:00'. */
  time: string;
  timeZone: string;
  progress?: ProgressReport;
  /** Local day the last reminder went out, so it goes out once a day. */
  lastSent?: string;
}

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

const dataDir = process.env.REMINDER_DATA_DIR || path.join(process.cwd(), 'reminder-data');
const keysFile = path.join(dataDir, 'vapid-keys.json');
const remindersFile = path.join(dataDir, 'reminders.json');
/**
 * Contact sent with every push. Apple refuses (403 BadJwtToken) subjects it
 * can't use, such as a mailto: on a .local or localhost domain, so the
 * default is the app's public Docker Hub page. VAPID_SUBJECT overrides it.
 */
const subject = process.env.VAPID_SUBJECT || 'https://hub.docker.com/r/carvenmartisit/azure-practice-exams';
/** A reminder missed by a restart still goes out this long after its time, not later. */
const lateLimitMinutes = 120;
/** A handful of devices per household; old ones drop off beyond this. */
const maxReminders = 50;

let keys: Promise<VapidKeys> | null = null;
let reminders: Promise<Reminder[]> | null = null;
/** Writes go one after another, so two requests can't lose each other's change. */
let queue: Promise<unknown> = Promise.resolve();

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, value: unknown) {
  await mkdir(dataDir, { recursive: true });
  const temp = `${file}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2));
  await rename(temp, file);
}

/** The server's VAPID key pair, made and saved the first time it's needed. */
function vapidKeys() {
  keys ??= (async () => {
    const { VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: privateKey } = process.env;
    if (publicKey && privateKey) return { publicKey, privateKey };
    const saved = await readJson<VapidKeys>(keysFile);
    if (saved?.publicKey && saved.privateKey) return saved;
    const made = webpush.generateVAPIDKeys();
    await writeJson(keysFile, made);
    log.info('reminders: made new VAPID keys, devices must turn reminders on again', { dir: dataDir });
    return made;
  })().catch((error) => {
    keys = null;
    throw error;
  });
  return keys;
}

export async function publicKey() {
  return (await vapidKeys()).publicKey;
}

function loadReminders() {
  reminders ??= readJson<Reminder[]>(remindersFile).then((saved) => {
    const list = Array.isArray(saved) ? saved : [];
    log.info('reminders loaded', { devices: list.length, dir: dataDir });
    return list;
  });
  return reminders;
}

/** The push service a device uses (e.g. web.push.apple.com), for the log; the full endpoint is secret. */
function pushService(endpoint: string) {
  try {
    return new URL(endpoint).host;
  } catch {
    return 'unknown';
  }
}

/** Changes the saved reminders; calls run one at a time. */
function updateReminders(change: (list: Reminder[]) => Reminder[]) {
  const run = queue.then(async () => {
    const next = change(await loadReminders());
    reminders = Promise.resolve(next);
    await writeJson(remindersFile, next);
  });
  queue = run.catch(() => {});
  return run;
}

export function isSubscription(value: unknown): value is PushSubscription {
  const sub = value as PushSubscription | null;
  return (
    typeof sub?.endpoint === 'string' &&
    sub.endpoint.startsWith('https://') &&
    typeof sub.keys?.p256dh === 'string' &&
    typeof sub.keys?.auth === 'string'
  );
}

export function isProgressReport(value: unknown): value is ProgressReport {
  const report = value as ProgressReport | null;
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(report?.day ?? '') &&
    [report?.count, report?.goal, report?.streak].every((n) => Number.isInteger(n) && (n as number) >= 0)
  );
}

export function isTime(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isTimeZone(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function saveReminder(subscription: PushSubscription, time: string, timeZone: string, progress?: ProgressReport) {
  log.info('reminder saved', { service: pushService(subscription.endpoint), time, timeZone });
  return updateReminders((list) => {
    const existing = list.find((item) => item.subscription.endpoint === subscription.endpoint);
    const others = list.filter((item) => item !== existing);
    return [...others, { subscription, time, timeZone, progress, lastSent: existing?.lastSent }].slice(-maxReminders);
  });
}

export function removeReminder(endpoint: string) {
  log.info('reminder removed', { service: pushService(endpoint) });
  return updateReminders((list) => list.filter((item) => item.subscription.endpoint !== endpoint));
}

export function saveProgress(endpoint: string, progress: ProgressReport) {
  return updateReminders((list) =>
    list.map((item) => (item.subscription.endpoint === endpoint ? { ...item, progress } : item))
  );
}

/** The day ('2026-10-08') and minutes since midnight at `now` in the time zone. */
function localNow(timeZone: string, now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value])
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

/** The notification text for today's progress. */
function message(progress: ProgressReport | undefined, today: string) {
  const goal = progress?.goal ?? 20;
  const count = progress?.day === today ? progress.count : 0;
  const streak = progress?.streak ?? 0;
  const left = Math.max(goal - count, 0);
  const keepStreak = streak > 0 ? ` Keep your ${streak}-day streak going.` : '';
  return {
    title: 'Time for your daily goal',
    body: count
      ? `${count} of ${goal} questions done today, ${left} to go.${keepStreak}`
      : `Answer ${goal} questions today.${keepStreak}`,
    url: '/'
  };
}

async function send(reminder: Reminder, today: string) {
  const vapid = await vapidKeys();
  await webpush.sendNotification(reminder.subscription, JSON.stringify(message(reminder.progress, today)), {
    vapidDetails: { subject, publicKey: vapid.publicKey, privateKey: vapid.privateKey },
    TTL: 60 * 60,
    urgency: 'normal'
  });
}

/** The push service's status and reason, e.g. '403 BadJwtToken', for error messages. */
export function pushErrorDetail(error: unknown) {
  const { statusCode, body, message } = (error ?? {}) as { statusCode?: number; body?: string; message?: string };
  if (!statusCode) return message ?? 'no answer';
  let reason = body ?? '';
  try {
    reason = JSON.parse(reason).reason ?? reason;
  } catch {
    // Not JSON: keep the text.
  }
  return `${statusCode} ${reason}`.trim().slice(0, 200);
}

/** Whether the push service says the subscription is gone for good. */
function isExpired(error: unknown) {
  const status = (error as { statusCode?: number })?.statusCode;
  return status === 404 || status === 410;
}

/** What the server knows about one device's reminder, for Settings. */
export async function reminderStatus(endpoint: string) {
  const reminder = (await loadReminders()).find((item) => item.subscription.endpoint === endpoint);
  if (!reminder) return { registered: false as const };
  const local = localNow(reminder.timeZone, new Date());
  const progress = reminder.progress;
  return {
    registered: true as const,
    time: reminder.time,
    timeZone: reminder.timeZone,
    serverTime: `${String(Math.floor(local.minutes / 60)).padStart(2, '0')}:${String(local.minutes % 60).padStart(2, '0')}`,
    sentToday: reminder.lastSent === local.day,
    goalReachedToday: progress?.day === local.day && progress.count >= progress.goal
  };
}

/** Sends a reminder now, for the Settings test button. */
export async function sendTest(endpoint: string, progress?: ProgressReport) {
  const reminder = (await loadReminders()).find((item) => item.subscription.endpoint === endpoint);
  if (!reminder) {
    log.warn('test reminder: device not registered', { service: pushService(endpoint) });
    return false;
  }
  const today = localNow(reminder.timeZone, new Date()).day;
  await send({ ...reminder, progress: progress ?? reminder.progress }, today);
  log.info('test reminder sent', { service: pushService(endpoint) });
  return true;
}

/** Sends every reminder that is due now and hasn't gone out today. */
async function sendDueReminders() {
  const now = new Date();
  const sent = new Map<string, string>();
  const expired = new Set<string>();
  for (const reminder of await loadReminders()) {
    const local = localNow(reminder.timeZone, now);
    const [hour, minute] = reminder.time.split(':').map(Number);
    const late = local.minutes - (hour * 60 + minute);
    if (late < 0 || late > lateLimitMinutes || reminder.lastSent === local.day) continue;
    const progress = reminder.progress;
    if (progress?.day === local.day && progress.count >= progress.goal) continue;
    try {
      await send(reminder, local.day);
      sent.set(reminder.subscription.endpoint, local.day);
      log.info('reminder sent', { service: pushService(reminder.subscription.endpoint), time: reminder.time, timeZone: reminder.timeZone });
    } catch (error) {
      const service = pushService(reminder.subscription.endpoint);
      if (isExpired(error)) {
        expired.add(reminder.subscription.endpoint);
        log.info('reminder subscription expired, removing it', { service });
      } else log.error('reminder failed', { service, detail: pushErrorDetail(error) });
    }
  }
  if (!sent.size && !expired.size) return;
  await updateReminders((list) =>
    list
      .filter((item) => !expired.has(item.subscription.endpoint))
      .map((item) => {
        const day = sent.get(item.subscription.endpoint);
        return day ? { ...item, lastSent: day } : item;
      })
  );
}

const schedulerKey = Symbol.for('azure-practice-exams.reminder-scheduler');

/** Checks for due reminders every minute; started once by src/instrumentation.ts. */
export function startReminderScheduler() {
  const global = globalThis as typeof globalThis & { [schedulerKey]?: NodeJS.Timeout };
  if (global[schedulerKey]) return;
  const tick = () => sendDueReminders().catch((error) => log.error('reminder check failed', { dir: dataDir }, error));
  global[schedulerKey] = setInterval(tick, 60_000);
  global[schedulerKey].unref();
  log.info('reminder scheduler started');
}
