// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const withTM = require('next-transpile-modules')(['@mui/x-charts']);

// eslint-disable-next-line no-undef
const BUILD_VERSION = process.env.BUILD_VERSION;

// eslint-disable-next-line no-undef
module.exports = withTM({
  env: {
    ARCHIVE_MODE: process.env.ARCHIVE_MODE || 'false',
  },
  distDir: './dist/next',
  poweredByHeader: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: { esmExternals: false },
  eslint: {
    // ESLint is already called before building with nextJS. So no need here.
    ignoreDuringBuilds: true,
  },
  generateBuildId: BUILD_VERSION ? async () => BUILD_VERSION : undefined,
});
