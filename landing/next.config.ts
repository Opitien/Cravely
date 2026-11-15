import type { NextConfig } from "next";

// Static export: Vercel serves landing/out as plain files (see ../vercel.json).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  // this app lives inside the Expo repo, which has its own lockfile
  turbopack: { root: __dirname },
};

export default nextConfig;
