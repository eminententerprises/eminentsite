"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { BUY_PRICE_TIERS, RENT_PRICE_TIERS, tierFor } from "@/lib/area-pricing";
import { formatPKR } from "@/lib/format-pkr";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/components/media/property-image";
import type { AreaMapPoint } from "./area-price-map";

type Purpose = "buy" | "rent";

export default function AreaPriceMapInternal({ points }: { points: AreaMapPoint[] }) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<Purpose>("buy");

  const tiers = purpose === "buy" ? BUY_PRICE_TIERS : RENT_PRICE_TIERS;

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-3xl border border-border-hairline">
      <MapContainer
        center={[33.64, 73.03]}
        zoom={11}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => {
          const value = purpose === "buy" ? p.buyPricePerMarla : p.rentPricePerMarla;
          const count = purpose === "buy" ? p.buyListingCount : p.rentListingCount;
          const tier = tierFor(value, tiers);
          const image = (purpose === "buy" ? p.buyImage : p.rentImage) ?? p.fallbackImage;
          return (
            <CircleMarker
              key={p.slug}
              center={[p.lat, p.lng]}
              radius={13}
              pathOptions={{ color: "#ffffff", weight: 2, fillColor: tier.color, fillOpacity: 0.88 }}
              eventHandlers={{
                click: () => router.push(`/properties?area=${p.slug}&purpose=${purpose}`),
              }}
            >
              <Tooltip direction="top" offset={[0, -16]} opacity={1} className="area-tooltip-card">
                <div className="w-[210px] overflow-hidden rounded-2xl border border-white/60 bg-white font-body shadow-[0_12px_32px_rgba(41,31,118,0.22)]">
                  <div className="relative h-28 w-full bg-navy-100">
                    <PropertyImage src={image.src} alt={image.alt} fill sizes="210px" className="object-cover" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-navy-900/70 to-transparent" />
                    <span className="absolute bottom-1.5 left-2.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white">
                      {count} {count === 1 ? "Listing" : "Listings"}
                    </span>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="font-semibold text-navy-900">{p.name}</p>
                    <p className="text-xs text-ink-secondary">{p.cityLabel}</p>
                    <p className="mt-1 font-tabular-nums font-semibold text-navy-800">
                      {formatPKR(value, { perMonth: purpose === "rent" }).short} / Marla
                    </p>
                    <p className="text-xs text-ink-muted">Click to explore</p>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Buy / Rent toggle */}
      <div className="glass-panel-light absolute left-4 top-4 z-[500] flex gap-1 rounded-full p-1">
        {(["buy", "rent"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPurpose(p)}
            className={cn(
              "rounded-full px-4 py-2 text-body-sm font-semibold uppercase tracking-wide transition-colors",
              purpose === p ? "bg-accent text-navy-900" : "text-ink-secondary hover:text-navy-800",
            )}
          >
            {p === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="glass-panel-light absolute bottom-4 left-4 z-[500] rounded-2xl p-4">
        <p className="text-label font-semibold uppercase tracking-widest text-ink-secondary">
          {purpose === "buy" ? "Price / Marla" : "Rent / Marla / Month"}
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {tiers.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-full border border-white/70" style={{ backgroundColor: t.color }} />
              <span className="text-body-sm text-ink-primary">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
