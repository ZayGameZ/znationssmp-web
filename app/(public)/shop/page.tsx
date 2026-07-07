import { Store } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { ShopClient } from "@/components/shop/shop-client";
import { withKV } from "@/lib/cache/kv";
import { getMarketItems } from "@/lib/api/adapters/site";
import { siteData } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  // Live items pushed by the shop plugin; falls back to the (empty) seed list
  // with honest empty states when nothing has been synced yet.
  const items = await withKV("cache:dynamicshop-items", getMarketItems);

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="mx-auto max-w-[1480px] px-4 py-10 md:px-8">
        <div className="mb-6">
          <span className="banner-tab"><Store className="h-3.5 w-3.5" /> The Grand Bazaar</span>
          <h1 className="mt-4 font-display text-4xl tracking-wide md:text-6xl">Market</h1>
          <p className="mt-3 max-w-3xl text-zn-parchment/60">
            The realm&apos;s marketplace — browse items, prices, and trends drawn from the living economy.
          </p>
        </div>
        <ShopClient items={items.data} categories={siteData.categories} professions={siteData.professions} />
      </main>
    </div>
  );
}
