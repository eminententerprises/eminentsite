// PLACEHOLDER / INDICATIVE — editable thumb-rule quantities and mock PKR unit
// rates, not a formal Bill of Quantities. Physical quantity constants are
// standard civil-estimation planning figures (see comments); adjust PKR unit
// rates as real market prices change. Nothing downstream should hard-code a
// rate or quantity constant outside this file.

/** Standard Pakistani brick nominal size, inches (l x w x h). */
export const BRICK_NOMINAL_SIZE_IN = { length: 9, width: 4.5, height: 3 } as const;
/** Standard mortar joint thickness, inches. */
export const MORTAR_JOINT_IN = 0.5;

/**
 * Bricks per cubic foot of finished brickwork (brick + surrounding mortar
 * envelope). 1728 cu.in per cft, divided by the brick's "with mortar"
 * envelope volume: (9.5 x 5 x 3.5)in = 166.25 cu.in -> ~10.4 bricks/cft.
 * Used for the boundary-wall calculator, which works from exact wall
 * dimensions rather than a floor-area thumb rule.
 */
export const BRICKS_PER_CFT =
  1728 /
  ((BRICK_NOMINAL_SIZE_IN.length + MORTAR_JOINT_IN) *
    (BRICK_NOMINAL_SIZE_IN.width + MORTAR_JOINT_IN) *
    (BRICK_NOMINAL_SIZE_IN.height + MORTAR_JOINT_IN));

/** Applied to every physical quantity below to allow for cutting/handling loss. */
export const WASTAGE_FACTOR = 1.05; // PLACEHOLDER — 5%

/**
 * Bricks per sq ft of total covered/built-up area, all floors combined.
 * Industry planning thumb rule (~8,000-10,000 bricks per 1,000 sq ft for a
 * standard house); RCC-framed structures use thinner, less extensive brick
 * infill than load-bearing structures where the brick walls carry the load.
 */
export const BRICKS_PER_SQFT_COVERED: Record<"Load Bearing" | "RCC Framed", number> = {
  "Load Bearing": 8.5, // PLACEHOLDER
  "RCC Framed": 6.5, // PLACEHOLDER
};

/** Cement, 50kg bags per sq ft of covered area. Grey structure only; Turnkey adds plaster + flooring. */
export const CEMENT_BAGS_PER_SQFT = {
  greyStructure: 0.28, // PLACEHOLDER — concrete, brickwork mortar
  turnkeyAddOn: 0.2, // PLACEHOLDER — plaster, flooring, finishing
} as const;

/** Sand, cft per sq ft of covered area. */
export const SAND_CFT_PER_SQFT = {
  greyStructure: 1.4, // PLACEHOLDER
  turnkeyAddOn: 0.3, // PLACEHOLDER — plaster sand
} as const;

/** Crush / coarse aggregate, cft per sq ft of covered area (structural concrete only). */
export const AGGREGATE_CFT_PER_SQFT = 1.7; // PLACEHOLDER

/** Steel reinforcement, kg per sq ft of covered area. */
export const STEEL_KG_PER_SQFT: Record<"Load Bearing" | "RCC Framed", number> = {
  "Load Bearing": 3.0, // PLACEHOLDER — slab + lintel bands only
  "RCC Framed": 4.6, // PLACEHOLDER — full column/beam/slab frame
};

/** Turnkey finishing: paintable surface area as a multiple of covered area (walls + ceiling). */
export const PAINT_AREA_MULTIPLIER = 3.0; // PLACEHOLDER
/** Paint coverage, sq ft covered per litre for two coats. */
export const PAINT_COVERAGE_SQFT_PER_LITRE = 60; // PLACEHOLDER

/** Turnkey finishing: floor tile area as a share of covered area (excludes wall footprint). */
export const TILE_AREA_SHARE_OF_COVERED = 0.85; // PLACEHOLDER
/** Standard floor tile size, sq ft per tile (2ft x 2ft). */
export const TILE_SQFT_PER_PIECE = 4;

// ---------------------------------------------------------------- PKR RATES

export const MATERIAL_UNIT_RATE_PKR = {
  brick: 16, // PLACEHOLDER — per piece
  cementBag: 1900, // PLACEHOLDER — per 50kg bag
  sandCft: 110, // PLACEHOLDER — per cft
  aggregateCft: 140, // PLACEHOLDER — per cft
  steelKg: 290, // PLACEHOLDER — per kg, grade 60
  paintLitre: 950, // PLACEHOLDER — per litre, weathershield-grade
  tilePiece: 320, // PLACEHOLDER — per 2x2ft piece, mid-range
} as const;

/** Cement mortar mix ratio for brickwork (1 part cement : N parts sand, by volume). */
export const BRICKWORK_MORTAR_RATIO = { cement: 1, sand: 6 } as const;
/** Mortar volume as a share of total brick-wall volume (rest is brick solids). */
export const MORTAR_SHARE_OF_WALL_VOLUME = 0.3; // PLACEHOLDER
/** One 50kg cement bag, cubic feet. */
export const CEMENT_BAG_CFT = 1.25;
