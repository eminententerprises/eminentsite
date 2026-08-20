"use client";

import { useId, useState } from "react";
import type { ConstructionProject, PropertyImage as PropertyImageType } from "@/types";
import { PropertyImage } from "@/components/media/property-image";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  /** Convenience: pass a whole case study to use its first before/after pair. */
  project?: ConstructionProject;
  beforeImage?: PropertyImageType;
  afterImage?: PropertyImageType;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * Interactive before/after comparison. A native range input is overlaid on
 * top of the stacked images — it has no visible track of its own, but its
 * value drives a clip-path on the "after" layer, and its thumb doubles as
 * the visible drag handle. Native range semantics give this keyboard
 * operability (arrow keys) and touch support for free.
 */
export function BeforeAfterSlider({
  project,
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const sliderId = useId();

  const before = beforeImage ?? project?.beforeImages[0];
  const after = afterImage ?? project?.afterImages[0];

  if (!before || !after) return null;

  return (
    <div className={cn("relative w-full select-none", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border-hairline bg-surface-sunken sm:aspect-[16/10]">
        <div className="absolute inset-0">
          <PropertyImage src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        </div>

        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <PropertyImage src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[var(--survey-line-color)]"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          aria-hidden="true"
        />

        <span className="pointer-events-none absolute left-3 top-3 z-10 bg-navy-900/80 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-white">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-10 bg-navy-900/80 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-white">
          {afterLabel}
        </span>

        <label htmlFor={sliderId} className="sr-only">
          Comparison slider
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Comparison slider"
          className={cn(
            "absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent",
            "[&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-transparent",
            "[&::-moz-range-track]:h-full [&::-moz-range-track]:bg-transparent",
            "[&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-accent-strong [&::-webkit-slider-thumb]:shadow-[var(--shadow-raised)]",
            "[&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent-strong",
          )}
        />
      </div>
    </div>
  );
}
