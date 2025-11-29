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
    teacherId: "d2b59a14-5f68-4bee-8561-301eb8b8ec9f",
    TOKEN_SECRET: "tokenPas123",
    limitStudent: "50",
    assist: "50",
  },
};

export default withNextVideo(nextConfig, { folder: "y" });
