/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces a self-contained server in .next/standalone for the Docker image
  output: 'standalone'
};

module.exports = nextConfig;
