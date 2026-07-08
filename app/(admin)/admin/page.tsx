import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, ShieldCheck, Vote } from "lucide-react";
import { AdminConsole } from "@/components/admin/admin-console";
import { getAnnouncements } from "@/lib/api/adapters/announcements";
import { getAuditLogs } from "@/lib/api/adapters/audit";
import { getEvents } from "@/lib/api/adapters/events";
import { getIntegrationStatuses } from "@/lib/api/adapters/integrations";
import { getQueuedActions } from "@/lib/api/adapters/queue";
import { getMarketItems, getProfessions } from "@/lib/api/adapters/site";
import { withKV } from "@/lib/cache/kv";
import { getCurrentUser } from "@/lib/auth/session";
import { getPublicConfig } from "@/lib/config/site";

const managementLinks = [
  { href: "/admin/announcements", title: "Announcements", blurb: "Publish news to the site & dashboards", Icon: Bell },
  { href: "/admin/polls", title: "Polls", blurb: "Put questions to the community", Icon: Vote },
  { href: "/admin/applications", title: "Staff Applications", blurb: "Review and decide on applicants", Icon: ShieldCheck }
] as const;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !["owner", "admin"].includes(user.role)) {
    redirect("/login?admin=login-required");
  }
  const config = getPublicConfig();
  const [announcements, events, queuedActions, auditLogs, itemsResult, professions, integrations] = await Promise.all([
    getAnnouncements(),
    getEvents(),
    getQueuedActions(),
    getAuditLogs(),
    withKV("cache:dynamicshop-items", getMarketItems),
    getProfessions(),
    getIntegrationStatuses()
  ]);
  const items = itemsResult.data;

  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Owner Control Center</p>
        <h1 className="text-4xl font-black uppercase">Admin Console</h1>
        <p className="mt-2 text-zinc-400">Manage marketplace content, profession economy settings, queued actions, integrations, and audit logs.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
          {managementLinks.map(({ href, title, blurb, Icon }) => (
            <Link key={href} href={href} className="rounded border border-zn-line bg-black/35 p-4 transition hover:border-zn-gold/50">
              <Icon className="mb-3 h-7 w-7 text-zn-gold" />
              <p className="font-black uppercase">{title}</p>
              <p className="mt-1 text-sm text-zinc-400">{blurb}</p>
            </Link>
          ))}
        </div>
        <AdminConsole
          announcements={announcements}
          events={events}
          items={items}
          professions={professions}
          queuedActions={queuedActions}
          integrations={integrations}
          auditLogs={auditLogs}
        setupWarnings={config.setupWarnings}
      />
    </div>
  );
}
