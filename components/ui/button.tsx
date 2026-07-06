import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold uppercase tracking-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zn-gold disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-b from-zn-lightGold to-zn-deepGold text-black shadow-gold hover:brightness-110",
        outline: "border border-zn-line bg-black/30 text-zinc-100 hover:border-zn-gold hover:text-zn-lightGold",
        ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
        danger: "border border-zn-danger/60 bg-zn-danger/10 text-red-200 hover:bg-zn-danger/20"
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-7"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
