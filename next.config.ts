import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.eventfinda.com.au',
      // Keep any other domains you already have configured here
    ]
  },
};

export default nextConfig;
