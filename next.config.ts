import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',  // This is good for Amplify deployment
  images: {
    unoptimized: true,  // Required for static exports
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '2mb'
    },
    serverComponentsExternalPackages: ['firebase-admin']
  },
  // Add this configuration to specify which routes should use Node.js runtime
  // Note: rewrites won't work with static export for Firebase hosting
  // If you need server functionality, you'll need Firebase Functions or Cloud Run
  // Commenting out rather than removing in case you need this later
  /*
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/socket.io/:path*',
          destination: '/api/socket.io/:path*'
        }
      ]
    };
  }
  */
  // Adding Amplify specific configurations
  reactStrictMode: true,
  swcMinify: true,
  // Configuring asset prefix for Amplify CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
};

export default nextConfig;
