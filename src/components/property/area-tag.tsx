import { formatAreaAuto, formatArea, fromSqFt, type AreaUnit } from "@/lib/area";
import { cn } from "@/lib/utils";

export function AreaTag({
  sqft,
  unit,
  className,
}: {
  sqft: number;
  unit?: AreaUnit;
  className?: string;
}) {
  return (
    <span className={cn("font-tabular-nums text-body-sm text-ink-secondary", className)}>
      {unit ? formatArea(fromSqFt(sqft, unit), unit) : formatAreaAuto(sqft)}
    </span>
  );
}
