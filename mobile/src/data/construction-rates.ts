// PLACEHOLDER / INDICATIVE — editable mock construction rates, not a formal quotation.
// Figures reflect approximate 2025-era Pakistan construction market rates in PKR
// per square foot. Adjust these constants as real market data becomes available;
// nothing downstream should hard-code a rate outside this file.

/** Grey structure only (foundation, frame, roofing, brickwork) — excludes finishing. */
export const GREY_STRUCTURE_RATE_PER_SQFT: Record<"Standard" | "Premium" | "Luxury", number> = {
  Standard: 3000, // PLACEHOLDER
  Premium: 4200, // PLACEHOLDER
  Luxury: 6000, // PLACEHOLDER
};

/** Turnkey — grey structure plus complete finishing, fixtures and fittings. */
export const TURNKEY_RATE_PER_SQFT: Record<"Standard" | "Premium" | "Luxury", number> = {
  Standard: 5200, // PLACEHOLDER
  Premium: 7400, // PLACEHOLDER
  Luxury: 10500, // PLACEHOLDER
};

/** Indicative cost breakdown shares for a turnkey build. Shares sum to 1. */
export const COST_BREAKDOWN_RATIOS: { label: string; share: number }[] = [
  { label: "Structure (Foundation, Frame, Roofing)", share: 0.38 }, // PLACEHOLDER
  { label: "Finishes (Flooring, Paint, False Ceiling)", share: 0.26 }, // PLACEHOLDER
  { label: "Electrical", share: 0.1 }, // PLACEHOLDER
  { label: "Plumbing", share: 0.09 }, // PLACEHOLDER
  { label: "Fixtures & Fittings (Kitchen, Bath, Doors)", share: 0.17 }, // PLACEHOLDER
];
