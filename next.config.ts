import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "modernwebbuild.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/#articles",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/#articles",
        permanent: true,
      },
      {
        source: "/work-with-pro",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/work-with-pro/",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/author",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/author/:path*",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
