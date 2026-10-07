import type { NextApiRequest, NextApiResponse } from 'next';
import { appVersion, buildId, commitSha } from '@/lib/version';
import type { VersionResponse } from '@/lib/version';

/**
 * Reports the version of the running server. Open pages poll this to find
 * out that a newer Docker image has been deployed.
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse<VersionResponse>) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ version: appVersion, commit: commitSha, buildId });
}
