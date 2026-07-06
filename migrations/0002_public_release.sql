CREATE TABLE IF NOT EXISTS plugin_snapshots (
  cache_key TEXT PRIMARY KEY,
  plugin TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  synced_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_profiles (
  username TEXT PRIMARY KEY,
  minecraft_uuid TEXT,
  user_id TEXT,
  online INTEGER NOT NULL DEFAULT 0,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS account_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  website_username TEXT NOT NULL,
  minecraft_name TEXT NOT NULL,
  minecraft_uuid TEXT,
  status TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  confirmed_at TEXT,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_account_links_minecraft_name ON account_links (minecraft_name, status);
CREATE INDEX IF NOT EXISTS idx_account_links_user_status ON account_links (user_id, status);
