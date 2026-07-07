import { ShieldCheck } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { ApplyForm } from "@/components/community/apply-form";

export const dynamic = "force-dynamic";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-2xl px-4 py-12 md:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="banner-tab"><ShieldCheck className="h-3.5 w-3.5" /> Join the Staff</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">Serve the Realm</h1>
          <div className="crest-rule mx-auto mt-4 w-40" />
          <p className="mt-5 max-w-2xl text-zn-parchment/70">
            Help keep ZNations fair, active, and thriving. Apply to join the moderation or admin team below.
          </p>
        </div>
        <div className="mt-10">
          <ApplyForm />
        </div>
      </main>
    </div>
  );
}
