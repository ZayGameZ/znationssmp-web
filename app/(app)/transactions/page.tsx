import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteData } from "@/lib/mock-data";
import { currency } from "@/lib/utils";

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <div><p className="text-sm font-black uppercase text-zn-gold">Economy History</p><h1 className="text-4xl font-black uppercase">Transactions</h1></div>
      <Card>
        <CardHeader><CardTitle>Recent Market Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:hidden">
            {siteData.transactions.map((tx) => {
              const item = siteData.items.find((candidate) => candidate.materialId === tx.materialId);
              return (
                <article key={tx.id} className="rounded border border-zn-line bg-black/35 p-3">
                  <div className="flex items-center gap-3">
                    <Image src={item?.iconPath ?? "/minecraft/items/diamond.png"} alt="" width={38} height={38} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">{tx.itemName} x{tx.quantity}</p>
                      <p className="text-xs text-zinc-500">{tx.type} / {tx.timeAgo}</p>
                    </div>
                    <p className="font-black text-zn-emerald">{currency(tx.price)}</p>
                  </div>
                  <p className="mt-3 text-xs text-zinc-400">{tx.seller} to {tx.buyer}</p>
                </article>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="text-left text-xs uppercase text-zinc-500"><tr><th className="py-3">Item</th><th>Type</th><th>Seller</th><th>Buyer</th><th>Quantity</th><th>Price</th><th>Time</th></tr></thead>
            <tbody>{siteData.transactions.map((tx) => {
              const item = siteData.items.find((candidate) => candidate.materialId === tx.materialId);
              return <tr key={tx.id} className="border-t border-white/10"><td className="flex items-center gap-3 py-3"><Image src={item?.iconPath ?? "/minecraft/items/diamond.png"} alt="" width={34} height={34} />{tx.itemName}</td><td>{tx.type}</td><td>{tx.seller}</td><td>{tx.buyer}</td><td>{tx.quantity}</td><td className="font-black text-zn-emerald">{currency(tx.price)}</td><td className="text-zinc-500">{tx.timeAgo}</td></tr>;
            })}</tbody>
          </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
