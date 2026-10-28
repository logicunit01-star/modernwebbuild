import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
        source: "/author/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
