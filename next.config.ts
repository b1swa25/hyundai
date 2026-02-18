import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['next-auth', 'drizzle-orm', 'drizzle-kit'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        querystring: require.resolve('querystring-es3'),
        fs: false,
        path: false,
        stream: require.resolve('stream-browserify'),
      };
    }
    return config;
  },
};

export default nextConfig;
