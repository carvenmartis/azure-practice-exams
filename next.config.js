// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `next dev` blocks scripts requested from other addresses, so a phone opening the
  // dev server over the network got a page that never became interactive. These
  // patterns allow any device on a home or office network (each * is one number).
  allowedDevOrigins: ['10.10.1.*'],
  env: {
    // Shown in the bottom-right corner of every page. The GitHub workflow
    // sets APP_VERSION to <major>.<minor>.<build number> on each build.
    NEXT_PUBLIC_APP_VERSION: process.env.APP_VERSION || version,
    // Set by the GitHub workflow when building the Docker image
    NEXT_PUBLIC_COMMIT_SHA: (process.env.GIT_SHA || '').slice(0, 7)
  },
  // Produces a self-contained server in .next/standalone for the Docker image
  output: 'standalone',
  experimental: {
    // Keep prefetched pages for a day instead of 5 minutes, so an open app
    // can still move between pages after losing its connection
    // (src/components/layout/service-worker.tsx prefetches every page).
    staleTimes: { static: 24 * 60 * 60 }
  }
};

module.exports = nextConfig;
