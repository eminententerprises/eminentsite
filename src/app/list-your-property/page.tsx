import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { EMINENT } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";
import { ListPropertyForm } from "./list-property-form";

export const metadata: Metadata = {
  title: "List Your Property",
  description: "List your property for sale or rent with Eminent Enterprises — reach serious buyers and tenants across Islamabad, Rawalpindi and the hill regions.",
};

const BENEFITS = [
  "Wide network of verified local and overseas buyers/tenants",
  "Professional photography and listing presentation",
  "Transparent, ethical handling of every enquiry",
  "Dedicated point of contact from listing through to closing",
];

export default function ListYourPropertyPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "List Your Property" }]} />

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
        <SectionReveal>
          <div>
            <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Sellers &amp; Landlords</p>
            <h1 className="mt-2 text-display-lg">List Your Property</h1>
            <p className="mt-4 text-body-lg text-ink-secondary">
              Tell us about your property in two quick steps and our team will get in touch to discuss valuation,
              marketing and next steps — with {EMINENT.credentialBadge.toLowerCase()} behind every recommendation.
            </p>

            <StaggerGroup className="mt-8 flex flex-col gap-3">
              {BENEFITS.map((b) => (
                <StaggerItem key={b} className="flex items-start gap-2.5 text-body-md text-ink-primary">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" aria-hidden="true" />
                  {b}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="rounded-2xl border border-border-hairline bg-surface-raised p-6 shadow-card sm:p-8">
            <ListPropertyForm />
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
