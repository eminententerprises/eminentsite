"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  /** short label rendered on the pin, e.g. "PKR 85 Lakh" */
  label: string;
}

export interface PropertyMapProps {
  markers: MapMarker[];
  activeId?: string;
  onMarkerHover?: (id: string | null) => void;
  onMarkerClick?: (id: string) => void;
  height?: number | string;
  fitToMarkers?: boolean;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

/**
 * Map provider abstraction. Internals are OpenStreetMap + Leaflet today;
 * every consumer of this component only ever sees `PropertyMapProps`, so
 * swapping the provider (Mapbox, Google Maps) later means rewriting
 * property-map-internal.tsx only.
 */
const PropertyMapInternal = dynamic(() => import("./property-map-internal"), {
  ssr: false,
  loading: () => <Skeleton style={{ height: 480 }} className="w-full" />,
});

export function PropertyMap(props: PropertyMapProps) {
  return (
    <div className={props.className}>
      <PropertyMapInternal {...props} />
    </div>
  );
}
