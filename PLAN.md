# PLAN — Eminent Enterprises × Buraq Eminent Constructors

## 0. Method

Two-pass design process per `frontend-design`: brainstorm a token/type/layout/signature plan, critique it against the brief, revise, then build. Both passes are recorded below so the reasoning survives, not just the output.

---

## 1. Design brainstorm (pass 1)

**Positioning read.** Eminent Enterprises is described as "institutional, data-forward" — an advisory firm, not a marketplace toy. Buraq is "warmer, editorial, tactile." The brief explicitly bans the cream+serif+terracotta combo, gradient blobs, glass cards, emoji icons, and decorative 01/02/03 numbering. It asks for ONE signature device, tabular figures for money/area, and a heavy condensed uppercase headline register carried through from the brochure copy ("YOUR PROPERTY. OUR EXPERTISE. LASTING VALUE.").

**Color.** Use the seven supplied hex values as seeds, expand each into a 50–900 primitive ramp (`--navy-50…900`, `--gold-50…900`, `--cream-50…900`, `--charcoal-50…900`). Semantic layer maps purpose → primitive (`--color-surface-base`, `--color-surface-inverted`, `--color-surface-warm`, `--color-text-primary`, `--color-accent`, `--color-border-hairline`…). Component layer maps semantic → component (`--button-primary-bg`, `--card-border`, `--nav-surface`…). Eminent pages default to navy-dominant surfaces with gold as a disciplined accent (never a wash). Buraq pages flip the ratio: cream/paper-dominant surfaces, gold used more generously (rules, tags, hover), navy pulled back to text and structural lines only. Same token *names*, different token *values per brand scope* via a `data-brand="eminent" | "buraq"` attribute on `<html>` that remaps a handful of semantic tokens — this is how the two stay siblings, not clones, without a second palette.

