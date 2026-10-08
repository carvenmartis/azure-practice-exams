import { dailyStatus, getProgress, localDay } from './progress-store';

/**
 * Daily goal reminders on this device, sent as web push notifications by the
 * server (src/lib/server/reminders.ts) at the chosen time when the goal isn't
 * reached yet. The push subscription belongs to this browser, so the setting
 * is saved here and not in backups.
 *
 * The NAS container keeps no data across image updates, so the server may
 * forget the subscription or make new keys. syncReminder() runs when the app
 * opens and registers the device again, subscribing anew when the key changed.
 */
export interface ReminderSettings {
  enabled: boolean;
  /** Local time of day as '19:00'. */
  time: string;
  /** The server key the subscription was made with. */
  publicKey?: string;
}

export const defaultReminderTime = '19:00';

const storageKey = 'practice-reminder';

/** Why reminders can't be turned on here, or 'ok'. */
export type ReminderSupport = 'ok' | 'needs-https' | 'needs-home-screen' | 'unsupported' | 'blocked';

export function getReminderSettings(): ReminderSettings {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    return {
      enabled: parsed?.enabled === true,
      time: typeof parsed?.time === 'string' ? parsed.time : defaultReminderTime,
      publicKey: typeof parsed?.publicKey === 'string' ? parsed.publicKey : undefined
    };
  } catch {
    return { enabled: false, time: defaultReminderTime };
  }
}

function saveReminderSettings(settings: ReminderSettings) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Storage blocked: the server still has the subscription.
  }
}

function isAppleMobile() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isHomeScreenApp() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Whether this browser can get reminders. Push needs https, and on iPhone and
 * iPad (iOS 16.4 and later) only an app added to the Home Screen gets it.
 */
export function reminderSupport(): ReminderSupport {
  if (!window.isSecureContext) return 'needs-https';
  if (isAppleMobile() && !isHomeScreenApp()) return 'needs-home-screen';
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'denied') return 'blocked';
  return 'ok';
}

/** The base64url VAPID key from the server as the bytes PushManager wants. */
function keyBytes(base64url: string) {
  const base64 = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

/** The service worker from src/lib/offline.ts, which also shows the notifications. */
async function serviceWorker() {
  const timeout = new Promise<never>((_, reject) =>
    window.setTimeout(() => reject(new Error('The app is still setting up. Try again in a moment.')), 10_000)
  );
  return Promise.race([navigator.serviceWorker.ready, timeout]);
}

/** Today's count, goal and streak, so the server can skip or word the reminder. */
function progressReport() {
  const status = dailyStatus(getProgress());
  return { day: localDay(), count: status.today, goal: status.goal, streak: status.streak };
}

async function post(path: string, body: unknown) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(error ?? `The server did not accept the reminder (HTTP ${res.status}).`);
  }
}

/**
 * Subscribes this device to push with the server's current key (again, if
 * the key changed since) and tells the server when to remind.
 */
async function registerReminder(registration: ServiceWorkerRegistration, time: string) {
  const res = await fetch('/api/push/key', { cache: 'no-store' });
  if (!res.ok) throw new Error('The server cannot send reminders yet.');
  const { publicKey } = (await res.json()) as { publicKey: string };
  let subscription = await registration.pushManager.getSubscription();
  if (subscription && getReminderSettings().publicKey !== publicKey) {
    await subscription.unsubscribe();
    subscription = null;
  }
  subscription ??= await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyBytes(publicKey)
  });
  await post('/api/push/subscribe', {
    subscription: subscription.toJSON(),
    time,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    progress: progressReport()
  });
  saveReminderSettings({ enabled: true, time, publicKey });
}

/** Asks for notification permission (call it from a tap) and turns the reminder on. */
export async function enableReminder(time: string) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notifications were not allowed.');
  await registerReminder(await serviceWorker(), time);
}

/**
 * Registers a turned-on reminder with the server again, in case an update
 * of the server lost it. Runs when the app opens; never asks anything.
 */
export async function syncReminder() {
  const settings = getReminderSettings();
  if (!settings.enabled || reminderSupport() !== 'ok' || Notification.permission !== 'granted') return;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.active) await registerReminder(registration, settings.time);
  } catch {
    // Offline or the server is restarting: try again next time.
  }
}

/** Stops the reminders on this device. */
export async function disableReminder() {
  saveReminderSettings({ enabled: false, time: getReminderSettings().time });
  const registration = await navigator.serviceWorker?.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;
  await post('/api/push/unsubscribe', { endpoint: subscription.endpoint }).catch(() => {});
  await subscription.unsubscribe();
}

/** Sends a reminder right away, to check that notifications arrive. */
export async function sendTestReminder() {
  const registration = await serviceWorker();
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) throw new Error('Turn the reminder on first.');
  await post('/api/push/test', { endpoint: subscription.endpoint, progress: progressReport() });
}

let reportTimer: number | undefined;

/**
 * Tells the server today's progress after answering, so no reminder comes
 * once the goal is reached. Batched, since it runs on every answer.
 */
export function reportReminderProgress() {
  if (!getReminderSettings().enabled) return;
  window.clearTimeout(reportTimer);
  reportTimer = window.setTimeout(async () => {
    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) await post('/api/push/progress', { endpoint: subscription.endpoint, progress: progressReport() });
    } catch {
      // Offline: the reminder may come anyway, which is harmless.
    }
  }, 3000);
}
