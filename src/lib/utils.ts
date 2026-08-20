import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge ships no knowledge of this project's custom @theme scale
 * (src/app/globals.css), so by default it lumps custom "text-{size}" and
 * "text-{color}" utilities into the same fallback conflict group and
 * silently drops one when both appear in a `cn(...)` call — e.g.
 * `cn("text-display-sm", "text-navy-800")` would keep only the color.
 * Registering the real scale here keeps size and color independent.
 */
const FONT_SIZE_SCALE = [
  "display-2xl",
  "display-xl",
  "display-lg",
  "display-md",
  "display-sm",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "label",
];

const COLOR_SCALE = [
  "accent",
  "accent-soft",
  "accent-strong",
  "border-accent",
  "border-hairline",
  "border-inverted",
  "border-strong",
  "charcoal-50",
  "charcoal-100",
  "charcoal-200",
  "charcoal-300",
  "charcoal-400",
  "charcoal-500",
  "charcoal-600",
  "charcoal-700",
  "charcoal-800",
  "charcoal-900",
  "cream-50",
  "cream-100",
  "cream-200",
  "cream-300",
  "cream-400",
  "cream-500",
  "cream-600",
  "danger",
  "gold-50",
  "gold-100",
  "gold-200",
  "gold-300",
  "gold-400",
  "gold-500",
  "gold-600",
  "gold-700",
  "gold-800",
  "info",
  "ink-inverted",
  "ink-inverted-muted",
  "ink-muted",
  "ink-on-accent",
  "ink-primary",
  "ink-secondary",
  "iris-50",
  "iris-100",
  "iris-200",
  "iris-300",
  "iris-400",
  "iris-500",
  "iris-600",
  "iris-700",
  "iris-800",
  "nav-ink",
  "nav-surface",
  "navy-50",
  "navy-100",
  "navy-200",
  "navy-300",
  "navy-400",
  "navy-500",
  "navy-600",
  "navy-700",
  "navy-800",
  "navy-900",
  "paper",
  "sky-300",
  "sky-500",
  "sky-700",
  "success",
  "surface-base",
  "surface-inverted",
  "surface-inverted-deep",
  "surface-raised",
  "surface-sunken",
  "surface-warm",
  "warning",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZE_SCALE }],
      "text-color": [{ text: COLOR_SCALE }],
      "bg-color": [{ bg: COLOR_SCALE }],
      "border-color": [{ border: COLOR_SCALE }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
