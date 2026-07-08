import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, ShieldCheck, Vote } from "lucide-react";
import { AdminConsole } from "@/components/admin/admin-console";
import { siteData } from "@/lib/mock-data";
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
          announcements={siteData.announcements}
          events={siteData.events}
          items={siteData.items}
          professions={siteData.professions}
          queuedActions={siteData.queuedActions}
          integrations={siteData.integrations}
          auditLogs={siteData.auditLogs}
        setupWarnings={config.setupWarnings}
      />
    </div>
  );
}
