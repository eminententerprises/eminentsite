import type { PropertyImage } from "./property";

export type ConstructionServiceSlug =
  | "new-construction"
  | "renovation"
  | "interior-exterior"
  | "consultation"
  | "oversight-supervision";

export interface ConstructionProject {
  id: string;
  slug: string;
  title: string;
  serviceType: ConstructionServiceSlug;
  location: string; // free-text area, e.g. "DHA Phase II, Islamabad"
  coveredAreaSqft: number;
  storeys: number;
  qualityTier: "Standard" | "Premium" | "Luxury";
  durationMonths: number;
  year: number;
  summary: string;
  beforeImages: PropertyImage[];
  afterImages: PropertyImage[];
  specSheet: { label: string; value: string }[];
  timeline: { phase: string; complete: boolean }[];
  isFeatured: boolean;
}
