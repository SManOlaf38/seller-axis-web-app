/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  reactStrictMode: false,
  images: {
    domains: [
      'selleraxis-bucket-dev.s3.amazonaws.com',
      's3.amazonaws.com',
      'selleraxis-bucket-prod.s3.amazonaws.com'
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}'
    }
  }
};

module.exports = nextConfig;
