import type { NextApiRequest, NextApiResponse } from 'next';
import { offlineFiles, offlinePages } from '@/lib/offline';

export interface OfflinePagesResponse {
  pages: string[];
  files: string[];
}

/** The pages and files the service worker downloads for offline use. */
export default function handler(_req: NextApiRequest, res: NextApiResponse<OfflinePagesResponse>) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ pages: offlinePages, files: offlineFiles });
}
