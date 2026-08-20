"use client";

import { useMemo, useState } from "react";
import type { ConstructionProject, ConstructionServiceSlug } from "@/types";
import { BURAQ } from "@/config/site";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CaseStudyCard } from "@/components/construction/case-study-card";
import { StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

const FILTERS: { value: ConstructionServiceSlug | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...BURAQ.services.map((s) => ({ value: s.slug as ConstructionServiceSlug, label: s.name })),
];

export function PortfolioGrid({ projects }: { projects: ConstructionProject[] }) {
  const [active, setActive] = useState<ConstructionServiceSlug | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.serviceType === active)),
    [projects, active],
  );

  return (
    <Tabs value={active} onValueChange={(value) => setActive(value as ConstructionServiceSlug | "all")}>
      <TabsList className="flex-wrap">
        {FILTERS.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={active} className="mt-6">
        {filtered.length > 0 ? (
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <StaggerItem key={project.id}>
                <CaseStudyCard project={project} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <p className="py-12 text-center text-body-md text-ink-secondary">No case studies for this service yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
