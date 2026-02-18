import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['drizzle-orm', 'drizzle-kit'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        querystring: require.resolve('querystring-es3'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process'),
        fs: false,
        path: false,
        stream: require.resolve('stream-browserify'),
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    return config;
  },
};

export default nextConfig;
