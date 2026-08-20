import { formatAreaAuto } from "@/lib/area";
import { cn } from "@/lib/utils";

/**
 * The second application of the survey-line device: on hover, a property
 * card reveals the plot's measured footprint (to scale, a plausible
 * rectangle for the given area) with its dimensions printed on a survey
 * line — literalising "this is a surveyed piece of land."
 */
export function PlotFootprint({ sqft, className }: { sqft: number; className?: string }) {
  // Typical Pakistani residential plots run close to a 1:1.4 depth:frontage
  // ratio — used only to *illustrate* proportion, not as a literal survey.
  const frontage = Math.sqrt(sqft / 1.4);
  const depth = sqft / frontage;
  const frontageFt = Math.round(frontage);
  const depthFt = Math.round(depth);
  const w = 120;
  const h = w * (depth / frontage);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)} aria-hidden="true">
      <svg viewBox={`0 0 ${w + 40} ${h + 40}`} className="h-24 w-auto max-w-full" style={{ maxHeight: h + 40 }}>
        <rect
          x={20}
          y={20}
          width={w}
          height={h}
          fill="none"
          stroke="var(--survey-line-color-inverted)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <line x1={20} y1={16} x2={20 + w} y2={16} stroke="var(--survey-line-color-inverted)" strokeWidth="1" />
        <line x1={16} y1={20} x2={16} y2={20 + h} stroke="var(--survey-line-color-inverted)" strokeWidth="1" />
      </svg>
      <p className="font-tabular-nums text-label uppercase tracking-widest text-iris-300">
        {frontageFt}&apos; × {depthFt}&apos; · {formatAreaAuto(sqft)}
      </p>
    </div>
  );
}
