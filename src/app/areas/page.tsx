import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAllAreaGuides } from "@/lib/repositories/area-repository";
import { CITIES, CITY_LABELS } from "@/data/locations";
import type { CityKey } from "@/types";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PropertyImage } from "@/components/media/property-image";
import { SurveyLine } from "@/components/brand/survey-line";
import { formatPKR } from "@/lib/format-pkr";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export const metadata: Metadata = {
  title: "Area Guides",
  description: "Explore local market guides for Islamabad, Rawalpindi and the hill regions — price trends, amenities and sample listings by area.",
};

export default function AreasPage() {
  const guides = getAllAreaGuides();
  const byCity = (city: CityKey) => guides.filter((g) => g.city === city);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Area Guides" }]} />

      <SectionReveal>
        <div className="mt-4 max-w-2xl">
          <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Local Market Knowledge</p>
          <h1 className="mt-2 text-display-lg">Area Guides</h1>
          <p className="mt-4 text-body-lg text-ink-secondary">
            Price trends, amenities and sample listings for the societies and sectors we know best across the twin cities and hill regions.
          </p>
        </div>
      </SectionReveal>

      {CITIES.map((city) => {
        const cityGuides = byCity(city);
        if (cityGuides.length === 0) return null;
        return (
          <section key={city} className="mt-14">
            <div className="flex items-center gap-3">
              <h2 className="text-display-sm">{CITY_LABELS[city]}</h2>
              <SurveyLine className="max-w-[160px]" />
            </div>
            <StaggerGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cityGuides.map((guide) => (
                <StaggerItem key={guide.slug}>
                  <Link
                    href={`/areas/${guide.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-surface-raised shadow-card transition-shadow hover:shadow-raised"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
                      <PropertyImage
                        src={guide.heroImage}
                        alt={guide.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
                        <MapPin className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" /> {guide.cityLabel}
                      </p>
                      <p className="font-semibold text-ink-primary">{guide.name}</p>
                      <p className="line-clamp-2 text-body-sm text-ink-secondary">{guide.summary}</p>
                      <p className="mt-auto font-tabular-nums text-body-sm font-semibold text-navy-800">
                        {formatPKR(guide.avgPriceByType[0]?.pricePerMarla ?? 0).short} / Marla avg.
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        );
      })}
    </div>
  );
}
