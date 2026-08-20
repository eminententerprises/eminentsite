import type { Metadata } from "next";
import Link from "next/link";
import { searchProperties } from "@/lib/repositories/property-repository";
import { parseFilters } from "@/lib/property-filters-url";
import { PropertyResults } from "@/components/property/property-results";
import { FilterRail } from "@/components/property/filter-rail";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search Properties",
  description: "Search houses, apartments, plots and commercial properties for sale and rent across Islamabad, Rawalpindi and the hill regions.",
};

const PURPOSE_TABS: { label: string; href: string; purpose?: "buy" | "rent" }[] = [
  { label: "Buy", href: "/properties?purpose=buy", purpose: "buy" },
  { label: "Rent", href: "/properties?purpose=rent", purpose: "rent" },
  { label: "New Projects", href: "/projects" },
];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const filters = parseFilters(resolvedParams);
  const { results, total } = await searchProperties(filters);

  const activeFilterCount =
    (filters.types?.length ?? 0) +
    (filters.areas?.length ?? 0) +
    (filters.approval?.length ?? 0) +
    (filters.possession?.length ?? 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.areaMin ? 1 : 0) +
    (filters.areaMax ? 1 : 0) +
    (filters.beds ? 1 : 0) +
    (filters.baths ? 1 : 0) +
    (filters.keyword ? 1 : 0) +
    (filters.addedWithinDays ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Properties" }]} />

      <div className="mt-4 flex w-fit flex-wrap gap-1 rounded-full border border-border-hairline bg-surface-sunken p-1">
        {PURPOSE_TABS.map((tab) => {
          const isActive = tab.purpose !== undefined && filters.purpose === tab.purpose;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "rounded-full px-4 py-2 text-body-sm font-semibold uppercase tracking-wide transition-colors",
                isActive ? "bg-accent text-ink-on-accent" : "text-ink-secondary hover:text-navy-800",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterRail />
          </div>
        </aside>

        <div>
          <PropertyResults
            key={JSON.stringify({ ...filters, page: undefined })}
            initialResults={results}
            initialTotal={total}
            filters={filters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>
    </div>
  );
}
