import type {
  Announcement,
  AuditLog,
  Category,
  DiplomacyRelation,
  Event,
  IntegrationStatus,
  LeaderboardEntry,
  MapMarker,
  MarketItem,
  Nation,
  PlayerProfile,
  PlayerListing,
  PricePoint,
  Profession,
  PublicConfig,
  QueuedAction,
  ServerSnapshot,
  SiteData,
  Town,
  Transaction,
  User
} from "@/types";
import { getGuestUser } from "@/lib/auth/bootstrap";

export const professions: Profession[] = [
  {
    id: "miner",
    name: "Miner",
    icon: "Pickaxe",
    color: "#35d6d6",
    description: "Ore specialist with vein-mining economy pressure.",
    perks: ["Vein Miner", "Ore haste", "Rare ore access"],
    restrictions: ["Advanced ores favor miners"],
    marketTags: ["Ores", "Tools", "Beacon"],
    economyFocus: "High value resources and bulk stone supply"
  },
  {
    id: "blacksmith",
    name: "Blacksmith",
    icon: "Hammer",
    color: "#d4af37",
    description: "Gear maker controlling advanced tools and armor demand.",
    perks: ["Repair refunds", "Smithing discounts", "Gear crafting"],
    restrictions: ["Advanced gear crafting"],
    marketTags: ["Armor", "Tools", "Ingots"],
    economyFocus: "Netherite, armor, tools, and repair materials"
  },
  {
    id: "farmer",
    name: "Farmer",
    icon: "Wheat",
    color: "#78d45b",
    description: "Food and animal-drop producer for towns and armies.",
    perks: ["Crop bonuses", "Animal drops", "Breeding access"],
    restrictions: ["High-yield farming actions"],
    marketTags: ["Food", "Crops", "Animal Drops"],
    economyFocus: "Stable food supply and animal resource loops"
  },
  {
    id: "enchanter",
    name: "Enchanter",
    icon: "Sparkles",
    color: "#b676ff",
    description: "Magic economy specialist for books, lapis, and XP value.",
    perks: ["Lapis refunds", "XP discounts", "Improved enchant offers"],
    restrictions: ["Enchanting table expertise"],
    marketTags: ["Books", "Lapis", "XP"],
    economyFocus: "Enchantments, books, lapis, and premium gear upgrades"
  },
  {
    id: "fisher",
    name: "Fisher",
    icon: "Fish",
    color: "#62b8ff",
    description: "Water economy, treasure support, and food stability.",
    perks: ["Bonus fish", "Treasure bonus", "Fishing XP"],
    restrictions: ["Fishing treasure efficiency"],
    marketTags: ["Fish", "Treasure", "Food"],
    economyFocus: "Food, rods, and rare catch supply"
  }
];

export const users: User[] = [
  {
    id: "u-zayden",
    username: "Zayden",
    role: "owner",
    minecraftUuid: "00000000-0000-0000-0000-000000000001",
    professionId: "blacksmith",
    townId: "valoria",
    nationId: "valyria",
    balance: 2456.78,
    playtimeMinutes: 14820,
    avatarUrl: "https://mc-heads.net/avatar/Zayden/64",
    badges: ["Owner", "Founder", "Market Maker"]
  },
  {
    id: "u-richminer",
    username: "RichMiner_",
    role: "player",
    minecraftUuid: "00000000-0000-0000-0000-000000000002",
    professionId: "miner",
    townId: "ironhold",
    nationId: "ironhold",
    balance: 142332.1,
    playtimeMinutes: 9840,
    avatarUrl: "https://mc-heads.net/avatar/RichMiner_/64",
    badges: ["Top Seller"]
  },
  {
    id: "u-trade",
    username: "TradeMaster",
    role: "player",
    minecraftUuid: "00000000-0000-0000-0000-000000000003",
    professionId: "farmer",
    townId: "nova-market",
    nationId: "nova-empire",
    balance: 98755.45,
    playtimeMinutes: 7730,
    avatarUrl: "https://mc-heads.net/avatar/TradeMaster/64",
    badges: ["Merchant"]
  }
];

