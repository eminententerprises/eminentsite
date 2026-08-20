/**
 * Eminent Estimate — a deliberately simple, rule-based property valuation
 * model built entirely from mock data (`LOCATIONS`, `AREA_GUIDES`). It is
 * NOT a market appraisal: it exists to give a visitor an indicative starting
 * range, clearly labelled as such wherever it's rendered. See the disclaimer
 * copy on `/tools/eminent-estimate` for the exact caveat shown to users.
 */

import type { PropertyType, ValuationInput, ValuationResult } from "@/types";
import { LOCATIONS, getLocationBySlug } from "@/data/locations";
import { getAreaGuideBySlug } from "@/lib/repositories/area-repository";
import { fromSqFt, toSqFt } from "@/lib/area";

/**
 * Condition adjustment applied to the base mid estimate. "Good" is the
 * neutral baseline — most listed properties are in reasonable, lived-in
 * condition, so it carries no adjustment.
 */
const CONDITION_ADJUSTMENT: Record<ValuationInput["condition"], number> = {
  New: 0.08,
  Good: 0,
  "Needs Renovation": -0.12,
};

/**
 * Age-based depreciation applies only to built structures — plots and
 * agricultural land don't physically age the way a covered structure does,
 * and in practice bare land in Pakistan tends to appreciate with time
 * rather than depreciate, so it's excluded entirely here.
 */
const DEPRECIATING_TYPES = new Set<PropertyType>([
  "House",
  "Farm House",
  "Upper Portion",
  "Lower Portion",
  "Flat/Apartment",
]);
const DEPRECIATION_PER_YEAR = 0.005; // 0.5% per year of age
const DEPRECIATION_CAP = 0.15; // capped at 15% total, however old the property

/** Each selected feature (corner plot, boulevard facing, etc.) nudges the estimate up a little. */
const FEATURE_BONUS_PER_ITEM = 0.015; // +1.5% per selected feature
const FEATURE_BONUS_CAP = 0.06; // capped at +6% regardless of how many are selected

/** Spread applied around the adjusted mid to produce the displayed low–high range. */
const RANGE_SPREAD = 0.1; // ±10%

export function estimateValuation(input: ValuationInput): ValuationResult {
  const directLocation = getLocationBySlug(input.city);
  const areaGuide = getAreaGuideBySlug(input.city);

  // Fallback: the area slug didn't resolve to a known location, so fall
  // back to a citywide/overall average across all mock locations and flag
  // the result as low confidence rather than failing outright.
  const basePricePerMarla = directLocation?.basePricePerMarla ?? averageBasePricePerMarla();

  const confidence: ValuationResult["confidence"] = areaGuide ? "High" : directLocation ? "Medium" : "Low";

  const areaSqft = toSqFt(input.areaValue, input.areaUnit);
  const marlaEquivalent = fromSqFt(areaSqft, "marla");

  let mid = basePricePerMarla * marlaEquivalent;

  mid *= 1 + CONDITION_ADJUSTMENT[input.condition];

  if (DEPRECIATING_TYPES.has(input.propertyType)) {
    const ageYears = Math.max(input.ageYears, 0);
    const depreciation = Math.min(ageYears * DEPRECIATION_PER_YEAR, DEPRECIATION_CAP);
    mid *= 1 - depreciation;
  }

  const featureBonus = Math.min(input.features.length * FEATURE_BONUS_PER_ITEM, FEATURE_BONUS_CAP);
  mid *= 1 + featureBonus;

  return {
    low: mid * (1 - RANGE_SPREAD),
    mid,
    high: mid * (1 + RANGE_SPREAD),
    confidence,
    pricePerMarlaUsed: basePricePerMarla,
    // The area slug the estimate is anchored to — even in the low-confidence
    // fallback case this is the area the visitor asked about, so comparable
    // listings (if any) still search against it.
    comparableAreaSlug: input.city,
  };
}

function averageBasePricePerMarla(): number {
  const total = LOCATIONS.reduce((sum, l) => sum + l.basePricePerMarla, 0);
  return total / LOCATIONS.length;
}
