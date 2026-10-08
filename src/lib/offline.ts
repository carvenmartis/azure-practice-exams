import { exams } from '@/lib/exams';
import { buildId } from '@/lib/version';

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
 * id in the URL (version and commit, see src/lib/version.ts) makes every new
 * Docker image install a fresh copy with a new cache; local builds without a
 * new version reuse the cache name, but pages still come from the network
 * first. Production only: in development the files change on every save.
 */
export function registerServiceWorker() {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(buildId || 'dev')}`).catch(() => {
    // Needs HTTPS (or localhost); without it the app simply stays online-only.
  });
}
