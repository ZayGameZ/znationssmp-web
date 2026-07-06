import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src="/brand/zn-shield.svg" alt="ZNations shield" width={compact ? 42 : 72} height={compact ? 50 : 86} priority />
      <div>
        <div className={compact ? "text-xl font-black uppercase" : "text-4xl font-black uppercase"}>
          <span className="gold-title">ZNATIONS</span>
          {!compact && <span className="silver-title"> SMP</span>}
        </div>
        <p className="text-xs font-bold uppercase text-zinc-400">{compact ? "Official Marketplace" : "Build your nation. Leave your legacy."}</p>
      </div>
    </div>
  );
}
