'use client';

import { useEffect } from 'react';
import { startSync } from '@/lib/sync';

/** Keeps progress in sync with the server while the app is open (see src/lib/sync.ts). */
export function ProgressSync() {
  useEffect(() => startSync(), []);
  return null;
}
