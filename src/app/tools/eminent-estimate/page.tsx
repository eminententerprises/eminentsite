import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionReveal } from "@/components/home/section-reveal";
import { EminentEstimateForm } from "./eminent-estimate-form";

export const metadata: Metadata = {
  title: "Eminent Estimate",
  description:
    "Answer five quick questions about your residential property in Islamabad, Rawalpindi or the hill regions and get an indicative value range.",
};

export default function EminentEstimatePage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Eminent Estimate" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-md">Eminent Estimate</h1>

        <p className="mt-3 max-w-prose text-body-lg text-ink-secondary">
          Answer five quick questions about your property and we&apos;ll generate an indicative value range based on
          area rates, condition, age and standout features — plus comparable listings from our current inventory.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-8">
          <EminentEstimateForm />
        </div>
      </SectionReveal>
    </div>
  );
}
