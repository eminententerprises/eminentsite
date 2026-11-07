export type StructureType = "Load Bearing" | "RCC Framed";
export type MaterialScope = "Grey Structure" | "Turnkey";
export type BoundaryWallThickness = 4.5 | 9;

export interface MaterialEstimateInput {
  coveredAreaSqft: number;
  storeys: number;
  structureType: StructureType;
  scope: MaterialScope;
  qualityTier: "Standard" | "Premium" | "Luxury";
  includeBoundaryWall: boolean;
  boundaryWallLengthFt: number;
  boundaryWallHeightFt: number;
  boundaryWallThicknessIn: BoundaryWallThickness;
}

export interface MaterialQuantityLine {
  key: string;
  label: string;
  quantity: number;
  unit: string;
  /** Secondary human-readable quantity, e.g. tons alongside kg. */
  altQuantity?: string;
  estimatedCost: number;
}

export interface MaterialEstimateResult {
  structure: MaterialQuantityLine[];
  boundaryWall: MaterialQuantityLine[];
  finishing: MaterialQuantityLine[];
  totalMaterialCost: number;
}
