import {
  AGGREGATE_CFT_PER_SQFT,
  BRICKS_PER_CFT,
  BRICKS_PER_SQFT_COVERED,
  BRICKWORK_MORTAR_RATIO,
  CEMENT_BAG_CFT,
  CEMENT_BAGS_PER_SQFT,
  MATERIAL_UNIT_RATE_PKR,
  MORTAR_SHARE_OF_WALL_VOLUME,
  PAINT_AREA_MULTIPLIER,
  PAINT_COVERAGE_SQFT_PER_LITRE,
  SAND_CFT_PER_SQFT,
  STEEL_KG_PER_SQFT,
  TILE_AREA_SHARE_OF_COVERED,
  TILE_SQFT_PER_PIECE,
  WASTAGE_FACTOR,
} from "@/data/material-rates";
import type { MaterialEstimateInput, MaterialEstimateResult, MaterialQuantityLine } from "@/types";

/**
 * PLACEHOLDER / INDICATIVE calculation — see src/data/material-rates.ts for
 * the thumb-rule quantity constants, their source and caveat. Always surface
 * that caveat next to any figure this produces; this is a planning-stage
 * estimate, not a Bill of Quantities.
 */
export function estimateMaterials(input: MaterialEstimateInput): MaterialEstimateResult {
  const isTurnkey = input.scope === "Turnkey";

  // ---------------------------------------------------------- STRUCTURE
  const bricks =
    input.coveredAreaSqft * BRICKS_PER_SQFT_COVERED[input.structureType] * WASTAGE_FACTOR;

  const cementBagsPerSqft = CEMENT_BAGS_PER_SQFT.greyStructure + (isTurnkey ? CEMENT_BAGS_PER_SQFT.turnkeyAddOn : 0);
  const cementBags = input.coveredAreaSqft * cementBagsPerSqft * WASTAGE_FACTOR;

  const sandCftPerSqft = SAND_CFT_PER_SQFT.greyStructure + (isTurnkey ? SAND_CFT_PER_SQFT.turnkeyAddOn : 0);
  const sandCft = input.coveredAreaSqft * sandCftPerSqft * WASTAGE_FACTOR;

  const aggregateCft = input.coveredAreaSqft * AGGREGATE_CFT_PER_SQFT * WASTAGE_FACTOR;

  const steelKg = input.coveredAreaSqft * STEEL_KG_PER_SQFT[input.structureType] * WASTAGE_FACTOR;

  const structure: MaterialQuantityLine[] = [
    countLine("bricks", "Bricks", bricks, "pcs", MATERIAL_UNIT_RATE_PKR.brick),
    countLine("cement", "Cement", cementBags, "bags (50kg)", MATERIAL_UNIT_RATE_PKR.cementBag),
    line("sand", "Sand", sandCft, "cft", MATERIAL_UNIT_RATE_PKR.sandCft),
    line("aggregate", "Crush / Aggregate", aggregateCft, "cft", MATERIAL_UNIT_RATE_PKR.aggregateCft),
    line("steel", "Steel Reinforcement", steelKg, "kg", MATERIAL_UNIT_RATE_PKR.steelKg, `${(Math.round(steelKg) / 1000).toFixed(2)} tons`),
  ];

  // ------------------------------------------------------ BOUNDARY WALL
  const boundaryWall: MaterialQuantityLine[] = [];
  if (input.includeBoundaryWall && input.boundaryWallLengthFt > 0 && input.boundaryWallHeightFt > 0) {
    const thicknessFt = input.boundaryWallThicknessIn / 12;
    const wallVolumeCft = input.boundaryWallLengthFt * input.boundaryWallHeightFt * thicknessFt;

    const wallBricks = wallVolumeCft * BRICKS_PER_CFT * WASTAGE_FACTOR;

    const mortarVolumeCft = wallVolumeCft * MORTAR_SHARE_OF_WALL_VOLUME;
    const mortarParts = BRICKWORK_MORTAR_RATIO.cement + BRICKWORK_MORTAR_RATIO.sand;
    const wallCementCft = mortarVolumeCft * (BRICKWORK_MORTAR_RATIO.cement / mortarParts);
    const wallCementBags = (wallCementCft / CEMENT_BAG_CFT) * WASTAGE_FACTOR;
    const wallSandCft = mortarVolumeCft * (BRICKWORK_MORTAR_RATIO.sand / mortarParts) * WASTAGE_FACTOR;

    boundaryWall.push(
      countLine("boundary-bricks", "Bricks", wallBricks, "pcs", MATERIAL_UNIT_RATE_PKR.brick),
      countLine("boundary-cement", "Cement", wallCementBags, "bags (50kg)", MATERIAL_UNIT_RATE_PKR.cementBag),
      line("boundary-sand", "Sand", wallSandCft, "cft", MATERIAL_UNIT_RATE_PKR.sandCft),
    );
  }

  // --------------------------------------------------------- FINISHING
  const finishing: MaterialQuantityLine[] = [];
  if (isTurnkey) {
    const paintableSqft = input.coveredAreaSqft * PAINT_AREA_MULTIPLIER;
    const paintLitres = (paintableSqft / PAINT_COVERAGE_SQFT_PER_LITRE) * WASTAGE_FACTOR;

    const tileSqft = input.coveredAreaSqft * TILE_AREA_SHARE_OF_COVERED;
    const tilePieces = (tileSqft / TILE_SQFT_PER_PIECE) * WASTAGE_FACTOR;

    finishing.push(
      line("paint", "Paint", paintLitres, "litres", MATERIAL_UNIT_RATE_PKR.paintLitre),
      countLine("tiles", "Floor Tiles (2x2 ft)", tilePieces, "pcs", MATERIAL_UNIT_RATE_PKR.tilePiece, `${Math.round(tileSqft).toLocaleString("en-PK")} sq ft`),
    );
  }

  const totalMaterialCost = [...structure, ...boundaryWall, ...finishing].reduce(
    (sum, l) => sum + l.estimatedCost,
    0,
  );

  return { structure, boundaryWall, finishing, totalMaterialCost };
}

/** Continuous quantities (cft, kg, litres) — rounded to the nearest whole unit. */
function line(key: string, label: string, quantity: number, unit: string, unitRatePkr: number, altQuantity?: string): MaterialQuantityLine {
  return buildLine(key, label, Math.round(quantity), unit, unitRatePkr, altQuantity);
}

/** Discrete, individually-purchased units (bricks, cement bags, tiles) — rounded up, since you can't buy a fraction of one. */
function countLine(key: string, label: string, quantity: number, unit: string, unitRatePkr: number, altQuantity?: string): MaterialQuantityLine {
  return buildLine(key, label, Math.ceil(quantity), unit, unitRatePkr, altQuantity);
}

function buildLine(key: string, label: string, quantity: number, unit: string, unitRatePkr: number, altQuantity?: string): MaterialQuantityLine {
  return {
    key,
    label,
    quantity,
    unit,
    altQuantity,
    estimatedCost: Math.round(quantity * unitRatePkr),
  };
}
