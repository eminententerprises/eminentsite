"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Accessible name for the (single) thumb — required unless `thumbLabels` or `aria-labelledby` is provided. */
  "aria-label"?: string;
  /** Per-thumb accessible names, for multi-thumb (range) sliders. */
  thumbLabels?: string[];
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbLabels, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }, ref) => {
    const values = props.value ?? props.defaultValue ?? [0];
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden bg-border-hairline">
          <SliderPrimitive.Range className="absolute h-full bg-accent-strong" />
        </SliderPrimitive.Track>
        {values.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={thumbLabels?.[i] ?? (values.length === 1 ? ariaLabel : `${ariaLabel ?? "Value"} ${i + 1}`)}
            aria-labelledby={ariaLabelledBy}
            className="block h-5 w-5 shrink-0 border-2 border-navy-800 bg-white shadow-card transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
