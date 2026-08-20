"use client";

import { Heart } from "lucide-react";
import { useShortlist } from "@/hooks/use-shortlist";
import { cn } from "@/lib/utils";

export function ShortlistButton({
  propertyId,
  className,
  variant = "icon",
}: {
  propertyId: string;
  className?: string;
  variant?: "icon" | "labelled";
}) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const active = isShortlisted(propertyId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleShortlist(propertyId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from shortlist" : "Add to shortlist"}
      className={cn(
        "flex items-center gap-1.5 transition-colors",
        variant === "icon"
          ? "h-11 w-11 items-center justify-center bg-white/90 text-navy-800 shadow-card hover:text-accent-strong"
          : "text-body-sm font-semibold uppercase tracking-wide text-ink-secondary hover:text-accent-strong",
        className,
      )}
    >
      <Heart className={cn("h-5 w-5", active && "fill-accent-strong text-accent-strong")} aria-hidden="true" />
      {variant === "labelled" && <span>{active ? "Shortlisted" : "Shortlist"}</span>}
    </button>
  );
}
