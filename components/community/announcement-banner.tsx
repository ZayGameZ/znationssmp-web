import { Megaphone, PartyPopper, ScrollText, Sparkles, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

// Category → CSS treatment. Replaces the old photographic news thumbnails with a
// tinted gradient + icon so there are no raster assets and every announcement
// gets a consistent, on-theme banner keyed to its category.
function accentFor(category: string): { gradient: string; Icon: ComponentType<{ className?: string }> } {
  const key = category.toLowerCase();
  if (key.includes("season")) return { gradient: "from-zn-gold/30 via-zn-crimson/20 to-black", Icon: Sparkles };
  if (key.includes("event") || key.includes("show") || key.includes("spotlight")) return { gradient: "from-emerald-600/25 via-zn-gold/15 to-black", Icon: PartyPopper };
  if (key.includes("patch") || key.includes("update") || key.includes("fix")) return { gradient: "from-zn-crimson/30 via-zn-gold/10 to-black", Icon: Wrench };
  if (key.includes("rule") || key.includes("notice")) return { gradient: "from-zinc-500/25 via-zn-gold/10 to-black", Icon: ScrollText };
  return { gradient: "from-zn-gold/25 via-zn-crimson/15 to-black", Icon: Megaphone };
}

export function AnnouncementBanner({ category, className, variant = "thumb" }: { category: string; className?: string; variant?: "thumb" | "hero" }) {
  const { gradient, Icon } = accentFor(category);
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded border border-zn-line bg-gradient-to-br",
        gradient,
        className
      )}
    >
      {/* Faint heraldic weave over the tint. */}
      <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(200,162,74,0.10) 0 2px, transparent 2px 16px)" }} />
      <Icon className={cn("relative text-zn-lightGold/80", variant === "hero" ? "h-12 w-12" : "h-6 w-6")} />
    </div>
  );
}
