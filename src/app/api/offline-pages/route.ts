import { offlineFiles, offlinePages } from '@/lib/offline';

export interface OfflinePagesResponse {
  pages: string[];
  files: string[];
}

/** The pages and files the service worker downloads for offline use. */
export function GET() {
  const body: OfflinePagesResponse = { pages: offlinePages, files: offlineFiles };
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
