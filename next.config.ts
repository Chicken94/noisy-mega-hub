import type { NextConfig } from "next";

// Private client hubs live on claude.ai (only Daniel's account can open them).
const PNUT_HUB = "https://claude.ai/artifact/RfoTXBMWARVtwvrdWKFjJc";
const SO_HUB = "https://claude.ai/artifact/DwHe7vJYhptjEeJMjskXYX";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/clients", destination: PNUT_HUB, permanent: false },
      { source: "/clients/pnut", destination: PNUT_HUB, permanent: false },
      { source: "/clients/so", destination: SO_HUB, permanent: false },
      { source: "/clients/soul-origin", destination: SO_HUB, permanent: false },
    ];
  },
};

export default nextConfig;
