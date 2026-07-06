# ZNations Web

Standalone central hub and marketplace for ZNations SMP.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local primitives
- Recharts
- Zod
- Cloudflare Workers via OpenNext
- Cloudflare D1 and KV bindings

## Run Locally

```powershell
pnpm install
pnpm dev
```

## Checks

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

## Cloudflare

Create D1 and KV resources, update `wrangler.toml`, then run:

```powershell
pnpm opennext:build
pnpm deploy
```

## Integration Points

- `/api/server/status`
- `/api/server/players`
- `/api/dynamicshop/items`
- `/api/dynamicshop/market`
- `/api/dynamicshop/checkout`
- `/api/zprofessions/summary`
- `/api/towns`
- `/api/nations`
- `/api/bluemap`
- `/api/queue`
- `/api/admin/announcements`
- `/api/admin/events`
- `/api/admin/audit`

Server-side plugin push endpoints require `Authorization: Bearer <ZN_INGEST_SECRET>`:

- `POST /api/ingest/server/status`
- `POST /api/ingest/server/players`
- `POST /api/ingest/player-stats`
- `POST /api/ingest/dynamicshop/items`
- `POST /api/ingest/dynamicshop/market`
- `POST /api/ingest/zprofessions/summary`
- `POST /api/ingest/bluemap`
- `POST /api/ingest/account-links/confirm`
- `GET /api/link/pending?minecraftName=<name>`

Every route returns source metadata so the UI can distinguish live, cached, and seeded data.

## Auth

Seed website accounts with environment variables:

- `ZN_ADMIN_USERNAME`
- `ZN_ADMIN_PASSWORD`
- `ZN_PLAYER_USERNAME`
- `ZN_PLAYER_PASSWORD`
- `ZN_SESSION_SECRET`
- `ZN_INGEST_SECRET`

Public release settings:

- `NEXT_PUBLIC_SERVER_ADDRESS`
- `NEXT_PUBLIC_BEDROCK_ADDRESS`
- `NEXT_PUBLIC_BEDROCK_PORT`
- `NEXT_PUBLIC_DISCORD_URL`
- `NEXT_PUBLIC_BLUEMAP_URL`

Admin pages require an owner/admin signed session. Production D1 password hash storage is represented in the schema and auth helper layer.

## Offline Behavior

The app uses KV/D1 for server-side fallback and IndexedDB for browser-side snapshots and queued actions. Town, nation, and checkout writes queue cleanly when the Minecraft server or plugin API is offline.
