import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MaterialCalculator } from "@/components/construction/material-calculator";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Brick & Material Calculator",
  description:
    "Enter your structure's covered area, storeys and build type to estimate the bricks, cement, sand, aggregate and steel your construction will need.",
};

export default function MaterialCalculatorPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Brick & Material Calculator" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-md">Brick & Material Calculator</h1>
        <p className="mt-3 max-w-2xl text-body-lg text-ink-secondary">
          Tell us about your structure and get an instant, itemised estimate of the bricks, cement, sand, aggregate
          and steel it will take to build — plus paint and tiles for a turnkey finish.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-8">
          <MaterialCalculator />
        </div>
      </SectionReveal>
    </div>
  );
}
