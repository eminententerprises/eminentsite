"use client";

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { formatPKR } from "@/lib/format-pkr";
import { cn } from "@/lib/utils";

export function PriceTag({
  amount,
  perMonth = false,
  className,
  size = "md",
}: {
  amount: number;
  perMonth?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { short, full } = formatPKR(amount, { perMonth });
  const sizeClass = size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-body-md" : "text-xl";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("font-tabular-nums font-semibold text-navy-800", sizeClass, className)}>{short}</span>
        </TooltipTrigger>
        <TooltipContent>{full}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
