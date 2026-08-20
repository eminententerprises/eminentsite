import type { Metadata } from "next";
import { getAllProjects } from "@/lib/repositories/project-repository";
import { ProjectCard } from "@/components/project/project-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "New Projects",
  description:
    "Browse new residential and commercial development projects across Islamabad, Rawalpindi and the hill regions — with payment plans, construction progress and unit-wise pricing.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-md">New Projects</h1>
        <p className="mt-2 max-w-2xl text-body-lg text-ink-secondary">
          {projects.length} active developments across Islamabad, Rawalpindi and the hill regions — complete with
          payment plans, construction progress and unit-wise pricing.
        </p>
      </SectionReveal>

      {projects.length > 0 ? (
        <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <p className="mt-10 text-body-md text-ink-secondary">No projects are currently listed. Please check back soon.</p>
      )}
    </div>
  );
}
