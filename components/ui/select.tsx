import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 rounded-md border border-zn-line bg-black/45 px-3 text-sm text-white outline-none focus:border-zn-gold focus:ring-2 focus:ring-zn-gold/20",
        className
      )}
      {...props}
    />
  );
}
