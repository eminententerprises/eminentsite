import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { EMINENT, BURAQ, GROUP } from "@/config/site";
import { TRUST_STATS } from "@/data/trust-stats";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SurveyLine } from "@/components/brand/survey-line";
import { Button } from "@/components/ui/button";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Eminent Enterprises and Buraq Eminent Constructors — one trusted name across real estate advisory and construction craftsmanship.",
};

const TIMELINE = [
  { label: "Founded", detail: "Eminent Enterprises begins advising local buyers and sellers across the twin cities." },
  { label: "10+ Years In", detail: EMINENT.credentialBadge + " serving clients across Islamabad, Rawalpindi and the hill regions." },
  { label: "Buraq Launches", detail: BURAQ.badge },
] as const;

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

        <SectionReveal>
          <div className="mt-4 max-w-2xl">
            <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">About Us</p>
            <h1 className="mt-2 text-display-lg">{GROUP.headline}</h1>
            <p className="mt-4 text-body-lg text-ink-secondary">{GROUP.body}</p>
          </div>
        </SectionReveal>

        <SurveyLine className="my-10" />

        {/* TIMELINE */}
        <SectionReveal>
          <section>
            <h2 className="text-heading-lg uppercase text-ink-primary">Our Story</h2>
            <StaggerGroup className="mt-6 flex flex-col gap-0">
              {TIMELINE.map((item, i) => (
                <StaggerItem key={item.label} className="grid grid-cols-[20px_1fr] gap-4">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent-strong" aria-hidden="true" />
                    {i < TIMELINE.length - 1 && <span className="mt-1 w-px flex-1 bg-border-hairline" aria-hidden="true" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-body-sm font-semibold uppercase tracking-wide text-accent-strong">{item.label}</p>
                    <p className="mt-1 text-body-md text-ink-secondary">{item.detail}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        </SectionReveal>
      </div>

      {/* CREDENTIAL BAND */}
      <SectionReveal>
        <section className="bg-surface-warm px-4 py-12 sm:px-6">
          <StaggerGroup className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {TRUST_STATS.map((stat) => (
              <StaggerItem key={stat.label}>
                <p className="font-tabular-nums text-display-md text-navy-800">{stat.value}</p>
                <p className="mt-1 text-body-sm uppercase tracking-wide text-ink-secondary">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </SectionReveal>

      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        {/* TWO BRANDS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <SectionReveal>
            <div className="rounded-2xl border border-border-hairline bg-surface-raised p-8">
              <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Real Estate Advisory</p>
              <h2 className="mt-2 text-display-sm">{EMINENT.name}</h2>
              <p className="mt-3 text-body-sm uppercase tracking-wide text-ink-muted">{EMINENT.positioning}</p>
              <p className="mt-4 text-body-md text-ink-secondary">{EMINENT.boilerplate}</p>
              <StaggerGroup className="mt-5 flex flex-col gap-2.5">
                {EMINENT.whyChoose.slice(0, 4).map((reason) => (
                  <StaggerItem key={reason} className="flex items-start gap-2 text-body-sm text-ink-primary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                    {reason}
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="rounded-2xl border border-border-hairline bg-surface-raised p-8">
              <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Construction</p>
              <h2 className="mt-2 text-display-sm">{BURAQ.name}</h2>
              <p className="mt-3 text-body-sm uppercase tracking-wide text-ink-muted">{BURAQ.positioning}</p>
              <p className="mt-4 text-body-md text-ink-secondary">{BURAQ.intro}</p>
              <StaggerGroup className="mt-5 flex flex-col gap-2.5">
                {BURAQ.whyChoose.slice(0, 4).map((reason) => (
                  <StaggerItem key={reason} className="flex items-start gap-2 text-body-sm text-ink-primary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                    {reason}
                  </StaggerItem>
                ))}
              </StaggerGroup>
              <Button asChild variant="outline" size="sm" className="mt-5">
                <Link href="/construction">
                  Visit Buraq <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </SectionReveal>
        </div>

        {/* TEAM NOTE — no fabricated individuals */}
        <SectionReveal>
          <section className="mt-14 rounded-3xl border border-border-hairline bg-surface-sunken p-8 text-center">
            <h2 className="text-heading-lg uppercase text-ink-primary">Our Team</h2>
            <p className="mx-auto mt-3 max-w-2xl text-body-md text-ink-secondary">
              Our advisory and construction teams bring together local market specialists, property consultants, and site
              supervisors working across Islamabad, Rawalpindi and the hill regions — each engagement is handled by a
              dedicated point of contact from first enquiry through to closing or handover.
            </p>
          </section>
        </SectionReveal>

        <SectionReveal>
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-body-lg text-ink-secondary">Have a property goal in mind?</p>
            <Button asChild size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
