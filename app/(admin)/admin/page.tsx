import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin/admin-console";
import { siteData } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth/session";
import { getPublicConfig } from "@/lib/config/site";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !["owner", "admin"].includes(user.role)) {
    redirect("/login?admin=login-required");
  }
  const config = getPublicConfig();

  return (
    <div className="min-h-screen bg-zn-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <div>
          <p className="text-sm font-black uppercase text-zn-gold">Owner Control Center</p>
          <h1 className="text-4xl font-black uppercase">Admin Console</h1>
          <p className="mt-2 text-zinc-400">Manage marketplace content, profession economy settings, queued actions, integrations, and audit logs.</p>
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
    </div>
  );
}
