import type { Metadata } from "next";
import { getAllConstructionProjects } from "@/lib/repositories/construction-repository";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PortfolioGrid } from "@/components/construction/portfolio-grid";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse Buraq Eminent Constructors' completed case studies — new construction, renovation, interior & exterior fit-outs, consultation and site oversight work across the twin cities and hill regions.",
};

export default function ConstructionPortfolioPage() {
  const projects = getAllConstructionProjects();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Construction", href: "/construction" }, { label: "Portfolio" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-md">Our Portfolio</h1>
        <p className="mt-3 max-w-2xl text-body-lg text-ink-secondary">
          {projects.length} completed case studies across new construction, renovation, interior & exterior fit-outs,
          consultation and on-site oversight.
        </p>
      </SectionReveal>

      <div className="mt-8">
        <PortfolioGrid projects={projects} />
      </div>
    </div>
  );
}
