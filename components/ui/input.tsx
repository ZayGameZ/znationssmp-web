import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-zn-line bg-black/45 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zn-gold focus:ring-2 focus:ring-zn-gold/20",
        className
      )}
      {...props}
    />
  );
}
