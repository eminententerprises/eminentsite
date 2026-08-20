import type { AreaGuide } from "@/types";
import { AREA_GUIDES } from "@/data/area-guides";

export function getAllAreaGuides(): AreaGuide[] {
  return AREA_GUIDES;
}

export function getAreaGuideBySlug(slug: string): AreaGuide | undefined {
  return AREA_GUIDES.find((a) => a.slug === slug);
}
