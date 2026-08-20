"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { Property } from "@/types";
import { PropertyImage } from "@/components/media/property-image";
import { PriceTag } from "@/components/property/price-tag";
import { AreaTag } from "@/components/property/area-tag";
import { Button } from "@/components/ui/button";

const COMMON_AMENITIES = ["24/7 Security", "Gated Community", "Underground Electrification", "Community Park", "CCTV Surveillance"];

export function CompareTable({ properties, onRemove }: { properties: Property[]; onRemove: (id: string) => void }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th scope="col" className="w-40 border-b border-border-hairline p-3 text-left align-bottom text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">
              Property
            </th>
            {properties.map((p) => (
              <th key={p.id} scope="col" className="border-b border-border-hairline p-3 align-bottom">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remove ${p.title} from comparison`}
                    className="absolute right-1 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-800 shadow-card hover:text-danger"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <div className="relative aspect-[4/3] w-52 overflow-hidden rounded-xl bg-navy-100">
                    {p.images[0] && <PropertyImage src={p.images[0].src} alt={p.images[0].alt} fill sizes="208px" className="object-cover" />}
                  </div>
                  <Link href={`/properties/${p.slug}`} className="mt-2 block max-w-52 text-left text-body-sm font-semibold normal-case tracking-normal text-ink-primary hover:text-navy-800">
                    {p.title}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <CompareRow label="Price">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3">
                <PriceTag amount={p.price} perMonth={p.priceUnit === "month"} size="sm" />
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Type">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3 text-body-sm text-ink-primary">
                {p.type}
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Area">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3">
                <AreaTag sqft={p.area.sqft} />
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Beds">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3 font-tabular-nums text-body-sm text-ink-primary">
                {p.beds ?? "—"}
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Baths">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3 font-tabular-nums text-body-sm text-ink-primary">
                {p.baths ?? "—"}
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Location">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3 text-body-sm text-ink-primary">
                {p.location.area}, {p.location.cityLabel}
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Approval">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3 text-body-sm text-ink-primary">
                {p.pakistanFields.approval}
              </td>
            ))}
          </CompareRow>
          <CompareRow label="Possession">
            {properties.map((p) => (
              <td key={p.id} className="border-b border-border-hairline p-3 text-body-sm text-ink-primary">
                {p.pakistanFields.possession}
              </td>
            ))}
          </CompareRow>
          {COMMON_AMENITIES.map((amenity) => (
            <CompareRow key={amenity} label={amenity}>
              {properties.map((p) => (
                <td key={p.id} className="border-b border-border-hairline p-3 text-body-sm">
                  {p.amenities.includes(amenity) ? (
                    <span className="text-success">Yes</span>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
              ))}
            </CompareRow>
          ))}
          <tr>
            <td className="p-3"></td>
            {properties.map((p) => (
              <td key={p.id} className="p-3">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/properties/${p.slug}`}>View Details</Link>
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th scope="row" className="border-b border-border-hairline bg-surface-sunken p-3 text-left text-body-sm font-semibold text-ink-secondary">
        {label}
      </th>
      {children}
    </tr>
  );
}
