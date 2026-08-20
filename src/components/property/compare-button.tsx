"use client";

import { Scale } from "lucide-react";
import { useCompare } from "@/hooks/use-compare";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function CompareButton({ propertyId, className }: { propertyId: string; className?: string }) {
  const { isInCompare, toggleCompare, isCompareFull, maxCompare } = useCompare();
  const active = isInCompare(propertyId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!active && isCompareFull) {
          toast({ description: `You can compare up to ${maxCompare} properties at a time.`, variant: "destructive" });
          return;
        }
        toggleCompare(propertyId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      className={cn(
        "flex h-11 w-11 items-center justify-center bg-white/90 text-navy-800 shadow-card transition-colors hover:text-accent-strong",
        active && "text-accent-strong",
        className,
      )}
    >
      <Scale className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
