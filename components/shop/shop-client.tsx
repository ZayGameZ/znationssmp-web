"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Filter, Search, ShoppingCart, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { queueClientAction } from "@/lib/queue/actions";
import { currency, percent, trendClass } from "@/lib/utils";
import type { CartLine, Category, MarketItem, Profession } from "@/types";

export function ShopClient({ items, categories, professions }: { items: MarketItem[]; categories: Category[]; professions: Profession[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [profession, setProfession] = useState("all");
  const [selected, setSelected] = useState<MarketItem | null>(items[0] ?? null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [queued, setQueued] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = item.displayName.toLowerCase().includes(query.toLowerCase()) || item.materialId.includes(query.toLowerCase());
      const matchesCategory = category === "all" || item.categoryId === category;
      const matchesProfession = profession === "all" || item.professionTags.includes(profession);
      return matchesQuery && matchesCategory && matchesProfession;
    });
  }, [items, query, category, profession]);

  const total = cart.reduce((sum, line) => sum + line.quantity * line.priceEach, 0);

  async function addToCart(item: MarketItem) {
    setCart((current) => {
      const existing = current.find((line) => line.materialId === item.materialId);
      if (existing) return current.map((line) => line.materialId === item.materialId ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { materialId: item.materialId, quantity: 1, priceEach: item.buyPrice }];
    });
  }

  async function checkout() {
    const action = await queueClientAction({
      userId: "u-zayden",
      type: "dynamicshop-checkout",
      targetType: "shop",
      payload: { total, lines: cart.length }
    });
    setQueued(action.id);
    setCart([]);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <Card>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
              <Input className="pl-9" placeholder="Search items, material ids, or tags..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
            <Select value={profession} onChange={(event) => setProfession(event.target.value)}>
              <option value="all">All Professions</option>
              {professions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
            <Button variant="outline"><Filter className="h-4 w-4" /> Filters</Button>
          </CardContent>
        </Card>
        <section id="categories" className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {categories.length ? categories.map((item) => (
            <button key={item.id} onClick={() => setCategory(item.id)} className="strategy-panel rounded-lg p-4 text-left transition hover:border-zn-gold">
              <p className="font-black uppercase text-zn-lightGold">{item.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
            </button>
          )) : <EmptyState title="No categories synced" body="Categories will appear after the server bridge sends DynamicShop item data." />}
        </section>
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {filtered.length ? filtered.map((item) => (
            <article key={item.materialId} className="strategy-panel rounded-lg p-4">
              <div className="flex items-start justify-between">
                <Image src={item.iconPath} alt={item.displayName} width={92} height={92} />
                <Badge>{item.rarity}</Badge>
              </div>
              <h3 className="mt-3 text-xl font-black">{item.displayName}</h3>
              <p className="text-xs uppercase text-zinc-500">{item.materialId}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-zinc-500">Buy</p><p className="font-black">{currency(item.buyPrice)}</p></div>
                <div><p className="text-zinc-500">Sell</p><p className="font-black">{currency(item.sellPrice)}</p></div>
                <div><p className="text-zinc-500">Stock</p><p className="font-black">{item.stock.toLocaleString()}</p></div>
                <div><p className="text-zinc-500">Trend</p><p className={`font-black ${trendClass(item.trend)}`}>{percent(item.trend)}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">{item.bestFor.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={() => addToCart(item)}><ShoppingCart className="h-4 w-4" /> Add</Button>
                <Button variant="outline" onClick={() => setSelected(item)}>Details</Button>
              </div>
            </article>
          )) : <EmptyState title="No shop items synced" body="The shop is waiting for real item data from the Minecraft server." />}
        </section>
      </div>
      <aside className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Cart & Checkout</CardTitle><Badge>{cart.length} lines</Badge></CardHeader>
          <CardContent className="space-y-3">
            {queued && <div className="rounded border border-zn-emerald/40 bg-zn-emerald/10 p-3 text-sm text-zn-emerald">Checkout queued: {queued.slice(0, 8)}</div>}
            {cart.length === 0 ? <p className="text-sm text-zinc-400">Cart is empty. Add market items to create a queued DynamicShop checkout.</p> : cart.map((line) => {
              const item = items.find((candidate) => candidate.materialId === line.materialId);
              return <div key={line.materialId} className="flex items-center justify-between border-b border-white/10 pb-2 text-sm"><span>{item?.displayName} x{line.quantity}</span><span>{currency(line.quantity * line.priceEach)}</span></div>;
            })}
            <div className="flex items-center justify-between pt-2"><span className="text-zinc-400">Total</span><span className="text-2xl font-black">{currency(total)}</span></div>
            <Button disabled={cart.length === 0} className="w-full" onClick={checkout}>Queue Checkout</Button>
          </CardContent>
        </Card>
        <Card id="players">
          <CardHeader><CardTitle>Player Shops</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-zinc-400">Player shop listings will appear here after the server bridge syncs shop data.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Profession Tips</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>Profession recommendations appear after ZProfessions and market data are synced.</p>
            <p>Until then, the shop avoids showing demo advice as if it were live economy guidance.</p>
          </CardContent>
        </Card>
      </aside>
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/78 p-4 backdrop-blur-sm">
          <div className="strategy-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg">
            <div className="flex items-center justify-between border-b border-zn-line p-5">
              <div><h2 className="text-3xl font-black">{selected.displayName}</h2><p className="text-sm uppercase text-zinc-500">{selected.materialId}</p></div>
              <button onClick={() => setSelected(null)}><X className="h-6 w-6" /></button>
            </div>
            <div className="grid gap-6 p-5 md:grid-cols-[160px_1fr]">
              <Image src={selected.iconPath} alt="" width={150} height={150} />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Info label="Buy Price" value={currency(selected.buyPrice)} />
                  <Info label="Sell Price" value={currency(selected.sellPrice)} />
                  <Info label="Stock" value={selected.stock.toLocaleString()} />
                  <Info label="24h Trend" value={percent(selected.trend)} />
                </div>
                <div><p className="mb-2 font-black uppercase text-zn-lightGold">Restrictions</p>{selected.restrictions.map((item) => <p key={item} className="text-sm text-zinc-300">{item}</p>)}</div>
                <div><p className="mb-2 font-black uppercase text-zn-lightGold">Recommendations</p>{selected.recommendations.map((item) => <p key={item} className="text-sm text-zinc-300">{item}</p>)}</div>
                <Button onClick={() => addToCart(selected)}>Add To Cart</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-zn-line bg-black/35 p-3"><p className="text-xs uppercase text-zinc-500">{label}</p><p className="font-black">{value}</p></div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="strategy-panel rounded-lg p-4"><p className="font-black text-zn-lightGold">{title}</p><p className="mt-1 text-sm text-zinc-400">{body}</p></div>;
}
