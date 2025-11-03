import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Improve chunking for vendor packages to prevent cache corruption
  webpack: (config, { isServer }) => {
    // Optimize vendor chunks
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate vendor chunks to prevent module resolution issues
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;