export const playerProfiles: PlayerProfile[] = users.map((user, index) => ({
  username: user.username,
  minecraftUuid: user.minecraftUuid,
  userId: user.id,
  avatarUrl: user.avatarUrl,
  online: index !== 2,
  professionId: user.professionId,
  townId: user.townId,
  nationId: user.nationId,
  balance: user.balance,
  playtimeMinutes: user.playtimeMinutes,
  stats: {
    kills: [128, 244, 37][index] ?? 0,
    deaths: [42, 91, 18][index] ?? 0,
    kdRatio: [3.05, 2.68, 2.06][index] ?? 0,
    blocksBroken: [18420, 90312, 22104][index] ?? 0,
    blocksPlaced: [9401, 12770, 18444][index] ?? 0,
    mobsKilled: [880, 1432, 612][index] ?? 0,
    lastSeenAt: index === 2 ? "2026-07-05T10:18:00Z" : "2026-07-05T12:34:00Z"
  },
  shopSummary: {
    activeListings: [12, 34, 18][index] ?? 0,
    sold24h: [8, 71, 42][index] ?? 0,
    shopValue: [18450, 142332, 98755][index] ?? 0
  },
  questSummary: index === 1 ? "2/3 daily profession quests complete" : "1/3 daily quests complete",
  professionSummary: `${user.badges[0] ?? "Player"} with ${Math.round(user.playtimeMinutes / 60)} hours played`,
  badges: user.badges
}));

export const accountLinks = [
  {
    id: "link-zayden",
    userId: "u-zayden",
    websiteUsername: "Zayden",
    minecraftName: "Zayden",
    minecraftUuid: "00000000-0000-0000-0000-000000000001",
    status: "confirmed" as const,
    requestedAt: "2026-07-05T10:00:00Z",
    confirmedAt: "2026-07-05T10:02:00Z",
    expiresAt: "2026-07-06T10:00:00Z"
  }
];

export const publicConfig: PublicConfig = {
  siteUrl: "http://localhost:3000",
  serverName: "ZNations SMP",
  javaAddress: "play.znationssmp.com",
  bedrockAddress: "bedrock.znationssmp.com",
  bedrockPort: "19132",
  discordUrl: "",
  bluemapUrl: "",
  setupWarnings: []
};

export const categories: Category[] = [
  { id: "ores", name: "Ores & Ingots", icon: "Gem", description: "Diamonds, netherite, metals, and mining resources." },
  { id: "rare", name: "Rare Items", icon: "Crown", description: "Totems, stars, beacons, and limited high-value goods." },
  { id: "gear", name: "Gear", icon: "Shield", description: "Tools, armor, elytra, and combat equipment." },
  { id: "magic", name: "Magic", icon: "Sparkles", description: "Enchanting supplies, books, and XP-linked items." },
  { id: "farming", name: "Farming", icon: "Wheat", description: "Food, crops, animal goods, and town supply goods." }
];

