export type CityKey = "islamabad" | "rawalpindi" | "hills";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Sector {
  slug: string;
  name: string;
}

export interface AreaLocation {
  city: CityKey;
  cityLabel: string;
  /** e.g. "DHA Phase II", "Bahria Town Rawalpindi", "Murree" */
  area: string;
  areaSlug: string;
  /** optional finer sector, e.g. "F-10/1" */
  sector?: string;
  coords: Coordinates;
}
