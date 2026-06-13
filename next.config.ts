import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site (no API/SSR/middleware) — export plain HTML/CSS/JS so it
  // can be served as static assets and deploys reliably regardless of the
  // host's Next.js server-adapter support.
  output: "export",
};

export default nextConfig;
