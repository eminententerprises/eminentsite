/**
 * Indicative area-pricing helpers for the homepage price-by-area map.
 * `LOCATIONS[].basePricePerMarla` is already illustrative mock data (see
 * src/data/locations.ts); this module derives a matching illustrative rent
 * figure and buckets both into display tiers. None of this is sourced
 * market data — it must stay in "indicative" register in copy, same as
 * TRUST_STATS and the rest of the site's placeholder figures.
 */

/** Assumed gross annual rental yield used only to derive an indicative rent-per-marla from the buy price. */
const ASSUMED_ANNUAL_RENTAL_YIELD = 0.05;

export function estimateMonthlyRentPerMarla(basePricePerMarla: number): number {
  return Math.round((basePricePerMarla * ASSUMED_ANNUAL_RENTAL_YIELD) / 12 / 100) * 100;
}

export interface PriceTier {
  label: string;
  max: number; // exclusive upper bound; Infinity for the top tier
  color: string;
}

/**
 * Buy tiers, PKR per marla. Colors step through the navy scale — light
 * (affordable) to dark (premium). Hardcoded hex (matching --navy-200/400/600/900
 * in globals.css) rather than var() references, since these values feed
 * Leaflet's SVG/canvas renderer directly and shouldn't depend on runtime
 * CSS custom-property resolution in that context.
 */
export const BUY_PRICE_TIERS: PriceTier[] = [
  { label: "Under 30 Lakh", max: 3_000_000, color: "#b4c4df" },
  { label: "30 Lakh – 60 Lakh", max: 6_000_000, color: "#5c78a5" },
  { label: "60 Lakh – 1.2 Crore", max: 12_000_000, color: "#253c60" },
  { label: "1.2 Crore+", max: Infinity, color: "#101c3d" },
];

/** Rent tiers derived from the buy tiers via the same assumed yield, so the two scales stay proportional. */
export const RENT_PRICE_TIERS: PriceTier[] = BUY_PRICE_TIERS.map((tier, i) => {
  if (tier.max === Infinity) {
    const floor = Math.round(estimateMonthlyRentPerMarla(BUY_PRICE_TIERS[i - 1].max) / 1000);
    return { label: `${floor}k/mo+`, max: Infinity, color: tier.color };
  }
  const ceiling = Math.round(estimateMonthlyRentPerMarla(tier.max) / 1000);
  return { label: `Under ${ceiling}k/mo`, max: estimateMonthlyRentPerMarla(tier.max), color: tier.color };
});

export function tierFor(value: number, tiers: PriceTier[]): PriceTier {
  return tiers.find((t) => value < t.max) ?? tiers[tiers.length - 1];
}
