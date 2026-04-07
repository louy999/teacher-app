import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  experimental: {
    reactCompiler: true,
  },
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
        pathname: "/**", // أضفت / هنا للتحوط
      },
     
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
     
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  env: {
    local: process.env.LOCAL,
    img: process.env.IMG,
    teacherId: process.env.TEACHERID,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    limitStudent: process.env.LIMIT_STUDENT,
    assist:  process.env.LIMIT_ASSIST,
    grade:process.env.GRADE
  },
};

export default nextConfig;
