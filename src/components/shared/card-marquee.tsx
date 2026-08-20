import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite auto-scrolling strip for card content — same translateX(-50%)
 * loop technique as marquee.tsx, generalized to arbitrary React nodes
 * (property/project cards) instead of text. Renders children twice
 * back-to-back so the loop seam is invisible; pauses on hover/focus so
 * users can still interact with a card. Reuses the `animate-marquee`
 * keyframe from globals.css (already covered by the site's global
 * prefers-reduced-motion override) and only overrides its duration.
 */
export function CardMarquee({
  children,
  className,
  itemClassName,
  durationSeconds = 45,
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  durationSeconds?: number;
}) {
  const items = Children.toArray(children);
  const track = [...items, ...items];

  return (
    <div className={cn("group overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {track.map((child, i) => (
          <div key={i} className={itemClassName} aria-hidden={i >= items.length}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
