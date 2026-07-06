CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  minecraft_uuid TEXT,
  profession_id TEXT,
  town_id TEXT,
  nation_id TEXT,
  balance INTEGER NOT NULL DEFAULT 0,
  playtime_minutes INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  password_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  pinned INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  active INTEGER NOT NULL DEFAULT 0,
  reward TEXT
);

CREATE TABLE IF NOT EXISTS market_items (
  material_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  buy_price INTEGER NOT NULL,
  sell_price INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  trend REAL NOT NULL DEFAULT 0,
  icon_path TEXT NOT NULL,
  data_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS queued_actions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  status TEXT NOT NULL,
  details_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
