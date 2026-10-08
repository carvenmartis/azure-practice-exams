'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/offline';

/** Registers the service worker that keeps the app working offline (see public/sw.js). */
export function ServiceWorker() {
  useEffect(registerServiceWorker, []);
  return null;
}
