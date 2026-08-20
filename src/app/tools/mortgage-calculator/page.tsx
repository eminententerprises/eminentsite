import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SectionReveal } from "@/components/home/section-reveal";
import { MortgageCalculatorForm } from "./mortgage-calculator-form";

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description:
    "Estimate your monthly home finance instalment, total markup and full amortisation schedule for a property purchase in Pakistan.",
};

export default function MortgageCalculatorPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Mortgage Calculator" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-md">Mortgage Calculator</h1>

        <p className="mt-3 max-w-prose text-body-lg text-ink-secondary">
          Estimate your monthly instalment and see how much of each payment goes toward principal versus markup
          over the life of the loan. Figures are indicative — confirm exact terms with your bank or Islamic
          finance provider before making a decision.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-8">
          <MortgageCalculatorForm />
        </div>
      </SectionReveal>
    </div>
  );
}
