import type { ConstructionProject, ConstructionServiceSlug } from "@/types";
import { CONSTRUCTION_PROJECTS } from "@/data/construction-projects";

export function getAllConstructionProjects(): ConstructionProject[] {
  return CONSTRUCTION_PROJECTS;
}

export function getConstructionProjectBySlug(slug: string): ConstructionProject | undefined {
  return CONSTRUCTION_PROJECTS.find((p) => p.slug === slug);
}

export function getConstructionProjectsByService(service: ConstructionServiceSlug): ConstructionProject[] {
  return CONSTRUCTION_PROJECTS.filter((p) => p.serviceType === service);
}

export function getFeaturedConstructionProjects(limit?: number): ConstructionProject[] {
  const featured = CONSTRUCTION_PROJECTS.filter((p) => p.isFeatured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}
