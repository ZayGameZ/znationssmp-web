import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <DashboardView user={user} />;
}
