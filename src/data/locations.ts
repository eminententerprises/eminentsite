import type { CityKey } from "@/types";

export interface LocationArea {
  slug: string;
  name: string;
  city: CityKey;
  cityLabel: string;
  coords: { lat: number; lng: number };
  /** Rough base price-per-marla in PKR, used to seed realistic mock pricing. */
  basePricePerMarla: number;
}

export const CITY_LABELS: Record<CityKey, string> = {
  islamabad: "Islamabad",
  rawalpindi: "Rawalpindi",
  hills: "Hill Regions",
};

// Coordinates are approximate area centroids for map/demo purposes.
export const LOCATIONS: LocationArea[] = [
  // Islamabad
  { slug: "dha-1", name: "DHA Phase I", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5325, lng: 73.1500 }, basePricePerMarla: 6_500_000 },
  { slug: "dha-2", name: "DHA Phase II", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5215, lng: 73.1400 }, basePricePerMarla: 6_800_000 },
  { slug: "dha-3", name: "DHA Phase III", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5130, lng: 73.1330 }, basePricePerMarla: 7_200_000 },
  { slug: "dha-4", name: "DHA Phase IV", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5040, lng: 73.1250 }, basePricePerMarla: 6_900_000 },
  { slug: "dha-5", name: "DHA Phase V", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.4950, lng: 73.1180 }, basePricePerMarla: 6_400_000 },
  { slug: "bahria-1-8", name: "Bahria Town Phases 1–8", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5330, lng: 73.2480 }, basePricePerMarla: 4_800_000 },
  { slug: "bahria-enclave", name: "Bahria Enclave", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5590, lng: 73.2160 }, basePricePerMarla: 4_500_000 },
  { slug: "gulberg-greens", name: "Gulberg Greens", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6270, lng: 72.9520 }, basePricePerMarla: 3_600_000 },
  { slug: "gulberg-residencia", name: "Gulberg Residencia", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6180, lng: 72.9610 }, basePricePerMarla: 3_200_000 },
  { slug: "b-17", name: "B-17", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6460, lng: 72.9130 }, basePricePerMarla: 2_800_000 },
  { slug: "e-11", name: "E-11", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.7010, lng: 73.0060 }, basePricePerMarla: 9_500_000 },
  { slug: "f-6", name: "F-6", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.7250, lng: 73.0620 }, basePricePerMarla: 14_000_000 },
  { slug: "f-7", name: "F-7", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.7180, lng: 73.0580 }, basePricePerMarla: 15_500_000 },
  { slug: "f-8", name: "F-8", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.7080, lng: 73.0450 }, basePricePerMarla: 13_000_000 },
  { slug: "f-10", name: "F-10", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6960, lng: 73.0180 }, basePricePerMarla: 11_500_000 },
  { slug: "f-11", name: "F-11", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6890, lng: 73.0080 }, basePricePerMarla: 10_800_000 },
  { slug: "g-13", name: "G-13", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6640, lng: 72.9850 }, basePricePerMarla: 3_400_000 },
  { slug: "g-14", name: "G-14", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6570, lng: 72.9700 }, basePricePerMarla: 3_100_000 },
  { slug: "blue-area", name: "Blue Area", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.7101, lng: 73.0672 }, basePricePerMarla: 22_000_000 },
  { slug: "park-view-city", name: "Park View City", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6280, lng: 72.8720 }, basePricePerMarla: 2_600_000 },
  { slug: "capital-smart-city", name: "Capital Smart City", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6890, lng: 72.7580 }, basePricePerMarla: 1_900_000 },
  { slug: "faisal-town", name: "Faisal Town", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.6420, lng: 73.0450 }, basePricePerMarla: 3_800_000 },
  { slug: "top-city", name: "Top City", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5890, lng: 72.8340 }, basePricePerMarla: 2_200_000 },
  { slug: "mumtaz-city", name: "Mumtaz City", city: "islamabad", cityLabel: "Islamabad", coords: { lat: 33.5720, lng: 72.8110 }, basePricePerMarla: 1_600_000 },

  // Rawalpindi
  { slug: "bahria-town-rwp", name: "Bahria Town Rawalpindi", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5140, lng: 73.1980 }, basePricePerMarla: 4_600_000 },
  { slug: "dha-2-rwp", name: "DHA Phase II (Rawalpindi)", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5060, lng: 73.1610 }, basePricePerMarla: 5_200_000 },
  { slug: "adiala-road", name: "Adiala Road", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5420, lng: 73.0710 }, basePricePerMarla: 1_400_000 },
  { slug: "chaklala-scheme-3", name: "Chaklala Scheme III", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5860, lng: 73.0790 }, basePricePerMarla: 4_100_000 },
  { slug: "saddar", name: "Saddar", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5990, lng: 73.0480 }, basePricePerMarla: 5_800_000 },
  { slug: "airport-housing-society", name: "Airport Housing Society", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5590, lng: 73.0910 }, basePricePerMarla: 2_900_000 },
  { slug: "gulraiz", name: "Gulraiz", city: "rawalpindi", cityLabel: "Rawalpindi", coords: { lat: 33.5680, lng: 73.1150 }, basePricePerMarla: 2_400_000 },

  // Hill regions
  { slug: "murree", name: "Murree", city: "hills", cityLabel: "Hill Regions", coords: { lat: 33.9070, lng: 73.3900 }, basePricePerMarla: 3_500_000 },
  { slug: "bhurban", name: "Bhurban", city: "hills", cityLabel: "Hill Regions", coords: { lat: 33.9500, lng: 73.3700 }, basePricePerMarla: 4_200_000 },
  { slug: "patriata", name: "Patriata", city: "hills", cityLabel: "Hill Regions", coords: { lat: 33.8770, lng: 73.4550 }, basePricePerMarla: 2_100_000 },
  { slug: "nathia-gali", name: "Nathia Gali", city: "hills", cityLabel: "Hill Regions", coords: { lat: 34.0670, lng: 73.3830 }, basePricePerMarla: 2_800_000 },
  { slug: "ayubia", name: "Ayubia", city: "hills", cityLabel: "Hill Regions", coords: { lat: 34.0430, lng: 73.3810 }, basePricePerMarla: 2_300_000 },
];

export function getLocationBySlug(slug: string): LocationArea | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export function getLocationsByCity(city: CityKey): LocationArea[] {
  return LOCATIONS.filter((l) => l.city === city);
}

export const CITIES: CityKey[] = ["islamabad", "rawalpindi", "hills"];
