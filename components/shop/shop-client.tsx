"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { currency, percent, trendClass } from "@/lib/utils";
import type { Category, MarketItem, Profession } from "@/types";

// Browse-only market client. In-browser purchasing is deliberately absent until a
// real, secure checkout path to the server economy exists — no fake carts.
export function ShopClient({ items, categories, professions }: { items: MarketItem[]; categories: Category[]; professions: Profession[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [profession, setProfession] = useState("all");
  const [selected, setSelected] = useState<MarketItem | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = item.displayName.toLowerCase().includes(query.toLowerCase()) || item.materialId.includes(query.toLowerCase());
      const matchesCategory = category === "all" || item.categoryId === category;
      const matchesProfession = profession === "all" || item.professionTags.includes(profession);
      return matchesQuery && matchesCategory && matchesProfession;
    });
  }, [items, query, category, profession]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
            <Input className="pl-9" placeholder="Search items or materials…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>
          <Select value={profession} onChange={(event) => setProfession(event.target.value)}>
            <option value="all">All Professions</option>
            {professions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>
        </CardContent>
      </Card>

      {categories.length ? (
        <section id="categories" className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((item) => (
            <button key={item.id} onClick={() => setCategory(item.id)} className="strategy-panel rounded-lg p-4 text-left transition hover:border-zn-gold/60">
              <p className="font-display tracking-wide text-zn-lightGold">{item.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
            </button>
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.length ? filtered.map((item) => (
          <article key={item.materialId} className="strategy-panel rounded-lg p-4">
            <div className="flex items-start justify-between">
              <Image src={item.iconPath} alt={item.displayName} width={92} height={92} />
              <Badge>{item.rarity}</Badge>
            </div>
            <h3 className="mt-3 font-display text-xl tracking-wide">{item.displayName}</h3>
            <p className="text-xs uppercase text-zinc-500">{item.materialId}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-zinc-500">Buy</p><p className="font-bold">{currency(item.buyPrice)}</p></div>
              <div><p className="text-zinc-500">Sell</p><p className="font-bold">{currency(item.sellPrice)}</p></div>
              <div><p className="text-zinc-500">Stock</p><p className="font-bold">{item.stock.toLocaleString()}</p></div>
              <div><p className="text-zinc-500">Trend</p><p className={`font-bold ${trendClass(item.trend)}`}>{percent(item.trend)}</p></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{item.bestFor.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setSelected(item)}>View Details</Button>
          </article>
        )) : (
          <EmptyState
            title="The bazaar opens soon"
            body="Live items and prices from the server economy will fill these shelves. Trade in person on the server until then."
          />
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/78 p-4 backdrop-blur-sm">
          <div className="strategy-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg">
            <div className="flex items-center justify-between border-b border-zn-line p-5">
              <div><h2 className="font-display text-3xl tracking-wide">{selected.displayName}</h2><p className="text-sm uppercase text-zinc-500">{selected.materialId}</p></div>
              <button aria-label="Close" onClick={() => setSelected(null)}><X className="h-6 w-6" /></button>
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
                {selected.restrictions.length ? <div><p className="mb-2 font-display text-sm tracking-wide text-zn-lightGold">Restrictions</p>{selected.restrictions.map((item) => <p key={item} className="text-sm text-zinc-300">{item}</p>)}</div> : null}
                {selected.recommendations.length ? <div><p className="mb-2 font-display text-sm tracking-wide text-zn-lightGold">Recommendations</p>{selected.recommendations.map((item) => <p key={item} className="text-sm text-zinc-300">{item}</p>)}</div> : null}
                <p className="text-sm text-zinc-500">Buy and sell in-game at the market. Website trading arrives with a secure checkout.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-zn-line bg-black/35 p-3"><p className="text-xs uppercase text-zinc-500">{label}</p><p className="font-bold">{value}</p></div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="strategy-panel rounded-lg p-4 md:col-span-2 xl:col-span-3 2xl:col-span-4"><p className="font-display tracking-wide text-zn-lightGold">{title}</p><p className="mt-1 text-sm text-zinc-400">{body}</p></div>;
}
