import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { EMINENT } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SurveyLine } from "@/components/brand/survey-line";
import { Button } from "@/components/ui/button";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Services",
  description: "Property sale & purchase, investment & portfolio management, and property management services from Eminent Enterprises.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />

      <SectionReveal>
        <div className="mt-4 max-w-2xl">
          <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">What We Do</p>
          <h1 className="mt-2 text-display-lg">Our Services</h1>
          <p className="mt-4 text-body-lg text-ink-secondary">{EMINENT.boilerplate}</p>
        </div>
      </SectionReveal>

      <SurveyLine className="my-10" />

      <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {EMINENT.services.map((service, i) => (
          <StaggerItem key={service.slug}>
            <Link
              href={`/services/${service.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-border-hairline bg-surface-raised p-6 shadow-card transition-shadow hover:shadow-raised"
            >
              <span className="font-tabular-nums text-body-sm text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-heading-lg uppercase text-ink-primary">{service.name}</h2>
              <p className="text-body-md text-ink-secondary">{service.description}</p>
              <span className="mt-auto flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-navy-800 group-hover:text-accent-strong">
                Learn More <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <SectionReveal>
        <section className="mt-16 rounded-3xl border border-border-hairline bg-surface-sunken p-8 sm:p-10">
          <h2 className="text-display-sm">Why Choose Eminent</h2>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {EMINENT.whyChoose.map((reason) => (
              <StaggerItem key={reason} className="flex items-start gap-2.5 text-body-md text-ink-primary">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden="true" />
                {reason}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </SectionReveal>

      <SectionReveal>
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-body-lg text-ink-secondary">Not sure which service fits your situation?</p>
          <Button asChild size="lg">
            <Link href="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </SectionReveal>
    </div>
  );
}
