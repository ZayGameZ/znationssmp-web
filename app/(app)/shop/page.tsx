import { ShopClient } from "@/components/shop/shop-client";
import { siteData } from "@/lib/mock-data";

export default function ShopPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">DynamicShop Frontend</p>
        <h1 className="text-4xl font-black uppercase">Market Catalog</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Browse server items, player listings, profession recommendations, and queued checkout flows. Live DynamicShop sync can attach through `/api/dynamicshop/*`.</p>
      </div>
      <ShopClient items={siteData.items} categories={siteData.categories} professions={siteData.professions} />
    </div>
  );
}
