import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  tone = "gold"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext: string;
  tone?: "gold" | "emerald" | "blue" | "red";
}) {
  const tones = {
    gold: "text-zn-gold bg-zn-gold/12",
    emerald: "text-zn-emerald bg-zn-emerald/10",
    blue: "text-sky-300 bg-sky-400/10",
    red: "text-red-300 bg-zn-danger/10"
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn("grid h-12 w-12 place-items-center rounded-full", tones[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-white">{value}</p>
          <p className="text-xs text-zinc-400">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
}
