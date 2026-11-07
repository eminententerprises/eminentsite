import type { CityKey, Coordinates } from "./location";
import type { PropertyType } from "./property";

export interface PricePoint {
  quarter: string; // "2024 Q1"
  avgPricePerMarla: number;
}

export interface AreaGuide {
  slug: string;
  name: string;
  city: CityKey;
  cityLabel: string;
  coords: Coordinates;
  summary: string;
  heroImage: string;
  priceTrend: PricePoint[];
  avgPriceByType: { type: PropertyType; pricePerMarla: number }[];
  amenities: string[];
  landmarks: { name: string; distanceKm: number }[];
  pros: string[];
  cons: string[];
}
