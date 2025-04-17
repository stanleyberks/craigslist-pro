import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.craigslist.org'],
    unoptimized: true
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('test')),
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
};

const sentryWebpackPluginOptions = {
  org: "alerts-dev",
  project: "javascript-nextjs",
  silent: !process.env.CI,
};

const sentryOptions = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions);
