import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint is enforced during builds. The previous `ignoreDuringBuilds: true`
  // workaround masked a missing-dependency problem (eslint-plugin-react-hooks
  // and @next/eslint-plugin-next were not installed). Those are now proper
  // devDependencies, so the real fix is in place and lint can gate the build.
  images: {
    // Player avatars are served from mc-heads.net. Left unoptimized to avoid
    // needing a remotePatterns allowlist; safe on Vercel.
    unoptimized: true
  }
};

export default nextConfig;
