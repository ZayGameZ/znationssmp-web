"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PricePoint } from "@/types";
import { currency } from "@/lib/utils";

export function MarketChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 16, bottom: 0 }}>
          <defs>
            <linearGradient id="marketGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#d4af37" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis dataKey="label" stroke="#858585" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke="#858585" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}K`} />
          <Tooltip
            contentStyle={{
              background: "#090909",
              border: "1px solid rgba(212,175,55,.35)",
              borderRadius: 8,
              color: "#fff"
            }}
            formatter={(value) => [currency(Number(value)), "Market Volume"]}
          />
          <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={3} fill="url(#marketGold)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
