import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        neutral: "border-border-hairline bg-surface-sunken text-ink-secondary",
        accent: "border-transparent bg-accent text-ink-on-accent animate-glow-pulse",
        verified: "border-transparent bg-success text-white",
        outline: "border-border-strong bg-transparent text-ink-primary",
        inverted: "border-white/25 bg-white/10 text-ink-inverted backdrop-blur-md",
        danger: "border-transparent bg-danger text-white",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
