const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@wagmi/core/tempo': path.resolve(__dirname, 'config/tempo-fallback.js'),
      '@x402/evm/exact/client': path.resolve(__dirname, 'config/x402-fallback.js'),
      '@x402/evm/upto/client': path.resolve(__dirname, 'config/x402-fallback.js'),
      '@x402/evm/client': path.resolve(__dirname, 'config/x402-fallback.js'),
      '@x402/evm': path.resolve(__dirname, 'config/x402-fallback.js'),
      '@base-org/account': path.resolve(__dirname, 'config/x402-fallback.js'),
      '@coinbase/cdp-sdk': path.resolve(__dirname, 'config/x402-fallback.js'),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
};

module.exports = nextConfig;
