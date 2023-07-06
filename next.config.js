/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  images: {
    domains: ['s3.amazonaws.com']
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}'
    }
  }
};

module.exports = nextConfig;
