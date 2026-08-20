import { NextRequest } from "next/server";

/**
 * Deterministic, on-brand placeholder imagery. The mock data in src/data/*
 * points at picsum.photos seeds (the shape a real photo-CDN response would
 * take); this route renders a branded SVG for that same seed instead of
 * fetching from an external host, so the whole site works with zero
 * external network dependency for imagery — swap PropertyImage's rewrite
 * back off when real listing photography is wired up.
 */

const PALETTES = [
  { bg: "#0B1F45", bg2: "#172A47", line: "#C4A052", ink: "rgba(255,255,255,0.08)" },
  { bg: "#F4F1E8", bg2: "#EAE4D2", line: "#0B1F45", ink: "rgba(11,31,69,0.08)" },
  { bg: "#101C3D", bg2: "#0B1F45", line: "#DCC48A", ink: "rgba(255,255,255,0.07)" },
  { bg: "#FBF6EC", bg2: "#F5EAD2", line: "#8A6D30", ink: "rgba(139,109,48,0.10)" },
  { bg: "#1A1A1A", bg2: "#333029", line: "#C4A052", ink: "rgba(255,255,255,0.06)" },
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function buildSvg(seed: string, width: number, height: number): string {
  const hash = hashSeed(seed);
  const palette = PALETTES[hash % PALETTES.length];
  const ticks = 14;
  const gapX = width / ticks;

  const roofPeakX = width * 0.5;
  const roofY = height * 0.32;
  const baseY = height * 0.72;
  const leftX = width * 0.32;
  const rightX = width * 0.68;

  let tickMarks = "";
  for (let i = 0; i <= ticks; i++) {
    const x = i * gapX;
    tickMarks += `<line x1="${x}" y1="${height - 18}" x2="${x}" y2="${height - (i % 4 === 0 ? 30 : 24)}" stroke="${palette.line}" stroke-width="1" opacity="0.55" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Placeholder property image">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.bg}" />
        <stop offset="100%" stop-color="${palette.bg2}" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)" />
    <g opacity="0.9">
      <polyline points="${leftX},${baseY} ${leftX},${roofY + (baseY - roofY) * 0.35} ${roofPeakX},${roofY} ${rightX},${roofY + (baseY - roofY) * 0.35} ${rightX},${baseY} ${leftX},${baseY}" fill="none" stroke="${palette.line}" stroke-width="2" opacity="0.5" />
      <line x1="${leftX}" y1="${baseY}" x2="${rightX}" y2="${baseY}" stroke="${palette.line}" stroke-width="2" opacity="0.5" />
    </g>
    <line x1="0" y1="${height - 16}" x2="${width}" y2="${height - 16}" stroke="${palette.line}" stroke-width="1.5" opacity="0.6" />
    ${tickMarks}
    <rect width="${width}" height="${height}" fill="${palette.ink}" />
  </svg>`;
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const seed = searchParams.get("seed") ?? "eminent";
  const width = clampDimension(searchParams.get("w"), 1200);
  const height = clampDimension(searchParams.get("h"), 800);

  const svg = buildSvg(seed, width, height);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

function clampDimension(value: string | null, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.max(Math.round(n), 32), 2400);
}
