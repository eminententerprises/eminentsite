import { cn } from "@/lib/utils";

/**
 * Infinite horizontal scroll strip. Renders `items` twice back-to-back and
 * animates a translateX(-50%) loop, so the seam is invisible. Pauses on
 * hover/focus; the global prefers-reduced-motion rule in globals.css freezes
 * the CSS animation entirely.
 */
export function Marquee({ items, className, inverted = false }: { items: string[]; className?: string; inverted?: boolean }) {
  const track = [...items, ...items];
  return (
    <div
      className={cn("group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <span
            key={i}
            className={cn(
              "whitespace-nowrap text-label font-semibold uppercase tracking-[0.2em]",
              inverted ? "text-ink-inverted-muted" : "text-ink-muted",
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