export const items: MarketItem[] = [
  {
    materialId: "diamond",
    displayName: "Diamond",
    categoryId: "ores",
    buyPrice: 1542.32,
    sellPrice: 1388.09,
    stock: 1248,
    trend: 12.45,
    volume24h: 642,
    rarity: "Rare",
    professionTags: ["miner", "blacksmith"],
    bestFor: ["Miner", "Blacksmith"],
    restrictions: ["Best mined by Miner profession"],
    recommendations: ["Buy during miner surplus", "Used heavily for town gear drives"],
    iconPath: "/minecraft/items/diamond.png"
  },
  {
    materialId: "netherite_ingot",
    displayName: "Netherite Ingot",
    categoryId: "ores",
    buyPrice: 8732.1,
    sellPrice: 7850.0,
    stock: 128,
    trend: 8.21,
    volume24h: 86,
    rarity: "Legendary",
    professionTags: ["miner", "blacksmith"],
    bestFor: ["Blacksmith"],
    restrictions: ["Smithing value peaks for Blacksmiths"],
    recommendations: ["Hold during war preparation", "Pairs with Elytra repair economy"],
    iconPath: "/minecraft/items/netherite_ingot.png"
  },
  {
    materialId: "enchanted_golden_apple",
    displayName: "Enchanted Golden Apple",
    categoryId: "rare",
    buyPrice: 3201.55,
    sellPrice: 2880.0,
    stock: 18,
    trend: -4.31,
    volume24h: 14,
    rarity: "Legendary",
    professionTags: ["hunter", "enchanter"],
    bestFor: ["Hunter", "Enchanter"],
    restrictions: ["Limited war-supply item"],
    recommendations: ["Watch before PvP weekends", "Good hedge during invasion events"],
    iconPath: "/minecraft/items/enchanted_golden_apple.png"
  },
  {
    materialId: "totem_of_undying",
    displayName: "Totem of Undying",
    categoryId: "rare",
    buyPrice: 7654.22,
    sellPrice: 6880.0,
    stock: 44,
    trend: 6.72,
    volume24h: 22,
    rarity: "Epic",
    professionTags: ["hunter"],
    bestFor: ["Hunter"],
    restrictions: ["Hunter supply chain advantage"],
    recommendations: ["High demand during raids", "Featured for nation vaults"],
    iconPath: "/minecraft/items/totem_of_undying.png"
  },
  {
    materialId: "shulker_box",
    displayName: "Shulker Box",
    categoryId: "rare",
    buyPrice: 2112.45,
    sellPrice: 1900.0,
    stock: 73,
    trend: -2.18,
    volume24h: 51,
    rarity: "Epic",
    professionTags: ["miner", "lumberjack"],
    bestFor: ["Miner", "Lumberjack"],
    restrictions: ["Logistics item for bulk gatherers"],
    recommendations: ["Buy for resource expeditions", "Useful for town restocks"],
    iconPath: "/minecraft/items/shulker_box.png"
  },
  {
    materialId: "elytra",
    displayName: "Elytra",
    categoryId: "gear",
    buyPrice: 9812.33,
    sellPrice: 8840.0,
    stock: 9,
    trend: 9.33,
    volume24h: 3,
    rarity: "Legendary",
    professionTags: ["blacksmith", "enchanter"],
    bestFor: ["Blacksmith", "Enchanter"],
    restrictions: ["High-value travel item"],
    recommendations: ["Repair with Blacksmith support", "Enchant before long-range wars"],
    iconPath: "/minecraft/items/elytra.png"
  },
  {
    materialId: "beacon",
    displayName: "Beacon",
    categoryId: "rare",
    buyPrice: 9312.88,
    sellPrice: 8350.0,
    stock: 12,
    trend: 3.14,
    volume24h: 7,
    rarity: "Legendary",
    professionTags: ["miner", "enchanter"],
    bestFor: ["Miner"],
    restrictions: ["Nation infrastructure item"],
    recommendations: ["Strong town upgrade purchase", "Monitor emerald and nether star trends"],
    iconPath: "/minecraft/items/beacon.png"
  },
  {
    materialId: "nether_star",
    displayName: "Nether Star",
    categoryId: "rare",
    buyPrice: 12445.9,
    sellPrice: 11200.0,
    stock: 5,
    trend: 11.02,
    volume24h: 2,
    rarity: "Legendary",
    professionTags: ["hunter", "miner"],
    bestFor: ["Hunter", "Miner"],
    restrictions: ["Boss-drop supply chain"],
    recommendations: ["Rare-item surge risk", "Pairs with Beacon crafting demand"],
    iconPath: "/minecraft/items/nether_star.png"
  }
];

export const priceSeries: PricePoint[] = [
  { label: "12 AM", value: 245000, volume: 420 },
  { label: "3 AM", value: 520000, volume: 560 },
  { label: "6 AM", value: 760000, volume: 710 },
  { label: "9 AM", value: 1210000, volume: 930 },
  { label: "12 PM", value: 1090000, volume: 860 },
  { label: "3 PM", value: 1540000, volume: 1100 },
  { label: "6 PM", value: 1480000, volume: 1020 },
  { label: "9 PM", value: 1360000, volume: 900 },
  { label: "12 AM ", value: 998000, volume: 740 }
];

export const listings: PlayerListing[] = [
  { id: "l1", sellerId: "u-richminer", materialId: "diamond", quantity: 64, priceEach: 1531.31, expiresAt: "2026-07-12T00:00:00Z" },
  { id: "l2", sellerId: "u-trade", materialId: "shulker_box", quantity: 6, priceEach: 2088.0, expiresAt: "2026-07-10T00:00:00Z" }
];

