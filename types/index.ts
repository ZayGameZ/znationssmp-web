export type Role = "owner" | "admin" | "staff" | "player";
export type DataSource = "live" | "cache" | "mock-seed" | "offline";
export type ActionStatus = "queued" | "synced" | "failed";
export type AccountLinkStatus = "pending" | "confirmed" | "expired";

export interface User {
  id: string;
  username: string;
  role: Role;
  minecraftUuid: string;
  professionId: string;
  townId: string;
  nationId: string;
  balance: number;
  playtimeMinutes: number;
  avatarUrl: string;
  badges: string[];
}

export interface PublicConfig {
  siteUrl: string;
  serverName: string;
  javaAddress: string;
  bedrockAddress: string;
  bedrockPort: string;
  discordUrl: string;
  bluemapUrl: string;
  setupWarnings: string[];
}

export interface PlayerStats {
  kills: number;
  deaths: number;
  kdRatio: number;
  blocksBroken: number;
  blocksPlaced: number;
  mobsKilled: number;
  lastSeenAt: string;
}

export interface PlayerShopSummary {
  activeListings: number;
  sold24h: number;
  shopValue: number;
}

export interface PlayerProfile {
  username: string;
  minecraftUuid: string;
  userId?: string;
  avatarUrl: string;
  online: boolean;
  professionId: string;
  townId: string;
  nationId: string;
  balance: number;
  playtimeMinutes: number;
  stats: PlayerStats;
  shopSummary: PlayerShopSummary;
  questSummary: string;
  professionSummary: string;
  badges: string[];
}

export interface AccountLink {
  id: string;
  userId: string;
  websiteUsername: string;
  minecraftName: string;
  minecraftUuid?: string;
  status: AccountLinkStatus;
  requestedAt: string;
  confirmedAt?: string;
  expiresAt: string;
}

export interface Session {
  id: string;
  userId: string;
  role: Role;
  expiresAt: string;
}

export interface Profession {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  perks: string[];
  restrictions: string[];
  marketTags: string[];
  economyFocus: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MarketItem {
  materialId: string;
  displayName: string;
  categoryId: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  trend: number;
  volume24h: number;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  professionTags: string[];
  bestFor: string[];
  restrictions: string[];
  recommendations: string[];
  iconPath: string;
}

export interface PlayerListing {
  id: string;
  sellerId: string;
  materialId: string;
  quantity: number;
  priceEach: number;
  expiresAt: string;
}

export interface CartLine {
  materialId: string;
  quantity: number;
  priceEach: number;
}

export interface Transaction {
  id: string;
  itemName: string;
  materialId: string;
  seller: string;
  buyer: string;
  price: number;
  quantity: number;
  timeAgo: string;
  type: "BUY" | "SELL" | "LISTING";
}

export interface PricePoint {
  label: string;
  value: number;
  volume: number;
}

export interface Town {
  id: string;
  name: string;
  mayorId: string;
  nationId: string;
  members: number;
  bank: number;
  taxRate: number;
  claims: number;
  status: "Recruiting" | "Invite Only" | "Closed";
}

export interface Nation {
  id: string;
  name: string;
  leaderId: string;
  capitalTownId: string;
  members: number;
  towns: number;
  wealth: number;
  power: number;
  status: "Peaceful" | "At War" | "Recruiting";
}

export interface DiplomacyRelation {
  id: string;
  sourceNationId: string;
  targetNationId: string;
  type: "Ally" | "Neutral" | "Rival" | "War";
}

export interface QueuedAction {
  id: string;
  userId: string;
  type: string;
  targetType: "town" | "nation" | "shop" | "profile";
  targetId?: string;
  status: ActionStatus;
  payload: Record<string, string | number | boolean>;
  createdAt: string;
}

export interface ServerSnapshot {
  online: boolean;
  playersOnline: number;
  maxPlayers: number;
  tps: number;
  pingMs: number;
  uptime: string;
  lastSyncedAt: string;
  stale: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  image: string;
  timeAgo: string;
  pinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  startsAt: string;
  endsAt?: string;
  active: boolean;
  reward: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  value: string;
  subtext: string;
  avatarUrl?: string;
}

export interface MapMarker {
  id: string;
  name: string;
  type: "town" | "nation" | "shop" | "event";
  x: number;
  y: number;
  color: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  status: "success" | "failed";
  createdAt: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: "Live" | "Cached" | "Not configured";
  endpoint: string;
  lastSync: string;
}

export interface IngestEnvelope<T = unknown> {
  sentAt: string;
  plugin: string;
  data: T;
}

export interface IngestResult {
  ok: boolean;
  source: "live";
  cachedKey: string;
  syncedAt: string;
  storage?: {
    cache: boolean;
    d1: boolean;
    durable: boolean;
  };
}

export interface ApiResponse<T> {
  source: DataSource;
  stale: boolean;
  data: T;
}

export interface SiteData {
  currentUser: User;
  users: User[];
  playerProfiles: PlayerProfile[];
  accountLinks: AccountLink[];
  publicConfig: PublicConfig;
  professions: Profession[];
  categories: Category[];
  items: MarketItem[];
  listings: PlayerListing[];
  transactions: Transaction[];
  priceSeries: PricePoint[];
  towns: Town[];
  nations: Nation[];
  diplomacy: DiplomacyRelation[];
  queuedActions: QueuedAction[];
  server: ServerSnapshot;
  announcements: Announcement[];
  events: Event[];
  leaderboards: Record<string, LeaderboardEntry[]>;
  markers: MapMarker[];
  integrations: IntegrationStatus[];
  auditLogs: AuditLog[];
}
