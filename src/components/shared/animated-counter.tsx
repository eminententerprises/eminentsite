"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Counts up to the numeric prefix of `value` (e.g. "800+" -> animates 0..800,
 * keeps the "+" suffix) once scrolled into view. Falls back to rendering the
 * raw string immediately if it has no leading number, or motion is reduced.
 */
export function AnimatedCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Vertical-only margin ("-80px 0px", not "-80px"): a single value shrinks
  // the intersection root on all four sides, so content within 80px of the
  // left/right viewport edge (the norm on mobile) would never intersect and
  // this counter would be stuck at 0 forever.
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduceMotion = useReducedMotion();
  const match = value.match(/^([\d,]+)(.*)$/);
  const numeric = match ? Number(match[1].replace(/,/g, "")) : null;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(numeric === null || reduceMotion ? value : `0${suffix}`);

  useEffect(() => {
    if (!isInView || numeric === null || reduceMotion) return;
    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v).toLocaleString()}${suffix}`),
    });
    return () => controls.stop();
  }, [isInView, numeric, reduceMotion, suffix]);

  return (
    <span ref={ref} className={cn("font-tabular-nums", className)}>
      {display}
    </span>
  );
}
