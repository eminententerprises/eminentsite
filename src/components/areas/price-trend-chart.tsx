import type { PricePoint } from "@/types";
import { formatPKR } from "@/lib/format-pkr";

/**
 * Hand-rolled SVG line chart for an area guide's quarterly price trend — no
 * charting library. Values are plotted as a polyline against a normalized
 * range, with axis labels and value markers.
 */
export function PriceTrendChart({ points }: { points: PricePoint[] }) {
  if (points.length === 0) return null;

  const width = 640;
  const height = 220;
  const paddingX = 8;
  const paddingTop = 16;
  const paddingBottom = 32;

  const values = points.map((p) => p.avgPricePerMarla);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingTop - paddingBottom;

  const coords = points.map((p, i) => {
    const x = paddingX + (usableWidth / (points.length - 1 || 1)) * i;
    const y = paddingTop + usableHeight - ((p.avgPricePerMarla - min) / range) * usableHeight;
    return { x, y, point: p };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const changePct = first.avgPricePerMarla > 0 ? ((last.avgPricePerMarla - first.avgPricePerMarla) / first.avgPricePerMarla) * 100 : 0;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-body-sm text-ink-secondary">Avg. price per Marla, last {points.length} quarters</p>
        <p className={`font-tabular-nums text-body-sm font-semibold ${changePct >= 0 ? "text-success" : "text-danger"}`}>
          {changePct >= 0 ? "+" : ""}
          {changePct.toFixed(1)}% over period
        </p>
      </div>
      <div className="mt-3 w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full min-w-[480px]" role="img" aria-label="Quarterly average price per Marla trend line">
          {/* baseline */}
          <line x1={paddingX} y1={paddingTop + usableHeight} x2={width - paddingX} y2={paddingTop + usableHeight} stroke="var(--color-border-hairline)" strokeWidth={1} />

          <polyline points={polylinePoints} fill="none" stroke="var(--color-accent-strong)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {coords.map((c, i) => (
            <circle key={points[i].quarter} cx={c.x} cy={c.y} r={3.5} fill="var(--color-accent-strong)" />
          ))}

          {coords.map(
            (c, i) =>
              (i === 0 || i === coords.length - 1 || i === Math.floor(coords.length / 2)) && (
                <text key={`label-${points[i].quarter}`} x={c.x} y={height - 10} textAnchor={i === 0 ? "start" : i === coords.length - 1 ? "end" : "middle"} className="fill-[var(--color-ink-muted)] font-tabular-nums" fontSize={11}>
                  {points[i].quarter}
                </text>
              ),
          )}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-body-sm text-ink-muted">
        <span className="font-tabular-nums">{formatPKR(min).short}</span>
        <span className="font-tabular-nums">{formatPKR(max).short}</span>
      </div>
    </div>
  );
}
