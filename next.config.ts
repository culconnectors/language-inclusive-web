import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.eventfinda.com.au",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.evbuc.com",
                pathname: "/**",
            },
        ],
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            canvas: false,
        };
        return config;
    },
};

export default nextConfig;
