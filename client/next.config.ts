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
      {
        protocol: "http",
        hostname: "192.168.1.3",
        pathname: "**",
      },
    ],
  },

  env: {
    customKey: "novaraTo",
    // local: "http://localhost:5000/api",
    // img: "http://localhost:5000",
    local: "http://192.168.1.3:5000/api",
    img: "http://192.168.1.3:5000",
    teacherId: "3703a0b7-59ba-4f58-af78-4347b04dd3f3",
    TOKEN_SECRET: "tokenPas123",
    limitStudent: "50",
    assist: "50",
  },
};

export default withNextVideo(nextConfig, { folder: "y" });