export const transactions: Transaction[] = [
  { id: "t1", itemName: "Diamond", materialId: "diamond", seller: "MinerJoe_", buyer: "BlockBaron", price: 98703.68, quantity: 64, timeAgo: "2m ago", type: "BUY" },
  { id: "t2", itemName: "Netherite Ingot", materialId: "netherite_ingot", seller: "NetherKing", buyer: "RichMiner_", price: 139713.6, quantity: 16, timeAgo: "5m ago", type: "BUY" },
  { id: "t3", itemName: "Enchanted Golden Apple", materialId: "enchanted_golden_apple", seller: "AppleFarmer", buyer: "Zayden", price: 9604.65, quantity: 3, timeAgo: "7m ago", type: "SELL" },
  { id: "t4", itemName: "Totem of Undying", materialId: "totem_of_undying", seller: "LuckyTotem", buyer: "MineQueen", price: 7654.22, quantity: 1, timeAgo: "11m ago", type: "BUY" },
  { id: "t5", itemName: "Shulker Box", materialId: "shulker_box", seller: "StoragePro", buyer: "BuildBoss", price: 4224.9, quantity: 2, timeAgo: "12m ago", type: "SELL" }
];

export const towns: Town[] = [
  { id: "valoria", name: "Valoria", mayorId: "u-zayden", nationId: "valyria", members: 28, bank: 540000, taxRate: 5, claims: 118, status: "Recruiting" },
  { id: "ironhold", name: "Ironhold", mayorId: "u-richminer", nationId: "ironhold", members: 17, bank: 312000, taxRate: 4.5, claims: 82, status: "Invite Only" },
  { id: "nova-market", name: "Nova Market", mayorId: "u-trade", nationId: "nova-empire", members: 24, bank: 421500, taxRate: 3, claims: 96, status: "Recruiting" }
];

export const nations: Nation[] = [
  { id: "valyria", name: "Valyria", leaderId: "u-zayden", capitalTownId: "valoria", members: 28, towns: 4, wealth: 2450000, power: 1250, status: "Recruiting" },
  { id: "nova-empire", name: "Nova Empire", leaderId: "u-trade", capitalTownId: "nova-market", members: 24, towns: 3, wealth: 1980500, power: 1100, status: "Peaceful" },
  { id: "ironhold", name: "Ironhold", leaderId: "u-richminer", capitalTownId: "ironhold", members: 17, towns: 2, wealth: 1325250, power: 920, status: "At War" }
];

export const diplomacy: DiplomacyRelation[] = [
  { id: "d1", sourceNationId: "valyria", targetNationId: "nova-empire", type: "Ally" },
  { id: "d2", sourceNationId: "valyria", targetNationId: "ironhold", type: "Rival" }
];

export const queuedActions: QueuedAction[] = [
  { id: "q1", userId: "u-zayden", type: "update-town-tax", targetType: "town", targetId: "valoria", status: "queued", payload: { taxRate: 5.5 }, createdAt: "2026-07-05T12:00:00Z" }
];

export const server: ServerSnapshot = {
  online: true,
  playersOnline: 87,
  maxPlayers: 200,
  tps: 19.98,
  pingMs: 42,
  uptime: "2d 14h 36m",
  lastSyncedAt: "2026-07-05T12:30:00Z",
  stale: false
};

export const announcements: Announcement[] = [
  { id: "a1", title: "Season 1 is Here", body: "The world is open. Build, conquer, and make your mark.", category: "Season", image: "/backgrounds/news-season.jpg", timeAgo: "2h ago", pinned: true },
  { id: "a2", title: "Custom Plugin Showcase", body: "Take a look at the systems that make ZNations unique.", category: "Update", image: "/backgrounds/news-showcase.jpg", timeAgo: "1d ago", pinned: false },
  { id: "a3", title: "Server Updates", body: "Performance improvements and new features added.", category: "Patch", image: "/backgrounds/news-update.jpg", timeAgo: "2d ago", pinned: false }
];

export const events: Event[] = [
  { id: "e1", title: "Market Surge", description: "Rare item prices move faster while merchants compete.", type: "Economy", startsAt: "2026-07-05T18:00:00Z", active: true, reward: "Trading volume bonus" },
  { id: "e2", title: "Grace Period Active", description: "Town conflict is paused while new settlements claim land.", type: "Civilization", startsAt: "2026-07-05T00:00:00Z", endsAt: "2026-07-06T00:00:00Z", active: true, reward: "Protected expansion" },
  { id: "e3", title: "Resource Boom", description: "Miners and lumberjacks report richer gathering routes.", type: "Professions", startsAt: "2026-07-07T20:00:00Z", active: false, reward: "Profession boost" }
];

