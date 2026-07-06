import type { PublicConfig } from "@/types";

function readEnv(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

export function getPublicConfig(): PublicConfig {
  const siteUrl = readEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  const javaAddress = readEnv("NEXT_PUBLIC_SERVER_ADDRESS");
  const bedrockAddress = readEnv("NEXT_PUBLIC_BEDROCK_ADDRESS");
  const bedrockPort = readEnv("NEXT_PUBLIC_BEDROCK_PORT", "19132");
  const discordUrl = readEnv("NEXT_PUBLIC_DISCORD_URL");
  const bluemapUrl = readEnv("NEXT_PUBLIC_BLUEMAP_URL");
  const setupWarnings: string[] = [];

  if (!javaAddress) setupWarnings.push("NEXT_PUBLIC_SERVER_ADDRESS is missing. Add the Java server address before launch.");
  if (!bedrockAddress) setupWarnings.push("NEXT_PUBLIC_BEDROCK_ADDRESS is missing. Add the Bedrock address before launch.");
  if (!discordUrl) setupWarnings.push("NEXT_PUBLIC_DISCORD_URL is missing. Discord buttons will show a setup message.");
  if (!bluemapUrl) setupWarnings.push("NEXT_PUBLIC_BLUEMAP_URL is missing. The map page will use cached previews.");
  if (!readEnv("ZN_INGEST_SECRET")) setupWarnings.push("ZN_INGEST_SECRET is missing. Server push endpoints will reject all plugin syncs.");

  return {
    siteUrl,
    serverName: readEnv("NEXT_PUBLIC_SERVER_NAME", "ZNations SMP"),
    javaAddress: javaAddress || "Set NEXT_PUBLIC_SERVER_ADDRESS",
    bedrockAddress: bedrockAddress || "Set NEXT_PUBLIC_BEDROCK_ADDRESS",
    bedrockPort,
    discordUrl,
    bluemapUrl,
    setupWarnings
  };
}

export function configuredUrl(value: string) {
  return /^https?:\/\//i.test(value);
}
