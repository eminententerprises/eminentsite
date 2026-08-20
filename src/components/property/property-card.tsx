import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin, ShieldCheck } from "lucide-react";
import type { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/property/price-tag";
import { AreaTag } from "@/components/property/area-tag";
import { ShortlistButton } from "@/components/property/shortlist-button";
import { CompareButton } from "@/components/property/compare-button";
import { PlotFootprint } from "@/components/property/plot-footprint";
import { PropertyImage } from "@/components/media/property-image";
import { cn } from "@/lib/utils";

const LAND_BASED_TYPES = new Set([
  "House",
  "Farm House",
  "Residential Plot",
  "Commercial Plot",
  "Plot File",
  "Agricultural Land",
]);

export function PropertyCard({ property, className, featuredLayout = false }: { property: Property; className?: string; featuredLayout?: boolean }) {
  const cover = property.images[0];
  const showFootprint = LAND_BASED_TYPES.has(property.type);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-[var(--card-bg)] shadow-[var(--card-shadow)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)]",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden bg-navy-100", featuredLayout ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <Link href={`/properties/${property.slug}`} className="absolute inset-0 z-0" tabIndex={-1} aria-hidden="true" />
        {cover && (
          <PropertyImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={featuredLayout ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-2/3 bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {property.isFeatured && <Badge variant="accent">Featured</Badge>}
          <Badge variant="neutral">{property.purpose === "buy" ? "For Sale" : "For Rent"}</Badge>
        </div>
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <ShortlistButton propertyId={property.id} />
          <CompareButton propertyId={property.id} />
        </div>

        {showFootprint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center bg-navy-900/85 py-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <PlotFootprint sqft={property.area.sqft} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <PriceTag amount={property.price} perMonth={property.priceUnit === "month"} />
          {property.isVerified && (
            <span className="flex items-center gap-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-success">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
            </span>
          )}
        </div>

        <Link href={`/properties/${property.slug}`} className="line-clamp-2 text-body-md font-semibold text-ink-primary hover:text-navy-800">
          {property.title}
        </Link>

        <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
          {property.location.area}, {property.location.cityLabel}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border-hairline pt-3">
          {typeof property.beds === "number" && (
            <span className="flex items-center gap-1 text-body-sm text-ink-secondary">
              <BedDouble className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {property.beds}
            </span>
          )}
          {typeof property.baths === "number" && (
            <span className="flex items-center gap-1 text-body-sm text-ink-secondary">
              <Bath className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {property.baths}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <AreaTag sqft={property.area.sqft} />
          </span>
        </div>
      </div>
    </article>
  );
}
