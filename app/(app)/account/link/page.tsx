import { redirect } from "next/navigation";
import { LinkAccountForm } from "@/components/account/link-account-form";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountLinkPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">In-Game Confirmation Required</p>
        <h1 className="text-4xl font-black uppercase">Link Minecraft</h1>
        <p className="mt-2 text-zinc-400">Create a pending request here, then confirm from the Minecraft server so nobody can claim someone else&apos;s player profile.</p>
      </div>
      <LinkAccountForm websiteUsername={user.username} />
    </div>
  );
}
