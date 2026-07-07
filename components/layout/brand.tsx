import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src="/brand/zn-shield.svg" alt="ZNations shield" width={compact ? 42 : 72} height={compact ? 50 : 86} priority />
      <div>
        <div className={`font-display tracking-[0.1em] ${compact ? "text-lg" : "text-4xl"}`}>
          <span className="gold-title">ZNATIONS</span>
          {!compact && <span className="silver-title"> SMP</span>}
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zn-parchment/50">
          {compact ? "Civilization Server" : "Build your nation. Leave your legacy."}
        </p>
      </div>
    </div>
  );
}
