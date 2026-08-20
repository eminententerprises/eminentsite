import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Building2, Phone, MessageCircle } from "lucide-react";
import { getAllProjects, getProjectBySlug } from "@/lib/repositories/project-repository";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GalleryLightbox } from "@/components/property/gallery-lightbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SurveyLine } from "@/components/brand/survey-line";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";
import { PropertyImage } from "@/components/media/property-image";
import { ProjectCard, POSSESSION_BADGE_VARIANT } from "@/components/project/project-card";
import { PaymentPlanTable } from "@/components/project/payment-plan-table";
import { ProgressTimeline } from "@/components/project/progress-timeline";
import { BrochureGateForm } from "@/components/project/brochure-gate-form";
import { formatPKR } from "@/lib/format-pkr";
import { formatAreaAuto } from "@/lib/area";
import { buildWhatsAppLink, whatsAppProjectMessage } from "@/lib/whatsapp";
import { CONTACT } from "@/config/site";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const description = project.description.slice(0, 155);
  return {
    title: project.name,
    description,
    openGraph: {
      title: project.name,
      description,
      images: project.images[0] ? [{ url: project.images[0].src }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const heroImage = project.images[0];
  const startingPrice = Math.min(...project.unitTypes.map((u) => u.startingPrice));
  const otherProjects = getAllProjects()
    .filter((p) => p.id !== project.id)
    .slice(0, 3);
  const whatsappHref = buildWhatsAppLink(whatsAppProjectMessage({ title: project.name }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    description: project.description,
    url: `${CONTACT.websiteHref}/projects/${project.slug}`,
    datePosted: project.addedAt,
    image: project.images.map((i) => i.src),
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location.area,
      addressRegion: project.location.cityLabel,
      addressCountry: "PK",
    },
    offers: {
      "@type": "Offer",
      price: startingPrice,
      priceCurrency: "PKR",
      availability: project.possession === "Ready" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: CONTACT.websiteHref },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${CONTACT.websiteHref}/projects` },
      { "@type": "ListItem", position: 3, name: project.name, item: `${CONTACT.websiteHref}/projects/${project.slug}` },
    ],
  };

  return (
    <div className="pb-24 lg:pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: project.name },
          ]}
        />
      </div>

      {/* Cinematic hero */}
      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden bg-navy-900 sm:aspect-[16/9] lg:aspect-[21/9]">
        {heroImage && (
          <PropertyImage src={heroImage.src} alt={heroImage.alt} fill sizes="100vw" className="animate-ken-burns object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-navy-950/5" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8">
          <SectionReveal>
            <div className="mx-auto max-w-[1440px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={POSSESSION_BADGE_VARIANT[project.possession]}>{project.possession}</Badge>
                <Badge variant="inverted">{project.approval}</Badge>
                {project.isFeatured && <Badge variant="accent">Featured</Badge>}
              </div>
              <h1 className="mt-3 text-display-md text-white sm:text-display-lg">{project.name}</h1>
              <p className="mt-1.5 max-w-2xl text-body-lg text-white/85">{project.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-body-sm text-white/75">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {project.location.area}, {project.location.cityLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {project.developer}
                </span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Overview */}
          <SectionReveal>
            <section>
              <h2 className="text-display-sm">About {project.name}</h2>
              <p className="mt-3 whitespace-pre-line text-body-lg text-ink-secondary">{project.description}</p>
            </section>
          </SectionReveal>

          <Separator className="my-8" />

          {/* Unit types */}
          <SectionReveal>
            <section>
              <h2 className="text-display-sm">Unit Types</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-hairline">
                      <th scope="col" className="py-2.5 pr-4 text-label uppercase tracking-widest text-ink-muted">
                        Unit Type
                      </th>
                      <th scope="col" className="py-2.5 pr-4 text-label uppercase tracking-widest text-ink-muted">
                        Area
                      </th>
                      <th scope="col" className="py-2.5 text-label uppercase tracking-widest text-ink-muted">
                        Starting Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline">
                    {project.unitTypes.map((unit) => (
                      <tr key={unit.name}>
                        <td className="py-3 pr-4 text-body-sm font-semibold text-ink-primary">{unit.name}</td>
                        <td className="py-3 pr-4 font-tabular-nums text-body-sm text-ink-secondary">
                          {formatAreaAuto(unit.areaSqft)}
                        </td>
                        <td className="py-3 font-tabular-nums text-body-sm font-semibold text-navy-800">
                          {formatPKR(unit.startingPrice).short}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </SectionReveal>

          <Separator className="my-8" />

          {/* Payment plan */}
          <SectionReveal>
            <section>
              <PaymentPlanTable paymentPlan={project.paymentPlan} unitTypes={project.unitTypes} />
            </section>
          </SectionReveal>

          <Separator className="my-8" />

          {/* Construction progress */}
          <SectionReveal>
            <section>
              <h2 className="text-display-sm">Construction Progress</h2>
              <div className="mt-6">
                <ProgressTimeline milestones={project.progress} />
              </div>
            </section>
          </SectionReveal>

          <SurveyLine className="my-10" />

          {/* Amenities */}
          {project.amenities.length > 0 && (
            <>
              <SectionReveal>
                <section>
                  <h2 className="text-display-sm">Amenities</h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {project.amenities.map((a) => (
                      <span key={a} className="rounded-lg border border-border-hairline px-3 py-2 text-body-sm text-ink-primary">
                        {a}
                      </span>
                    ))}
                  </div>
                </section>
              </SectionReveal>
              <Separator className="my-8" />
            </>
          )}

          {/* Location advantages */}
          {project.locationAdvantages.length > 0 && (
            <>
              <SectionReveal>
                <section>
                  <h2 className="text-display-sm">Location Advantages</h2>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {project.locationAdvantages.map((advantage) => (
                      <li key={advantage} className="flex items-start gap-2.5 text-body-sm text-ink-secondary">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </section>
              </SectionReveal>
              <Separator className="my-8" />
            </>
          )}

          {/* Gallery */}
          <SectionReveal>
            <section>
              <h2 className="text-display-sm">Gallery</h2>
              <div className="mt-5">
                <GalleryLightbox images={project.images} title={project.name} />
              </div>
            </section>
          </SectionReveal>

          {/* Brochure + enquiry */}
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border-hairline bg-surface-sunken p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-heading-sm uppercase text-ink-primary">Want more details?</p>
              <p className="mt-1 text-body-sm text-ink-secondary">
                {project.brochureAvailable
                  ? "Get the brochure or message us directly on WhatsApp."
                  : "Message us directly on WhatsApp for the latest availability."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {project.brochureAvailable && (
                <BrochureGateForm projectSlug={project.slug} projectName={project.name} variant="secondary" />
              )}
              <Button asChild variant="whatsapp" size="lg">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>

          {otherProjects.length > 0 && (
            <>
              <Separator className="my-10" />
              <section>
                <h2 className="mb-5 text-display-sm">Other Projects</h2>
                <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {otherProjects.map((p) => (
                    <StaggerItem key={p.id}>
                      <ProjectCard project={p} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Sticky enquiry bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-hairline bg-surface-raised/95 px-4 py-2.5 shadow-overlay backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-label uppercase tracking-widest text-ink-muted">Starting From</p>
            <p className="truncate font-tabular-nums text-lg font-semibold text-navy-800">{formatPKR(startingPrice).short}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={CONTACT.phoneHref}
              className="hidden h-11 items-center justify-center rounded-full border border-border-strong px-4 text-body-sm font-semibold uppercase tracking-wide text-ink-primary hover:border-navy-800 hover:text-navy-800 sm:flex"
            >
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" /> Call
            </a>
            {project.brochureAvailable && (
              <BrochureGateForm projectSlug={project.slug} projectName={project.name} variant="outline" size="sm" className="hidden sm:inline-flex" />
            )}
            <Button asChild variant="whatsapp" size="md">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
