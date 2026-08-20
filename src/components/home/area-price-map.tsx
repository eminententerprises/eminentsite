"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export interface AreaMapPoint {
  slug: string;
  name: string;
  city: "islamabad" | "rawalpindi";
  cityLabel: string;
  lat: number;
  lng: number;
  /** PKR, illustrative */
  buyPricePerMarla: number;
  buyListingCount: number;
  /** PKR/month, illustrative — derived from buyPricePerMarla, see src/lib/area-pricing.ts */
  rentPricePerMarla: number;
  rentListingCount: number;
  /** Cover photo of a real listing in this area, when one exists for the given purpose. */
  buyImage?: { src: string; alt: string };
  rentImage?: { src: string; alt: string };
  /** Always present — a representative area photo, used when there's no listing to show yet. */
  fallbackImage: { src: string; alt: string };
}

const AreaPriceMapInternal = dynamic(() => import("./area-price-map-internal"), {
  ssr: false,
  loading: () => <Skeleton style={{ height: 520 }} className="w-full rounded-3xl" />,
});

export function AreaPriceMap({ points }: { points: AreaMapPoint[] }) {
  return <AreaPriceMapInternal points={points} />;
}
