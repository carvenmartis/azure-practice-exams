/** Build version shown in the corner label, e.g. '1.0.42'. */
export const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '';

/** Short commit SHA of the build; empty for local builds. */
export const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || '';

/**
 * Identifies one build. Both values are inlined when the app is built, so the
 * browser keeps the id of the page it loaded while /api/version reports the
 * id of whatever image the server is running now.
 */
export const buildId = commitSha ? `${appVersion}+${commitSha}` : appVersion;

export interface VersionResponse {
  version: string;
  commit: string;
  buildId: string;
}
