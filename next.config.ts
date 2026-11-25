import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["pg"],
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
};

export default nextConfig;
