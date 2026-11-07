import { WEB_BASE_URL } from "@/lib/api";

/**
 * Port of the website's PropertyImage src rewrite
 * (src/components/media/property-image.tsx). Demo data stores picsum.photos
 * seeds; those resolve to a curated, category-appropriate Unsplash photo, so
 * every image matches the website exactly. Real uploads (Supabase Storage
 * URLs) pass through untouched.
 */
const PHOTO_POOLS = {
  skyline: [
    "1449824913935-59a10b8d2000",
    "1477959858617-67f85cf4f1df",
    "1449034446853-66c86144b0ad",
    "1444723121867-7a241cacace9",
    "1567157577867-05ccb1388e66",
  ],
  exterior: [
    "1600596542815-ffad4c1539a9",
    "1600585154340-be6161a56a0c",
    "1613977257363-707ba9348227",
    "1512917774080-9991f1c4c750",
    "1570129477492-45c003edd2be",
    "1580587771525-78b9dba3b914",
    "1600585154526-990dced4db0d",
  ],
  interior: [
    "1618221195710-dd6b41faaea6",
    "1600210492486-724fe5c67fb0",
    "1616486338812-3dadae4b4ace",
    "1556911220-e15b29be8c8f",
    "1600489000022-c2086d79f9d4",
    "1616594039964-ae9021a400a0",
    "1560448204-e02f11c3d0e2",
    "1600607687939-ce8a6c25118c",
  ],
  construction: ["1541888946425-d81bb19240f5", "1503387762-592deb58ef4e", "1541976590-713941681591"],
  portrait: [
    "1560250097-0b93528c311a",
    "1507003211169-0a1dd7228f2d",
    "1573497019940-1c28c88b4f3e",
    "1519085360753-af0119f7cbe7",
    "1580489944761-15a19d654956",
    "1500648767791-00dcc994a43e",
    "1544005313-94ddf0286df2",
    "1573496359142-b8d87734a5a2",
  ],
} as const;

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

function categoryFor(seed: string): keyof typeof PHOTO_POOLS | "plan" {
  if (seed.endsWith("-plan")) return "plan";
  if (seed.startsWith("agent-")) return "portrait";
  if (seed.startsWith("areaguide-") || seed.startsWith("article-") || seed.includes("skyline")) return "skyline";
  if (/-before-\d+$/.test(seed)) return "construction";
  if (seed.endsWith("-1")) return "exterior";
  return hashSeed(seed) % 2 === 0 ? "exterior" : "interior";
}

export function resolveImageSrc(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("/")) return `${WEB_BASE_URL}${src}`;
  const match = src.match(/picsum\.photos\/seed\/([^/]+)\/(\d+)\/(\d+)/);
  if (!match) return src;
  const [, seed, w, h] = match;
  const category = categoryFor(seed);
  if (category === "plan") {
    return `${WEB_BASE_URL}/api/placeholder?seed=${encodeURIComponent(seed)}&w=${w}&h=${h}`;
  }
  const pool = PHOTO_POOLS[category];
  const photoId = pool[hashSeed(seed) % pool.length];
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&crop=entropy&q=80&auto=format`;
}

export function seedImage(seed: string, w = 1200, h = 800): string {
  return resolveImageSrc(`https://picsum.photos/seed/${seed}/${w}/${h}`)!;
}
