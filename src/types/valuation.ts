import type { AreaUnit, PropertyType } from "./property";

export interface ValuationInput {
  city: string; // area slug
  propertyType: PropertyType;
  areaValue: number;
  areaUnit: AreaUnit;
  ageYears: number;
  condition: "New" | "Good" | "Needs Renovation";
  features: string[];
}

export interface ValuationResult {
  low: number;
  mid: number;
  high: number;
  confidence: "Low" | "Medium" | "High";
  pricePerMarlaUsed: number;
  comparableAreaSlug: string;
}

export interface ConstructionEstimateInput {
  coveredAreaSqft: number;
  storeys: number;
  qualityTier: "Standard" | "Premium" | "Luxury";
  scope: "Grey Structure" | "Turnkey";
}

export interface ConstructionEstimateLine {
  label: string;
  amount: number;
}

export interface ConstructionEstimateResult {
  lines: ConstructionEstimateLine[];
  total: number;
  ratePerSqft: number;
}

export interface MortgageInput {
  propertyPrice: number;
  downPaymentPercent: number;
  tenureYears: number;
  markupRatePercent: number;
}

export interface AmortisationRow {
  month: number;
  payment: number;
  principal: number;
  markup: number;
  balance: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyInstalment: number;
  totalMarkup: number;
  totalPaid: number;
  schedule: AmortisationRow[];
}
