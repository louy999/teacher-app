import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "storyset.com",
        pathname: "**",
      },
    ],
  },
  env: {
    customKey: "novaraTo",
    local: "http://localhost:5000/api",
    img: "http://localhost:5000",
    teacherId: "a7eab1b2-7702-4ea8-8835-874375ed850a",
    teacherName: "mr.ahmed",
    TOKEN_SECRET: "tokenPas123",
    limit: 50,
  },
};

export default withNextVideo(nextConfig, { folder: "y" });
