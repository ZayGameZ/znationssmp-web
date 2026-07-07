-- ZNations Web — Supabase (Postgres) schema
-- =========================================
-- Paste this whole file into the Supabase SQL Editor (Dashboard -> SQL Editor
-- -> New query -> Run) once, when you first set up the project. It is safe to
-- re-run: every statement uses IF NOT EXISTS.
--
-- This is the Postgres port of the original Cloudflare D1 (SQLite) migrations
-- (migrations/0001_initial.sql + 0002_public_release.sql). Timestamp columns are
-- kept as `text` holding ISO-8601 strings so the application code (which binds
-- and reads ISO strings) keeps working unchanged. Boolean-ish flags stay as
-- integer (0/1) for the same reason.
--
-- Security note: all reads/writes go through server-side Next.js API routes that
-- connect with the pooled service connection string and enforce their own auth
-- (HMAC session cookies + the ZN_INGEST_SECRET bearer token). These tables are
-- therefore NOT exposed through the public PostgREST/anon API. If you later add
-- direct client access with the anon key, enable Row Level Security per table
-- first.

-- Website + linked-account users -------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  username text NOT NULL UNIQUE,
  role text NOT NULL,
  minecraft_uuid text,
  profession_id text,
  town_id text,
  nation_id text,
  balance integer NOT NULL DEFAULT 0,
  playtime_minutes integer NOT NULL DEFAULT 0,
  avatar_url text,
  password_hash text,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  updated_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);

-- Optional server-side session records (the app also uses signed cookies) -------
CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  role text NOT NULL,
  expires_at text NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);

-- News / announcements ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id text PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  category text NOT NULL,
  pinned integer NOT NULL DEFAULT 0,
  published integer NOT NULL DEFAULT 1,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);

-- Events / challenges -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  starts_at text NOT NULL,
  ends_at text,
  active integer NOT NULL DEFAULT 0,
  reward text
);

-- Economy / shop market items ---------------------------------------------------
CREATE TABLE IF NOT EXISTS market_items (
  material_id text PRIMARY KEY,
  display_name text NOT NULL,
  category_id text NOT NULL,
  buy_price integer NOT NULL,
  sell_price integer NOT NULL,
  stock integer NOT NULL,
  trend double precision NOT NULL DEFAULT 0,
  icon_path text NOT NULL,
  data_json text NOT NULL
);

-- Offline-safe queued actions (town/nation/shop/profile writes) -----------------
CREATE TABLE IF NOT EXISTS queued_actions (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  type text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  status text NOT NULL,
  payload_json text NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  updated_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);

-- Admin audit trail -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  actor_id text NOT NULL,
  action text NOT NULL,
  target text NOT NULL,
  status text NOT NULL,
  details_json text NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);

-- Latest snapshot pushed by the Minecraft plugin, keyed by cache key ------------
CREATE TABLE IF NOT EXISTS plugin_snapshots (
  cache_key text PRIMARY KEY,
  plugin text NOT NULL,
  payload_json text NOT NULL,
  synced_at text NOT NULL
);

-- Per-player profile blobs pushed by the plugin ---------------------------------
CREATE TABLE IF NOT EXISTS player_profiles (
  username text PRIMARY KEY,
  minecraft_uuid text,
  user_id text,
  online integer NOT NULL DEFAULT 0,
  data_json text NOT NULL,
  updated_at text NOT NULL
);

-- Minecraft account linking requests --------------------------------------------
CREATE TABLE IF NOT EXISTS account_links (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  website_username text NOT NULL,
  minecraft_name text NOT NULL,
  minecraft_uuid text,
  status text NOT NULL,
  requested_at text NOT NULL,
  confirmed_at text,
  expires_at text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_account_links_minecraft_name ON account_links (minecraft_name, status);
CREATE INDEX IF NOT EXISTS idx_account_links_user_status ON account_links (user_id, status);

-- Community: polls -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS polls (
  id text PRIMARY KEY,
  question text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'open',
  created_by text,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  closes_at text
);

CREATE TABLE IF NOT EXISTS poll_options (
  id text PRIMARY KEY,
  poll_id text NOT NULL,
  label text NOT NULL,
  sort integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON poll_options (poll_id);

CREATE TABLE IF NOT EXISTS poll_votes (
  id text PRIMARY KEY,
  poll_id text NOT NULL,
  option_id text NOT NULL,
  user_id text NOT NULL,
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_poll_votes_user ON poll_votes (poll_id, user_id);

-- Community: staff applications ----------------------------------------------
CREATE TABLE IF NOT EXISTS staff_applications (
  id text PRIMARY KEY,
  user_id text,
  website_username text,
  role text NOT NULL,
  discord_username text,
  minecraft_username text,
  answers_json text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text NOT NULL DEFAULT '',
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  updated_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_staff_applications_status ON staff_applications (status, created_at);
