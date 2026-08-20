import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layers, Building2, Gem, Clock3 } from "lucide-react";
import { BURAQ } from "@/config/site";
import {
  getAllConstructionProjects,
  getConstructionProjectBySlug,
} from "@/lib/repositories/construction-repository";
import { buildWhatsAppLink, whatsAppConstructionMessage } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurveyLine } from "@/components/brand/survey-line";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { BeforeAfterSlider } from "@/components/construction/before-after-slider";
import { CaseStudyTimeline } from "@/components/construction/case-study-timeline";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export function generateStaticParams() {
  return getAllConstructionProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getConstructionProjectBySlug(slug);
  if (!project) return { title: "Case Study Not Found" };
  return {
    title: project.title,
    description: project.summary.slice(0, 155),
    openGraph: {
      title: project.title,
      description: project.summary.slice(0, 155),
      images: project.afterImages[0] ? [{ url: project.afterImages[0].src }] : undefined,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getConstructionProjectBySlug(slug);
  if (!project) notFound();

  const service = BURAQ.services.find((s) => s.slug === project.serviceType);
  const whatsappHref = buildWhatsAppLink(whatsAppConstructionMessage());

  const stats = [
    { icon: Layers, label: "Covered Area", value: `${project.coveredAreaSqft.toLocaleString("en-PK")} sq ft` },
    { icon: Building2, label: "Storeys", value: String(project.storeys) },
    { icon: Gem, label: "Quality Tier", value: project.qualityTier },
    { icon: Clock3, label: "Duration", value: `${project.durationMonths} months` },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Construction", href: "/construction" },
          { label: "Portfolio", href: "/construction/portfolio" },
          { label: project.title },
        ]}
      />

      <SectionReveal>
        <div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{project.qualityTier}</Badge>
            {service && <Badge variant="outline">{service.name}</Badge>}
            <span className="font-tabular-nums text-body-sm text-ink-muted">{project.year}</span>
          </div>

          <h1 className="mt-3 text-display-md">{project.title}</h1>
          <p className="mt-1 text-body-lg text-ink-secondary">{project.location}</p>

          <div className="mt-8">
            <BeforeAfterSlider project={project} />
          </div>
        </div>
      </SectionReveal>

      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 border-y border-border-hairline py-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label} className="flex flex-col gap-1.5">
            <stat.icon className="h-5 w-5 text-accent-strong" aria-hidden="true" />
            <span className="font-tabular-nums text-heading-lg text-ink-primary">{stat.value}</span>
            <span className="text-body-sm text-ink-muted">{stat.label}</span>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <SectionReveal>
          <div>
            <h2 className="text-heading-lg uppercase text-ink-primary">Project Summary</h2>
            <p className="mt-3 text-body-lg text-ink-secondary">{project.summary}</p>

            <SurveyLine className="my-10" />

            <h2 className="text-heading-lg uppercase text-ink-primary">Spec Sheet</h2>
            <div className="mt-4 overflow-x-auto border border-border-hairline">
              <table className="w-full min-w-[420px] border-collapse text-body-sm">
                <tbody>
                  {project.specSheet.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 1 ? "bg-surface-sunken" : ""}>
                      <th scope="row" className="w-1/3 border-b border-border-hairline px-4 py-3 text-left font-semibold text-ink-primary last:border-b-0">
                        {row.label}
                      </th>
                      <td className="border-b border-border-hairline px-4 py-3 text-ink-secondary last:border-b-0">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-10 text-heading-lg uppercase text-ink-primary">Build Timeline</h2>
            <div className="mt-4">
              <CaseStudyTimeline timeline={project.timeline} />
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border-hairline bg-surface-warm p-6">
              <h2 className="text-heading-md uppercase text-ink-primary">Planning Something Similar?</h2>
              <p className="mt-2 text-body-sm text-ink-secondary">
                Tell us about your project and we&apos;ll get back to you directly.
              </p>
              <Button asChild variant="whatsapp" size="lg" className="mt-4 w-full">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Ask About This Project
                </a>
              </Button>
              <div className="mt-6 border-t border-border-hairline pt-6">
                <EnquiryForm showReason defaultReason="Construction" propertyRef={project.slug} />
              </div>
            </div>
          </aside>
        </SectionReveal>
      </div>
    </div>
  );
}
