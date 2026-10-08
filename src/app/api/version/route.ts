import { appVersion, buildId, commitSha } from '@/lib/version';
import type { VersionResponse } from '@/lib/version';

// Answer every request from the running server rather than a build-time copy.
export const dynamic = 'force-dynamic';

/**
 * Reports the version of the running server. Open pages poll this to find
 * out that a newer Docker image has been deployed.
 */
export function GET() {
  const body: VersionResponse = { version: appVersion, commit: commitSha, buildId };
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
