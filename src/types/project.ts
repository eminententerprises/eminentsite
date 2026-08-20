import type { AreaLocation } from "./location";
import type { PropertyImage, ApprovalStatus, PossessionStatus } from "./property";

export interface UnitType {
  name: string; // e.g. "3 Bed Apartment"
  areaSqft: number;
  startingPrice: number;
}

export interface PaymentMilestone {
  label: string; // "Down Payment", "On Booking Confirmation", "Monthly Instalment x 36", ...
  percentage: number;
  amountNote?: string;
}

export interface ProgressMilestone {
  label: string;
  date: string; // ISO date, past = complete, future = planned
  complete: boolean;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  developer: string;
  tagline: string;
  description: string;
  location: AreaLocation;
  approval: ApprovalStatus;
  possession: PossessionStatus;
  unitTypes: UnitType[];
  paymentPlan: PaymentMilestone[];
  progress: ProgressMilestone[];
  amenities: string[];
  locationAdvantages: string[];
  images: PropertyImage[];
  brochureAvailable: boolean;
  isFeatured: boolean;
  addedAt: string;
}
