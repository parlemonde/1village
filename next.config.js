/* eslint-disable */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

module.exports = {
  distDir: "./dist/next",
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    // config.plugins.push(
    //   new BundleAnalyzerPlugin({
    //     analyzerMode: 'server',
    //     analyzerPort: isServer ? 8888 : 8889,
    //     openAnalyzer: true,
    //   })
    // );
    // config.plugins.push(new DuplicatePackageCheckerPlugin());
    return config;
  },
  eslint: {
    // ESLint is already called before building with nextJS. So no need here.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['web-dev.imgix.net'],
  },
};
