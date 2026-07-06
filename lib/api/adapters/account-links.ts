import { withD1, type D1Row } from "@/lib/db/d1";
import { siteData } from "@/lib/mock-data";
import type { AccountLink } from "@/types";

type AccountLinkRow = D1Row & {
  id: string;
  user_id: string;
  website_username: string;
  minecraft_name: string;
  minecraft_uuid?: string | null;
  status: AccountLink["status"];
  requested_at: string;
  confirmed_at?: string | null;
  expires_at: string;
};

export async function getAccountLinksForUser(userId: string) {
  return withD1(
    async (db) => {
      const rows = await db.prepare("SELECT * FROM account_links WHERE user_id = ? ORDER BY requested_at DESC").bind(userId).all<AccountLinkRow>();
      return rows.results.map(mapLink);
    },
    async () => siteData.accountLinks.filter((link) => link.userId === userId)
  );
}

function mapLink(row: AccountLinkRow): AccountLink {
  return {
    id: row.id,
    userId: row.user_id,
    websiteUsername: row.website_username,
    minecraftName: row.minecraft_name,
    minecraftUuid: row.minecraft_uuid ?? undefined,
    status: row.status,
    requestedAt: row.requested_at,
    confirmedAt: row.confirmed_at ?? undefined,
    expiresAt: row.expires_at
  };
}
