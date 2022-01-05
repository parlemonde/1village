/* eslint-disable */
const { withSentryConfig } = require('@sentry/nextjs');
const BUILD_VERSION = process.env.BUILD_VERSION;

const nextConfig = {
  distDir: './dist/next',
  poweredByHeader: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  eslint: {
    // ESLint is already called before building with nextJS. So no need here.
    ignoreDuringBuilds: true,
  },
  generateBuildId: BUILD_VERSION ? async () => BUILD_VERSION : undefined,
};

// https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackPluginOptions = {
  errorHandler: (err, _invokeErr, compilation) => {
    compilation.warnings.push('Sentry CLI Plugin: ' + err.message);
  },
};

module.exports = process.env.USE_SENTRY ? withSentryConfig(nextConfig, sentryWebpackPluginOptions) : nextConfig;
