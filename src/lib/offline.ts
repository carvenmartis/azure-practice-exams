import { exams } from '@/lib/exams';

/**
 * Every page the service worker (public/sw.js) downloads so the app works
 * offline. Add new pages here.
 */
export const offlinePages = [
  '/',
  '/about',
  '/bookmarks',
  '/guides',
  '/progress',
  '/review',
  '/settings',
  '/study',
  ...exams.flatMap((exam) => [`/exams/${exam.slug}`, `/study/${exam.slug}`, `/guides/${exam.slug}`])
];

/** Other files the service worker downloads: all questions and the home-screen app files. */
export const offlineFiles = [
  ...exams.map((exam) => `/exam-data/${exam.slug}.json`),
  '/manifest.webmanifest',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png'
];

/**
 * Registers the service worker that keeps the app working offline. The build
 * id in the URL makes every new build install a fresh copy with a new cache.
 * Production only: in development the files change on every save.
 */
export function registerServiceWorker() {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
  const buildId = (window as Window & { __NEXT_DATA__?: { buildId?: string } }).__NEXT_DATA__?.buildId ?? 'dev';
  navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(buildId)}`).catch(() => {
    // Needs HTTPS (or localhost); without it the app simply stays online-only.
  });
}
