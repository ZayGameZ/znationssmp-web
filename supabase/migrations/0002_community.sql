-- ZNations Web — community features (polls, staff applications)
-- ================================================================
-- Run this ONCE in the Supabase SQL Editor after 0001 / schema.sql.
-- Safe to re-run (IF NOT EXISTS everywhere). Timestamps are ISO-8601 text to
-- match the rest of the schema and the app's string-based date handling.

-- Polls ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS polls (
  id text PRIMARY KEY,
  question text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'open',          -- 'open' | 'closed'
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
-- One vote per user per poll.
CREATE UNIQUE INDEX IF NOT EXISTS uidx_poll_votes_user ON poll_votes (poll_id, user_id);

-- Staff applications ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff_applications (
  id text PRIMARY KEY,
  user_id text,
  website_username text,
  role text NOT NULL,                            -- 'discord-mod' | 'server-admin'
  discord_username text,
  minecraft_username text,
  answers_json text NOT NULL,                    -- JSON: { question: answer }
  status text NOT NULL DEFAULT 'pending',        -- pending | reviewing | accepted | rejected
  admin_notes text NOT NULL DEFAULT '',
  created_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  updated_at text NOT NULL DEFAULT to_char(now() AT TIME ZONE 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
);
CREATE INDEX IF NOT EXISTS idx_staff_applications_status ON staff_applications (status, created_at);
