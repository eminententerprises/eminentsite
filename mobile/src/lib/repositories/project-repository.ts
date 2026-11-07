import type { Project } from "@/types";
import { PROJECTS } from "@/data/projects";

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit?: number): Project[] {
  const featured = PROJECTS.filter((p) => p.isFeatured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}
