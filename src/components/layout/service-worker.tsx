'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveAllExamsForOffline } from '@/lib/exam-data';
import { exams } from '@/lib/exams';
import { offlinePages, registerServiceWorker } from '@/lib/offline';

/**
 * Prepares the app for offline use: registers the service worker (see
 * public/sw.js), saves every exam's questions on this device, and loads
 * every page into the router's memory so moving between pages keeps working
 * without a connection while the app stays open, even where the service
 * worker can't run (it needs https).
 */
export function ServiceWorker() {
  const router = useRouter();

  useEffect(() => {
    registerServiceWorker();
    saveAllExamsForOffline(exams.map((exam) => exam.slug)).catch(() => {
      // Offline or storage blocked; try again on the next visit.
    });
    offlinePages.forEach((page) => router.prefetch(page));
  }, [router]);

  return null;
}
