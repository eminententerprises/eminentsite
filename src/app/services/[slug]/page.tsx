import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { EMINENT } from "@/config/site";
import { SERVICE_DETAILS } from "@/data/service-details";
import { getFeaturedProperties } from "@/lib/repositories/property-repository";
import { buildWhatsAppLink, whatsAppServiceMessage } from "@/lib/whatsapp";
import type { EnquiryReason } from "@/types";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SurveyLine } from "@/components/brand/survey-line";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { PropertyCard } from "@/components/property/property-card";
import { ServiceHighlights } from "@/components/services/service-highlights";
import { ServiceProcess } from "@/components/services/service-process";
import { ServiceFaqAccordion } from "@/components/services/service-faq";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

const REASON_BY_SLUG: Record<string, EnquiryReason> = {
  "property-sale-purchase": "Buy/Sell",
  "investment-portfolio-management": "Investment",
  "property-management-allied-services": "Property Management",
};

export function generateStaticParams() {
  return EMINENT.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = EMINENT.services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return { title: service.name, description: service.description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = EMINENT.services.find((s) => s.slug === slug);
  if (!service) notFound();

  const detail = SERVICE_DETAILS[service.slug];
  const reason = REASON_BY_SLUG[service.slug];
  const showListings = service.slug === "property-sale-purchase";
  const featured = showListings ? getFeaturedProperties(3) : [];
  const whatsappHref = buildWhatsAppLink(whatsAppServiceMessage({ title: service.name }));

  return (
    <div>
      {/* ---------------------------------------------------------------- HERO */}
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.name }]} />}
        image={{ src: `https://picsum.photos/seed/${detail.heroImageSeed}/1600/900`, alt: `${service.name} — Eminent Enterprises` }}
        kicker="Eminent Enterprises"
        heading={service.name}
        subheading={service.description}
        cta={
          <>
            <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Discuss On WhatsApp
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full border-white/30 text-paper hover:border-accent sm:w-auto">
              <a href="#enquire">Send An Enquiry</a>
            </Button>
          </>
        }
      />

      {/* ---------------------------------------------------------------- STATS */}
      <SectionReveal>
        <section className="bg-surface-warm px-4 py-10 sm:px-6">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 sm:grid-cols-3">
            {detail.stats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-accent-strong pl-4 text-left">
                <AnimatedCounter value={stat.value} className="text-display-sm text-navy-800" />
                <p className="mt-1 text-body-sm text-ink-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6">
        <SurveyLine label={service.name} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          {/* -------------------------------------------------------- MAIN COLUMN */}
          <div className="flex flex-col gap-16">
            {/* WHAT'S INCLUDED */}
            <SectionReveal>
              <div>
                <h2 className="text-display-sm">What&apos;s Included</h2>
                <p className="mt-2 max-w-2xl text-body-md text-ink-secondary">
                  Everything below is part of the same engagement — not billed as separate add-ons.
                </p>
                <div className="mt-8">
                  <ServiceHighlights highlights={detail.highlights} />
                </div>
              </div>
            </SectionReveal>

            {/* PROCESS */}
            <SectionReveal>
              <div>
                <h2 className="text-display-sm">How It Works</h2>
                <p className="mt-2 max-w-2xl text-body-md text-ink-secondary">A straightforward process from first conversation to ongoing support.</p>
                <div className="mt-8">
                  <ServiceProcess steps={detail.process} />
                </div>
              </div>
            </SectionReveal>

            {/* FEATURED LISTINGS (sale/purchase only) */}
            {showListings && featured.length > 0 && (
              <SectionReveal>
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-display-sm">Featured Listings</h2>
                    <Link href="/properties" className="flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
                      View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                  <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {featured.map((p) => (
                      <StaggerItem key={p.id}>
                        <PropertyCard property={p} />
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </div>
              </SectionReveal>
            )}

            {/* WHY CHOOSE */}
            <SectionReveal>
              <div className="rounded-3xl bg-gradient-to-br from-iris-50 via-white to-sky-50 p-8 sm:p-10">
                <h2 className="text-display-sm text-navy-800">Why Work With Eminent</h2>
                <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {EMINENT.whyChoose.map((reasonItem) => (
                    <StaggerItem key={reasonItem} className="flex items-start gap-2.5 text-body-md text-ink-primary">
                      {reasonItem}
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </SectionReveal>

            {/* FAQ */}
            <SectionReveal>
              <div>
                <h2 className="text-display-sm">Frequently Asked Questions</h2>
                <div className="mt-8 max-w-2xl">
                  <ServiceFaqAccordion faqs={detail.faqs} />
                </div>
              </div>
            </SectionReveal>

            {/* PULL QUOTE */}
            <p className="border-l-2 border-accent-strong pl-6 font-accent text-2xl italic text-ink-secondary sm:text-3xl">
              &ldquo;{detail.pullQuote}&rdquo;
            </p>
          </div>

          {/* -------------------------------------------------------- SIDEBAR */}
          <SectionReveal delay={0.15}>
            <aside id="enquire" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border-hairline bg-surface-raised p-6 shadow-card">
                <h2 className="text-heading-md uppercase text-ink-primary">Enquire About {service.name}</h2>
                <p className="mt-2 text-body-sm text-ink-secondary">Tell us a bit about what you need — our team will get back to you.</p>
                <div className="mt-5">
                  <EnquiryForm defaultReason={reason} showReason submitLabel="Send Enquiry" />
                </div>
                <div className="mt-5 border-t border-border-hairline pt-5">
                  <Button asChild variant="whatsapp" size="md" className="w-full">
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat On WhatsApp Instead
                    </a>
                  </Button>
                </div>
              </div>
            </aside>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}
