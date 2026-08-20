import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BURAQ } from "@/config/site";
import { getConstructionProjectsByService } from "@/lib/repositories/construction-repository";
import { buildWhatsAppLink, whatsAppConstructionMessage } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SurveyLine } from "@/components/brand/survey-line";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { CaseStudyCard } from "@/components/construction/case-study-card";
import { PageHero } from "@/components/shared/page-hero";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";
import type { ConstructionServiceSlug } from "@/types";

function getService(slug: string) {
  return BURAQ.services.find((s) => s.slug === slug);
}

export function generateStaticParams() {
  return BURAQ.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} — Buraq Eminent Constructors`,
    description: service.description,
  };
}

export default async function ConstructionServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedProjects = getConstructionProjectsByService(service.slug as ConstructionServiceSlug);
  const whatsappHref = buildWhatsAppLink(whatsAppConstructionMessage());
  const defaultReason = service.slug === "renovation" ? "Renovation" : "Construction";
  const heroCover = relatedProjects[0]?.afterImages[0] ?? relatedProjects[0]?.beforeImages[0];

  return (
    <div>
      <PageHero
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Construction", href: "/construction" },
              { label: service.name },
            ]}
          />
        }
        image={{
          src: heroCover?.src ?? `https://picsum.photos/seed/buraq-${service.slug}/1600/900`,
          alt: heroCover?.alt ?? service.name,
        }}
        kicker={`Service ${String(service.order).padStart(2, "0")} of ${BURAQ.services.length}`}
        heading={service.name}
        subheading={service.description}
        height="md"
        cta={
          <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Discuss This Service on WhatsApp
            </a>
          </Button>
        }
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        <SurveyLine className="mb-12" />

        <SectionReveal>
          <section>
            <h2 className="text-display-sm">
              {relatedProjects.length > 0 ? "Related Case Studies" : "Case Studies Coming Soon"}
            </h2>
            {relatedProjects.length > 0 ? (
              <StaggerGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((project) => (
                  <StaggerItem key={project.id}>
                    <CaseStudyCard project={project} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            ) : (
              <p className="mt-3 max-w-xl text-body-md text-ink-secondary">
                We&apos;re building out our {service.name.toLowerCase()} portfolio — get in touch and we&apos;ll walk
                you through recent work directly.
              </p>
            )}
          </section>
        </SectionReveal>

        <SectionReveal>
          <section className="mt-16 rounded-3xl border border-border-hairline bg-surface-warm p-8 sm:p-10">
            <h2 className="text-heading-lg uppercase text-ink-primary">Enquire About {service.name}</h2>
            <p className="mt-2 max-w-xl text-body-sm text-ink-secondary">
              Share a few details and our team will get back to you — usually the same day.
            </p>
            <div className="mt-6 max-w-xl">
              <EnquiryForm showReason defaultReason={defaultReason} />
            </div>
          </section>
        </SectionReveal>
      </div>
    </div>
  );
}
