import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webSocketServerOptions: false,
  experimental: {
    webSocketServerOptions: false
  },
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
};

export default nextConfig;
