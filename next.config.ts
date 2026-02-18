import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['next-auth', 'drizzle-orm', 'drizzle-kit'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: false,
        fs: false,
        path: false,
        stream: false,
      };
    }
    return config;
  },
};

export default nextConfig;
