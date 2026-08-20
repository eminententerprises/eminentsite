import type { Metadata } from "next";
import { getAllArticles } from "@/lib/repositories/article-repository";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { SectionReveal } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Insights",
  description: "Market insights, buying guides, investment analysis and construction advice from Eminent Enterprises and Buraq Eminent Constructors.",
};

export default function InsightsPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights" }]} />

      <SectionReveal>
        <div className="mt-4 max-w-2xl">
          <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Our Desk</p>
          <h1 className="mt-2 text-display-lg">Insights</h1>
          <p className="mt-4 text-body-lg text-ink-secondary">
            Market analysis, buying guides and construction advice grounded in what we see on the ground across Islamabad, Rawalpindi and the hill regions.
          </p>
        </div>
      </SectionReveal>

      <div className="mt-10">
        <InsightsGrid articles={articles} />
      </div>
    </div>
  );
}
