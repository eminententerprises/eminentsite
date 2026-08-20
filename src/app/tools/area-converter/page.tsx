import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { UnitConverterWidget } from "@/components/shared/unit-converter-widget";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Area Converter",
  description:
    "Convert between Marla, Kanal, Square Feet and Square Yards, including the standard vs old Marla distinction used across Pakistan.",
};

export default function AreaConverterPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Area Converter" }]} />

      <SectionReveal>
        <h1 className="mt-4 text-display-md">Area Converter</h1>

        <p className="mt-3 max-w-prose text-body-lg text-ink-secondary">
          Pakistani real estate is measured in Marla and Kanal, alongside Square Feet and Square Yards for
          commercial and apartment listings. One Kanal is 20 Marla. There isn&apos;t a single agreed Marla either —
          most current listings use the standard 225 sq ft Marla, but older registry paperwork and some regions
          still price against the 272.25 sq ft &ldquo;old&rdquo; Marla. Pick your unit and standard below to
          convert instantly.
        </p>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <div className="mt-8">
          <UnitConverterWidget />
        </div>
      </SectionReveal>
    </div>
  );
}
