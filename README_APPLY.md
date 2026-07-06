# ZNations Vercel Live Sync Patch

This patch makes the site read plugin-pushed data instead of only mock/static data.

## What it changes

- Adds Vercel-safe live cache support in `lib/cache/kv.ts`.
- Keeps Cloudflare KV/D1 support for the old deployment target.
- Adds optional Vercel KV / Upstash Redis support using these env vars if you add storage later:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - or `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- Adds memory fallback so live pushes can appear immediately on warm Vercel functions/local dev.
- Makes the homepage read `cache:server-status` and `cache:bluemap` instead of only `siteData`.
- Forces key pages/API routes to be dynamic so Vercel does not serve old static data.

## How to apply without command line

1. Open your GitHub repo.
2. Open each file listed below.
3. Click the pencil/edit button.
4. Replace the entire file with the matching file from this patch folder.
5. Commit changes.
6. Wait for Vercel to redeploy.
7. Run `web sync` in your Minecraft server console.
8. Refresh `https://www.znationssmp.com`.

## Files to replace

- `lib/cache/kv.ts`
- `lib/api/ingest.ts`
- `types/index.ts`
- `components/dashboard/public-home.tsx`
- `app/(public)/page.tsx`
- `app/(public)/players/page.tsx`
- `app/api/server/status/route.ts`
- `app/api/server/players/route.ts`
- `app/api/dynamicshop/items/route.ts`
- `app/api/dynamicshop/market/route.ts`
- `app/api/zprofessions/summary/route.ts`
- `app/api/bluemap/route.ts`

## Important production note

The memory fallback is not permanent storage. For reliable production data on Vercel, add a Vercel KV / Upstash Redis store to the Vercel project so `KV_REST_API_URL` and `KV_REST_API_TOKEN` are available.

Without Redis, Vercel can lose live data when the serverless function goes cold or a different function instance handles the page request.
