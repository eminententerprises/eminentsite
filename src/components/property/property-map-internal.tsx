"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { MapMarker } from "./property-map";

function pinIcon(label: string, active: boolean): L.DivIcon {
  return L.divIcon({
    className: "eminent-map-pin",
    html: `<div style="
      display:inline-flex;align-items:center;
      background:${active ? "#0b1f45" : "#ffffff"};
      color:${active ? "#ffffff" : "#0b1f45"};
      border:1.5px solid ${active ? "#0b1f45" : "#c4a052"};
      padding:3px 8px;font-family:var(--font-tabular);font-size:11px;font-weight:600;
      white-space:nowrap;box-shadow:0 1px 4px rgba(11,31,69,0.35);
    ">${label}</div>`,
    iconSize: undefined,
    iconAnchor: [20, 12],
  });
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [markers, map]);
  return null;
}

export default function PropertyMapInternal({
  markers,
  activeId,
  onMarkerHover,
  onMarkerClick,
  height = 480,
  fitToMarkers = true,
  center = [33.6844, 73.0479],
  zoom = 11,
}: {
  markers: MapMarker[];
  activeId?: string;
  onMarkerHover?: (id: string | null) => void;
  onMarkerClick?: (id: string) => void;
  height?: number | string;
  fitToMarkers?: boolean;
  center?: [number, number];
  zoom?: number;
}) {
  const icons = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    markers.forEach((m) => {
      cache.set(m.id, pinIcon(m.label, m.id === activeId));
    });
    return cache;
  }, [markers, activeId]);

  return (
    <div style={{ height }} className="relative w-full overflow-hidden rounded-2xl border border-border-hairline">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fitToMarkers && <FitBounds markers={markers} />}
        <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} maxClusterRadius={50}>
          {markers.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={icons.get(m.id)}
              eventHandlers={{
                mouseover: () => onMarkerHover?.(m.id),
                mouseout: () => onMarkerHover?.(null),
                click: () => onMarkerClick?.(m.id),
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
