import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusPill({ online, label }: { online: boolean; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded border px-2.5 py-1 text-xs font-black uppercase",
        online ? "border-zn-emerald/40 bg-zn-emerald/10 text-zn-emerald" : "border-zn-danger/40 bg-zn-danger/10 text-red-300"
      )}
    >
      <Circle className="h-2.5 w-2.5 fill-current" />
      {label ?? (online ? "Online" : "Offline")}
    </span>
  );
}
