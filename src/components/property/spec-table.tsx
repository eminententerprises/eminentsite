import type { PakistanFields, Property } from "@/types";
import { formatAreaAuto } from "@/lib/area";

export function SpecTable({ property }: { property: Property }) {
  const p = property.pakistanFields;

  const generalSpecs: [string, string][] = [
    ["Type", property.type],
    ["Area", formatAreaAuto(property.area.sqft)],
    ...(property.beds ? ([["Bedrooms", String(property.beds)]] as [string, string][]) : []),
    ...(property.baths ? ([["Bathrooms", String(property.baths)]] as [string, string][]) : []),
    ...(p.floors ? ([["Floors", String(p.floors)]] as [string, string][]) : []),
    ["Possession", p.possession],
    ["Approval", p.approval],
    ["Plot Documentation", p.plotFileOrRegistry],
    ["Water Source", p.waterSource],
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-2.5 border-t border-border-hairline pt-2.5 sm:grid-cols-2">
      {generalSpecs.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 border-b border-border-hairline pb-2.5">
          <dt className="text-body-sm text-ink-secondary">{label}</dt>
          <dd className="text-body-sm font-semibold text-ink-primary">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const FLAG_LABELS: [keyof PakistanFields, string][] = [
  ["cornerPlot", "Corner Plot"],
  ["boulevardFacing", "Boulevard Facing"],
  ["parkFacing", "Park Facing"],
  ["gasAvailable", "Gas Available"],
  ["electricityAvailable", "Electricity Available"],
  ["sewerage", "Sewerage"],
  ["servantQuarter", "Servant Quarter"],
  ["basement", "Basement"],
];

/**
 * Merges amenities, features and true-only Pakistan-specific flags into one
 * deduplicated highlight list — a listing should advertise what it has, not
 * enumerate what it lacks.
 */
export function getPropertyHighlights(property: Property): string[] {
  const flagLabels = FLAG_LABELS.filter(([key]) => property.pakistanFields[key] === true).map(([, label]) => label);
  return Array.from(new Set([...property.amenities, ...property.features, ...flagLabels]));
}
