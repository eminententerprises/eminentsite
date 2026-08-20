import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { getAllAreaGuides, getAreaGuideBySlug } from "@/lib/repositories/area-repository";
import { searchProperties } from "@/lib/repositories/property-repository";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PropertyMap } from "@/components/property/property-map";
import { PropertyCard } from "@/components/property/property-card";
import { PriceTrendChart } from "@/components/areas/price-trend-chart";
import { SurveyLine } from "@/components/brand/survey-line";
import { PageHero } from "@/components/shared/page-hero";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";
import { formatPKR } from "@/lib/format-pkr";

export function generateStaticParams() {
  return getAllAreaGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getAreaGuideBySlug(slug);
  if (!guide) return { title: "Area Not Found" };
  return { title: `${guide.name} Area Guide`, description: guide.summary.slice(0, 155) };
}

export default async function AreaGuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getAreaGuideBySlug(slug);
  if (!guide) notFound();

  const { results: listings } = await searchProperties({ areas: [slug], page: 1 });

  return (
    <div>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Area Guides", href: "/areas" }, { label: guide.name }]} />}
        image={{ src: guide.heroImage, alt: guide.name }}
        kicker={guide.cityLabel}
        heading={guide.name}
        subheading={guide.summary}
        height="md"
      />

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <SurveyLine className="mb-10" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-12">
            <SectionReveal>
              <section>
                <h2 className="text-heading-lg uppercase text-ink-primary">Price Trend</h2>
                <div className="mt-5 rounded-2xl border border-border-hairline bg-surface-raised p-5">
                  <PriceTrendChart points={guide.priceTrend} />
                </div>
              </section>
            </SectionReveal>

            <SectionReveal>
              <section>
                <h2 className="text-heading-lg uppercase text-ink-primary">Average Price by Property Type</h2>
                <div className="mt-5 overflow-x-auto border border-border-hairline">
                  <table className="w-full min-w-[420px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border-hairline bg-surface-sunken">
                        <th scope="col" className="px-4 py-3 text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">
                          Property Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">
                          Avg. Price / Marla
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {guide.avgPriceByType.map((row) => (
                        <tr key={row.type} className="border-b border-border-hairline last:border-0">
                          <td className="px-4 py-3 text-body-md text-ink-primary">{row.type}</td>
                          <td className="px-4 py-3 font-tabular-nums text-body-md font-semibold text-navy-800">{formatPKR(row.pricePerMarla).short}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </SectionReveal>

            <SectionReveal>
              <section>
                <h2 className="text-heading-lg uppercase text-ink-primary">Amenities &amp; Landmarks</h2>
                <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {guide.amenities.map((a) => (
                        <span key={a} className="rounded-lg border border-border-hairline px-3 py-1.5 text-body-sm text-ink-primary">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">Nearby Landmarks</p>
                    <ul className="flex flex-col gap-2">
                      {guide.landmarks.map((l) => (
                        <li key={l.name} className="flex items-center justify-between border-b border-border-hairline pb-2 text-body-sm last:border-0">
                          <span className="text-ink-primary">{l.name}</span>
                          <span className="font-tabular-nums text-ink-muted">{l.distanceKm} km</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </SectionReveal>

            <SectionReveal>
              <section>
                <h2 className="text-heading-lg uppercase text-ink-primary">Location</h2>
                <div className="mt-5">
                  <PropertyMap
                    markers={[{ id: guide.slug, lat: guide.coords.lat, lng: guide.coords.lng, label: guide.name }]}
                    center={[guide.coords.lat, guide.coords.lng]}
                    zoom={13}
                    fitToMarkers={false}
                    height={360}
                  />
                </div>
              </section>
            </SectionReveal>

            <SectionReveal>
              <section>
                <h2 className="text-heading-lg uppercase text-ink-primary">Pros &amp; Cons</h2>
                <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 flex items-center gap-1.5 text-body-sm font-semibold uppercase tracking-wide text-success">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Pros
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {guide.pros.map((pro) => (
                        <li key={pro} className="text-body-sm text-ink-primary">
                          — {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 flex items-center gap-1.5 text-body-sm font-semibold uppercase tracking-wide text-danger">
                      <XCircle className="h-4 w-4" aria-hidden="true" /> Considerations
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {guide.cons.map((con) => (
                        <li key={con} className="text-body-sm text-ink-primary">
                          — {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </SectionReveal>
          </div>

          <aside>
            <SectionReveal delay={0.15}>
              <div className="rounded-2xl border border-border-hairline bg-surface-sunken p-6">
                <h2 className="text-heading-md uppercase text-ink-primary">At a Glance</h2>
                <dl className="mt-4 flex flex-col gap-3 text-body-sm">
                  <div className="flex justify-between border-b border-border-hairline pb-2">
                    <dt className="text-ink-secondary">City</dt>
                    <dd className="font-medium text-ink-primary">{guide.cityLabel}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border-hairline pb-2">
                    <dt className="text-ink-secondary">Live Listings</dt>
                    <dd className="font-tabular-nums font-medium text-ink-primary">{listings.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-secondary">Amenities Tracked</dt>
                    <dd className="font-tabular-nums font-medium text-ink-primary">{guide.amenities.length}</dd>
                  </div>
                </dl>
                <Link href={`/properties?area=${guide.slug}`} className="mt-5 inline-flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
                  Search Listings in {guide.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </SectionReveal>
          </aside>
        </div>

        {listings.length > 0 && (
          <section className="mt-16">
            <SurveyLine className="mb-8" />
            <h2 className="text-display-sm">Sample Listings in {guide.name}</h2>
            <StaggerGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.slice(0, 6).map((p) => (
                <StaggerItem key={p.id}>
                  <PropertyCard property={p} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}
      </div>
    </div>
  );
}
