# ZNations Web

Central hub, dashboard, and marketplace for **ZNations SMP** — a Java + Bedrock
crossplay Minecraft civilization server. The site is the operating center of the
server: player dashboards, account linking, economy/market, leaderboards,
events, announcements, and an admin control panel.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-style local primitives
- **Recharts** (market charts) + **Zod** (validation)
- **Vercel** for hosting/deploy
- **Supabase (Postgres)** for the database, via the `postgres` client and a small
  D1-compatible query shim in [`lib/db/database.ts`](lib/db/database.ts)
- Optional **Vercel KV / Upstash Redis** for a durable cross-invocation cache

> **Hosting vs. domain:** the app runs entirely on **Vercel**. Cloudflare is only
> the **domain registrar / DNS** — point the domain at Vercel with a CNAME/A
> record. There is no Cloudflare Workers/D1/KV runtime anymore; an earlier
> version was mis-built for it, which is why live data never persisted.

## Run locally

```powershell
pnpm install
pnpm dev
```

The app boots with **no configuration** — it renders on seeded/demo data so
nothing crashes. Add the env vars below to make data real and persistent.

## Checks

```powershell
pnpm lint        # eslint (next/core-web-vitals + typescript)
pnpm typecheck   # tsc --noEmit
pnpm build       # production build (also lints + typechecks)
```

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` for local dev, and set the
same keys in **Vercel → Project → Settings → Environment Variables** for
production.

| Variable | Purpose | Needed for |
| --- | --- | --- |
| `DATABASE_URL` | Supabase Postgres connection string (use the **Transaction pooler**, port 6543) | Persisting users, links, announcements, events, snapshots |
| `ZN_SESSION_SECRET` | Long random string; signs session cookies (HMAC) | Secure login sessions |
| `ZN_ADMIN_USERNAME` / `ZN_ADMIN_PASSWORD` | Bootstrap owner login before DB users exist | First admin access |
| `ZN_PLAYER_USERNAME` / `ZN_PLAYER_PASSWORD` | Bootstrap player login | Testing the player view |
| `ZN_INGEST_SECRET` | Bearer token the Minecraft plugin sends on `/api/ingest/*` | Plugin → website data push |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV / Upstash Redis | Durable cache across serverless invocations (optional) |
| `NEXT_PUBLIC_*` | Public site config (server address, Discord, BlueMap URL, etc.) | UI content |

Everything is optional to *boot*; without a `DATABASE_URL` the site runs on
seeded data and clearly reports `source: mock-seed`/`offline`.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste all of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. (Safe to re-run.)
3. **Project Settings → Database → Connection string →** copy the **Transaction**
   pooler URI (port `6543`), fill in your DB password, and set it as
   `DATABASE_URL` locally and in Vercel.
4. Redeploy. Registration, login, and account linking now persist.

> All reads/writes go through server-side API routes that connect with the
> pooled service connection and enforce their own auth (HMAC session cookies +
> the `ZN_INGEST_SECRET` bearer token). The tables are **not** exposed via the
> public anon API. If you later add direct client access with the anon key,
> enable Row Level Security first.

## Deploy to Vercel

1. Import the GitHub repo into Vercel (framework auto-detected as Next.js; pnpm
   is auto-detected from `pnpm-lock.yaml`).
2. Add the environment variables above.
3. Deploy. Then add your Cloudflare-registered domain in **Vercel → Domains** and
   follow Vercel's DNS instructions (add the records in the Cloudflare dashboard).

## Account linking flow (secure)

Linking never trusts a typed username alone:

1. A logged-in player submits their Minecraft name on `/account/link`
   (`POST /api/account/link`) → a **pending** link row is created.
2. The player joins the server and runs the in-game confirm command.
3. The plugin verifies the real UUID and calls
   `POST /api/ingest/account-links/confirm` (bearer-authed) → the row flips to
   **confirmed** with the verified UUID.
4. The plugin can look up pending requests via
   `GET /api/link/pending?minecraftName=<name>` (bearer-authed).

## Plugin → website integration

Read endpoints (site → user): `/api/server/status`, `/api/server/players`,
`/api/dynamicshop/items`, `/api/dynamicshop/market`,
`/api/zprofessions/summary`, `/api/towns`, `/api/nations`, `/api/bluemap`,
`/api/queue`, `/api/admin/announcements`, `/api/admin/events`, `/api/admin/audit`.

Ingest endpoints (plugin → site) require `Authorization: Bearer <ZN_INGEST_SECRET>`:
`POST /api/ingest/server/status`, `/api/ingest/server/players`,
`/api/ingest/player-stats`, `/api/ingest/dynamicshop/items`,
`/api/ingest/dynamicshop/market`, `/api/ingest/zprofessions/summary`,
`/api/ingest/bluemap`, `/api/ingest/account-links/confirm`.

Every route returns source metadata (`live` / `cache` / `mock-seed` / `offline`)
so the UI can honestly distinguish real, cached, and seeded data.

## Real vs. mocked data

- **Real when configured:** website users, login sessions, Minecraft account
  links, and any snapshot the plugin has pushed (server status, players, market,
  professions, BlueMap).
- **Seeded/demo until the plugin pushes:** market items, leaderboards, towns,
  nations, and event/announcement seed content. These are isolated in
  [`lib/mock-data`](lib/mock-data) and always labelled via the `source` field.

## Still needed from the backend/plugin

- A ZNations plugin (or bridge) that POSTs to the `/api/ingest/*` endpoints on a
  schedule / on events.
- The in-game link-confirm command that calls the confirm endpoint.
- Real economy/shop data source (DynamicShop or a custom plugin) behind the
  existing `/api/dynamicshop/*` adapter.