export const leaderboards: Record<string, LeaderboardEntry[]> = {
  nations: nations.map((nation) => ({
    id: nation.id,
    name: nation.name,
    value: `$${nation.wealth.toLocaleString()}`,
    subtext: `${nation.members} members`
  })),
  sellers: [
    { id: "s1", name: "RichMiner_", value: "$142,332.10", subtext: "Miner" },
    { id: "s2", name: "TradeMaster", value: "$98,755.45", subtext: "Farmer" },
    { id: "s3", name: "BlockBaron", value: "$76,881.20", subtext: "Builder" },
    { id: "s4", name: "MineQueen", value: "$65,221.75", subtext: "Enchanter" },
    { id: "s5", name: "ZBuilder", value: "$48,654.30", subtext: "Blacksmith" }
  ],
  professions: professions.map((profession, index) => ({
    id: profession.id,
    name: profession.name,
    value: `${(92000 - index * 8200).toLocaleString()} volume`,
    subtext: profession.economyFocus
  }))
};

export const markers: MapMarker[] = [
  { id: "m1", name: "Valoria", type: "town", x: 51, y: 45, color: "#d4af37" },
  { id: "m2", name: "Ironhold", type: "nation", x: 72, y: 61, color: "#ef4444" },
  { id: "m3", name: "Nova Market", type: "shop", x: 37, y: 57, color: "#22c55e" },
  { id: "m4", name: "Market Surge", type: "event", x: 58, y: 69, color: "#b676ff" }
];

export const integrations: IntegrationStatus[] = [
  { id: "dynamicshop", name: "DynamicShop", status: "Cached", endpoint: "/api/dynamicshop", lastSync: "2m ago" },
  { id: "zprofessions", name: "ZProfessions", status: "Cached", endpoint: "/api/zprofessions", lastSync: "3m ago" },
  { id: "towns", name: "Diplomacy Towns/Nations", status: "Not configured", endpoint: "/api/towns", lastSync: "Awaiting plugin" },
  { id: "bluemap", name: "Bluemap", status: "Cached", endpoint: "/api/bluemap", lastSync: "6m ago" }
];

export const auditLogs: AuditLog[] = [
  { id: "log1", actor: "owner", action: "Updated featured item", target: "diamond", status: "success", createdAt: "2026-07-05 12:20" },
  { id: "log2", actor: "owner", action: "Pinned event", target: "market-surge", status: "success", createdAt: "2026-07-05 12:14" },
  { id: "log3", actor: "system", action: "Queued town sync", target: "valoria", status: "success", createdAt: "2026-07-05 12:00" }
];

export const seededSiteData: SiteData = {
  currentUser: users[0],
  users,
  playerProfiles,
  accountLinks,
  publicConfig,
  professions,
  categories,
  items,
  listings,
  transactions,
  priceSeries,
  towns,
  nations,
  diplomacy,
  queuedActions,
  server,
  announcements,
  events,
  leaderboards,
  markers,
  integrations,
  auditLogs
};

const emptyServer: ServerSnapshot = {
  online: false,
  playersOnline: 0,
  maxPlayers: 0,
  tps: 0,
  pingMs: 0,
  uptime: "Waiting for sync",
  lastSyncedAt: "",
  stale: true
};

const demoDataEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === "true" || process.env.ZN_ENABLE_DEMO_DATA === "true";

export const releaseSiteData: SiteData = {
  currentUser: getGuestUser(),
  users: [],
  playerProfiles: [],
  accountLinks: [],
  publicConfig,
  professions: [],
  categories: [],
  items: [],
  listings: [],
  transactions: [],
  priceSeries: [],
  towns: [],
  nations: [],
  diplomacy: [],
  queuedActions: [],
  server: emptyServer,
  announcements: [],
  events: [],
  leaderboards: {
    nations: [],
    sellers: [],
    professions: []
  },
  markers: [],
  integrations: [
    { id: "dynamicshop", name: "DynamicShop", status: "Not configured", endpoint: "/api/dynamicshop", lastSync: "Waiting for server push" },
    { id: "zprofessions", name: "ZProfessions", status: "Not configured", endpoint: "/api/zprofessions", lastSync: "Waiting for server push" },
    { id: "bluemap", name: "Bluemap", status: "Not configured", endpoint: "/api/bluemap", lastSync: "Waiting for server push" }
  ],
  auditLogs: []
};

export const siteData: SiteData = demoDataEnabled ? seededSiteData : releaseSiteData;
