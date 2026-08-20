import { cn } from "@/lib/utils";

interface SurveyLineProps {
  /** Optional dimension label printed beneath the line, e.g. "35' × 70'" */
  label?: string;
  inverted?: boolean;
  className?: string;
  /** Number of tick marks along the line. */
  ticks?: number;
}

/**
 * The site's one signature device: a gold hairline with surveyor's tick
 * marks, used as a section divider, a scroll/step indicator, and (on
 * property cards) as the reveal for a plot's measured footprint. Grounded in
 * the domain — plots are surveyed and measured — rather than decorative.
 */
export function SurveyLine({ label, inverted = false, className, ticks = 12 }: SurveyLineProps) {
  const stroke = inverted ? "var(--survey-line-color-inverted)" : "var(--survey-line-color)";
  const textColor = inverted ? "text-iris-300" : "text-accent-strong";

  return (
    <div className={cn("flex w-full flex-col items-stretch gap-1.5", className)} role="presentation">
      <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="h-3 w-full" aria-hidden="true">
        <line x1="0" y1="6" x2="400" y2="6" stroke={stroke} strokeWidth="1.5" />
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const x = (400 / ticks) * i;
          const long = i === 0 || i === ticks;
          return (
            <line
              key={i}
              x1={x}
              y1={long ? 0 : 3}
              x2={x}
              y2={long ? 12 : 9}
              stroke={stroke}
              strokeWidth={long ? 1.5 : 1}
            />
          );
        })}
      </svg>
      {label && (
        <span className={cn("font-tabular-nums text-label uppercase tracking-widest", textColor)}>{label}</span>
      )}
    </div>
  );
}

/** Vertical variant — used inside side rails / step indicators. */
export function SurveyLineVertical({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const stroke = inverted ? "var(--survey-line-color-inverted)" : "var(--survey-line-color)";
  return (
    <svg viewBox="0 0 12 200" preserveAspectRatio="none" className={cn("h-full w-3", className)} aria-hidden="true">
      <line x1="6" y1="0" x2="6" y2="200" stroke={stroke} strokeWidth="1.5" />
      {Array.from({ length: 11 }).map((_, i) => {
        const y = 20 * i;
        const long = i === 0 || i === 10;
        return (
          <line
            key={i}
            x1={long ? 0 : 3}
            y1={y}
            x2={long ? 12 : 9}
            y2={y}
            stroke={stroke}
            strokeWidth={long ? 1.5 : 1}
          />
        );
      })}
    </svg>
  );
}
