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
    teacherId: "65c357b6-2135-47db-92ff-728510c96c60",
    teacherName: "mr.ahmed",
    TOKEN_SECRET: "tokenPas123",
    limit: "50",
  },
};

export default withNextVideo(nextConfig, { folder: "y" });
