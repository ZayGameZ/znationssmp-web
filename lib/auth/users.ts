import { withD1, type D1Row } from "@/lib/db/d1";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { Role, User } from "@/types";

type UserRow = D1Row & {
  id: string;
  username: string;
  role: Role;
  minecraft_uuid?: string | null;
  profession_id?: string | null;
  town_id?: string | null;
  nation_id?: string | null;
  balance?: number | null;
  playtime_minutes?: number | null;
  avatar_url?: string | null;
  password_hash?: string | null;
};

export async function findUserById(userId: string) {
  return withD1(
    async (db) => {
      const row = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first<UserRow>();
      return row ? rowToUser(row) : null;
    },
    async () => null
  );
}

export async function findUserByCredentials(username: string, password: string) {
  return withD1(
    async (db) => {
      const row = await db.prepare("SELECT * FROM users WHERE lower(username) = lower(?)").bind(username).first<UserRow>();
      if (!row || !(await verifyPassword(password, row.password_hash))) return null;
      return rowToUser(row);
    },
    async () => null
  );
}

export async function createWebsiteUser(username: string, password: string) {
  return withD1(
    async (db) => {
      const id = `u-${crypto.randomUUID()}`;
      const passwordHash = await hashPassword(password);
      const avatarUrl = `https://mc-heads.net/avatar/${encodeURIComponent(username)}/64`;
      await db
        .prepare(
          `INSERT INTO users (id, username, role, minecraft_uuid, profession_id, town_id, nation_id, balance, playtime_minutes, avatar_url, password_hash)
           VALUES (?, ?, 'player', '', 'unassigned', '', '', 0, 0, ?, ?)`
        )
        .bind(id, username, avatarUrl, passwordHash)
        .run();
      return {
        id,
        username,
        role: "player" as const,
        minecraftUuid: "",
        professionId: "unassigned",
        townId: "",
        nationId: "",
        balance: 0,
        playtimeMinutes: 0,
        avatarUrl,
        badges: ["Website Account"]
      };
    },
    async () => null
  );
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    minecraftUuid: row.minecraft_uuid ?? "",
    professionId: row.profession_id ?? "unassigned",
    townId: row.town_id ?? "",
    nationId: row.nation_id ?? "",
    balance: Number(row.balance ?? 0),
    playtimeMinutes: Number(row.playtime_minutes ?? 0),
    avatarUrl: row.avatar_url ?? `https://mc-heads.net/avatar/${encodeURIComponent(row.username)}/64`,
    badges: [row.role === "owner" ? "Owner" : row.role === "admin" ? "Admin" : "Player"]
  };
}
