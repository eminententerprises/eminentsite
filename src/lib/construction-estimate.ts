import { GREY_STRUCTURE_RATE_PER_SQFT, TURNKEY_RATE_PER_SQFT, COST_BREAKDOWN_RATIOS } from "@/data/construction-rates";
import type { ConstructionEstimateInput, ConstructionEstimateResult } from "@/types";

/**
 * PLACEHOLDER / INDICATIVE calculation — see src/data/construction-rates.ts
 * for the rate source and caveat; always surface that caveat next to any
 * figure this produces.
 *
 * Rates are PKR-per-covered-sqft and already represent the full build cost
 * across every floor, so `storeys` is intentionally NOT multiplied into the
 * total — it is carried on the input purely as an informational field (the
 * caller is expected to already have summed covered area across floors into
 * `coveredAreaSqft`).
 */
export function estimateConstructionCost(input: ConstructionEstimateInput): ConstructionEstimateResult {
  const rateTable = input.scope === "Grey Structure" ? GREY_STRUCTURE_RATE_PER_SQFT : TURNKEY_RATE_PER_SQFT;
  const ratePerSqft = rateTable[input.qualityTier];
  const total = ratePerSqft * input.coveredAreaSqft;

  const lines = COST_BREAKDOWN_RATIOS.map((ratio) => ({
    label: ratio.label,
    amount: Math.round(total * ratio.share),
  }));

  return { lines, total: Math.round(total), ratePerSqft };
}