**Typography.** Three faces, no Inter:
- Display — **Big Shoulders Display** (condensed, heavy, built for uppercase authority; reads like a surveyor's stencil, matches "YOUR PROPERTY. OUR EXPERTISE." register).
- Body — **Public Sans** (humanist, high x-height, excellent at small sizes, distinct from Inter/Roboto/Arial, has the weight range for institutional body copy).
- Tabular utility — **JetBrains Mono** (real tabular figures, used only for prices, areas, stats, schedules — never for prose). `font-variant-numeric: tabular-nums` enforced via utility class regardless.
- Buraq-only accent — **Fraunces** italic, used sparingly and *only* for the four signature lines and pull-quotes, never for headings or body. This is what gives Buraq its "editorial" warmth without turning it into a serif brand (which would collide with the banned cliché).
- Urdu — **Noto Nastaliq Urdu** for `ur` locale (heading and body), with RTL layout flip via `dir="rtl"` and logical CSS properties throughout.

**Signature element — the Survey Line.** A gold hairline with perpendicular surveyor's tick marks and an optional dimension label, rendered as an inline SVG component (`<SurveyLine />`). It does three jobs, not one decorative job:
1. Section-to-section divider (replaces generic `<hr>`/spacing gaps) — literally "measures" the page.
2. On property cards: a hover state reveals a to-scale plot-footprint rectangle with the marla/kanal dimension printed on the survey line beneath it.
3. As the scroll-position indicator in the gallery lightbox and multi-step forms (a survey line that fills like a tape measure).

This is one device, functionally justified (real estate = surveying), used with restraint — everything else (cards, nav, buttons) stays quiet and rectilinear.

**Layout.** Hero is a search instrument, not a photo carousel: an asymmetric split — large image right, dense search card left, overlapping the image edge by a fixed offset (breaks the centered-hero cliché). Section rhythm alternates full-bleed navy-ink bands and paper/cream bands so the page has visible structure when skimmed. Cards vary in weight deliberately (a featured listing spans 2 cols with a larger price block; standard cards are compact) rather than a uniform grid of identical tiles.

---

## 2. Critique against the brief (pass 2)

- Big Shoulders + Public Sans + JetBrains Mono: none of the three appear in the brief's banned list, none is Space Grotesk, each has a distinct job. **Keep.**
- Risk: Fraunces italic on a cream surface edges toward the banned "cream + serif" cliché. **Mitigation:** Fraunces never sets a heading, never sets body copy, never appears at size on its own — it is confined to short accent lines (signature quotes) inside an otherwise condensed-sans, gold-hairline system. Headlines on Buraq pages still use Big Shoulders Display, same as Eminent, just warmer surface + more generous gold. This keeps the two brands as siblings.
- Survey-line device is grounded in the domain (plots are literally surveyed and measured) rather than being decoration for its own sake — satisfies "spend your boldness on one thing, keep everything else disciplined" and avoids the banned decorative-numbering pattern.
- Tabular JetBrains Mono for price/area figures directly answers the "prices and areas must use tabular numerals" requirement and reinforces "data-forward" positioning.
- Data-attribute brand remap (`data-brand`) keeps one Tailwind theme, one component set, and enforces that a real design-system swap (Eminent ⇄ Buraq) is a token change, not a fork — matches the three-layer token requirement and the "one repository layer, one config file" spirit of the whole brief.
- Dropped from pass 1: considered a full second typeface family per brand (a true serif brand for Buraq). Rejected — it would fight the "same tokens, different rhythm" instruction and risk the banned cliché outright.

**Decision: proceed with the above token/type/signature system.**

---

## 3. Token architecture (three layers)

```
Primitive   --navy-950…50, --gold-950…50, --cream-950…50, --charcoal-950…50, --paper, spacing scale, radii, shadows, font families
Semantic    --color-surface-base/raised/inverted/warm, --color-text-primary/secondary/inverted/muted,
            --color-accent/accent-strong, --color-border-hairline/strong, --color-success/warning/danger/info
Component   --button-primary-bg/fg/hover, --card-bg/border/shadow, --nav-surface/fg, --input-border/focus,
            --badge-*, --tag-*, --map-pin-*
```

All exposed as CSS variables in `globals.css`, consumed by Tailwind via `tailwind.config.ts` `theme.extend` referencing `var(--token)`. No raw hex inside component files — enforced by convention + a grep check before each phase's commit.

`data-brand="eminent"` (default) vs `data-brand="buraq"` on the `<html>` (or a page-level wrapper) remaps: `--color-surface-base`, `--color-surface-warm-ratio`, `--color-accent-emphasis`, `--nav-surface`, section background sequence.

---

## 4. Route map

See brief §5 verbatim — implementing all routes listed. Priority build order (depth-first on the routes that carry the most functional weight, breadth second):

**Foundation (phase 2–4):** shell, tokens, styleguide, types, mock data, repositories, utils.
**Phase 5–6:** `/properties`, `/properties/[slug]` (highest functional depth — filters, map, gallery).
**Phase 7:** `/projects`, `/projects/[slug]` (payment plan).
**Phase 8:** `/construction` + its services/portfolio (second brand skin proof point).
**Phase 9:** `/tools/*` (Eminent Estimate, mortgage calculator, area converter, construction estimator).
**Phase 10:** `/areas/*`, `/insights/*`, `/about`, `/contact`, `/overseas`, `/list-your-property`, `/shortlist`, `/compare`, `/`, legal pages.
**Phase 11:** motion, a11y, SEO, performance, responsive QA passes.
**Phase 12:** README.

---

## 5. Component inventory (shared, cross-route)

Layout: `Header` (brand switcher, mega-menu, mobile sheet), `Footer`, `WhatsAppFloat`, `MobileActionBar`, `Breadcrumbs`.
Marketing: `Hero`, `SectionBand`, `SurveyLine`, `PillarStrip`, `TrustBand`, `CTASection`, `BrandSplitPanel`.
Property: `PropertyCard`, `PropertyGrid`, `FilterRail`, `SortBar`, `PropertyMap`, `GalleryLightbox`, `SpecTable`, `AgentCard`, `PriceTag` (tabular, lakh/crore), `AreaTag` (unit-aware), `ShortlistButton`, `CompareButton`, `WhatsAppCTA`.
Project: `PaymentPlanTable`, `ProgressTimeline`, `BrochureGateForm`.
Construction: `BeforeAfterSlider`, `ProcessTimeline`, `CaseStudyCard`.
Tools: `MultiStepForm`, `ValuationResultCard`, `AmortisationTable`, `UnitConverterWidget`.
Form: RHF+Zod wrappers over shadcn `Form`, `CallbackSheet`.
Utility: `formatPKR`, `convertArea`, `slugify`, `buildWhatsAppLink`, `cn`.

---

## 6. Data model & mock data

Types in `/src/types/*.ts` per brief §7. Mock data in `/src/data/*.ts`, ≥ the minimums specified, behind `/src/lib/repositories/*.ts` (`propertyRepository.ts`, `projectRepository.ts`, `constructionRepository.ts`, `agentRepository.ts`, `areaRepository.ts`, `articleRepository.ts`) — each exports plain functions (`getAll`, `getBySlug`, `search(filters)`) so a real API swap touches only these files. Placeholder stats explicitly marked `// PLACEHOLDER` in the data file.

---

## 7. What's explicitly out of scope / simplified (flag for review)

- No real map tiles beyond OSM/Leaflet default styling — no custom map skin.
- No real payment gateway / auth — this is a marketing + lead-gen portal, not a transacting platform, per brief.
- Urdu (`ur`) ships as a translation scaffold (`next-intl` message files + RTL verified on a couple of representative routes), not full parity on every string — brief allows this explicitly.
- Lighthouse ≥ 90 and full CLS/a11y audit happen as an explicit phase-11 pass, not continuously re-verified after every single component (would not be time-tractable) — will spot-check key routes (home, properties, listing detail) with real tooling.

I will report after each phase: what shipped, what was cut, what needs your input.
