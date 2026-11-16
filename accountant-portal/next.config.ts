import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/salaries",
        destination: "/salaries/overview",
        permanent: false,
      },
      {
        source: "/taxes",
        destination: "/taxes/overview",
        permanent: false,
      },
      {
        source: "/documents",
        destination: "/documents/overview",
        permanent: false,
      },
      {
        source: "/budgeting",
        destination: "/budgeting/overview",
        permanent: false,
      },
      {
        source: "/salons",
        destination: "/salons/my-salons",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
