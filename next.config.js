// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Shown in the bottom-right corner of every page
    NEXT_PUBLIC_APP_VERSION: version,
    // Set by the GitHub workflow when building the Docker image
    NEXT_PUBLIC_COMMIT_SHA: (process.env.GIT_SHA || '').slice(0, 7)
  },
  // Produces a self-contained server in .next/standalone for the Docker image
  output: 'standalone'
};

module.exports = nextConfig;
