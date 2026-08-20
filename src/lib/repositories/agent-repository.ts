import type { Agent } from "@/types";
import { AGENTS } from "@/data/agents";

export function getAllAgents(): Agent[] {
  return AGENTS;
}

export function getAgentBySlug(slug: string): Agent | undefined {
  return AGENTS.find((a) => a.slug === slug);
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}
