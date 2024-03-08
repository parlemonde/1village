/* eslint-disable */
const BUILD_VERSION = process.env.BUILD_VERSION;

module.exports = {
  distDir: './dist/next',
  poweredByHeader: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  experimental: { esmExternals: false },
  eslint: {
    // ESLint is already called before building with nextJS. So no need here.
    ignoreDuringBuilds: true,
  },
  generateBuildId: BUILD_VERSION ? async () => BUILD_VERSION : undefined,
};
