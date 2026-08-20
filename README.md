# Eminent Enterprises × Buraq Eminent Constructors

A production-grade marketing + property-portal frontend for a Pakistani real estate group with two brands under one parent identity: **Eminent Enterprises** (real estate advisory) and **Buraq Eminent Constructors** (its construction sister company). Built with Next.js 16 (App Router), TypeScript strict mode, and Tailwind CSS v4.

Read `PLAN.md` for the design reasoning (token plan, typography, the signature "survey line" device, route map) — this README covers setup, architecture, and how to operate the codebase.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — statically generates ~144 routes
npm run start    # serve the production build
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```

No environment variables or backend are required — see "No backend, by design" below.

## Architecture

```
src/
  app/                    Next.js App Router routes (see "Route map")
  components/
    ui/                   Hand-authored shadcn-style primitives (button, card, dialog, form, …)
    layout/                Header, Footer, Breadcrumbs, WhatsApp float, mobile action bar
    brand/                 BrandShell (auto brand-skin switching) + SurveyLine (signature device)
    property/               PropertyCard, GalleryLightbox, PropertyMap, SpecTable, AgentCard, …
    project/, construction/, tools-adjacent components, areas/, insights/, compare/, home/
    forms/                  EnquiryForm (the one lead-capture form, reused everywhere)
    media/                  PropertyImage (see "Images" below)
    shared/                 UnitConverterWidget (reused by listing detail + /tools/area-converter)
  config/site.ts           SINGLE SOURCE of all brand copy, contact details, social links, nav
  data/                    Typed mock data (see "Data layer")
  lib/
    repositories/           Read functions over the mock data — this is the API-swap seam
    format-pkr.ts, area.ts, format-date.ts, whatsapp.ts, slugify.ts, utils.ts
    valuation.ts, mortgage.ts, construction-estimate.ts   Pure calculators behind the tools
    validation/lead-schema.ts   Zod schema shared by every lead form + the /api/leads route
  types/                   Strict TypeScript interfaces, barrel-exported from "@/types"
  hooks/                    useShortlist, useCompare (localStorage-backed), use-toast
  i18n/config.ts            Locale scaffold (see "Internationalisation")
messages/                  en.json / ur.json translation scaffold
PLAN.md                    Design token plan + route map + component inventory
```

### The token system

Three layers, all CSS variables, wired into Tailwind v4's native `@theme` in `src/app/globals.css`:

1. **Primitive** — raw color ramps (`--navy-50…900`, `--gold-50…800`, `--cream-50…600`, `--charcoal-50…900`).
2. **Semantic** — purpose aliases (`--surface-base`, `--ink-primary`, `--accent`, `--border-hairline`, …).
3. **Component** — a small set of component-specific tokens (`--button-primary-bg`, `--card-border`, …).

Never write a raw hex value in a component — always a semantic Tailwind class (`bg-surface-base`, `text-ink-secondary`, `border-border-hairline`) or, for the few true component tokens, `bg-[var(--button-primary-bg)]`.

**Brand switching is a token remap, not a fork.** `src/components/brand/brand-shell.tsx` sets `data-brand="buraq"` on the shell whenever the current route starts with `/construction`; `globals.css`'s `[data-brand="buraq"]` block remaps a handful of semantic tokens (cream/gold-dominant surfaces instead of navy-dominant) so the *same* header, footer, and components read as the sibling brand automatically. No page manually sets colors for Buraq — it just inherits the remap.

### The signature element — Survey Line

`src/components/brand/survey-line.tsx` — a gold hairline with surveyor's tick marks. Used as: a section divider (sparingly, 2-3 times per page), the plot-footprint reveal on hover for land-based property cards (`src/components/property/plot-footprint.tsx`), and the step-progress indicator on the Eminent Estimate multi-step tool. It is the one deliberately bold device in an otherwise disciplined system.

### Data layer — how to swap in a real API

All content is typed mock data in `src/data/*.ts`, accessed **only** through `src/lib/repositories/*.ts`. Every page imports from a repository (`getAllProperties()`, `searchProperties(filters)`, `getPropertyBySlug(slug)`, …), never from `src/data/*` directly. To swap in a real backend:

1. Keep the repository function signatures identical (they're already designed to be async-ready — swap the body for a `fetch`/DB call and mark the function `async`, then `await` its call sites).
2. Delete the corresponding `src/data/*.ts` file once its repository no longer reads from it.
3. Nothing else changes — components only ever depend on the repository's return type (the interfaces in `src/types/`), never the mock data shape.

Mock data volumes: 68 properties, 8 off-plan projects, 12 Buraq construction case studies, 6 agents, 10 area guides, 8 articles, all seeded against the real Islamabad/Rawalpindi/hill-region location hierarchy in `src/data/locations.ts`. Every illustrative statistic (agent response times, homepage trust-band counts) is marked with a `// PLACEHOLDER` comment at its definition — grep for `PLACEHOLDER` before using this as a real production dataset.

### Images — why they're SVG placeholders, not photos

`src/components/media/property-image.tsx` wraps `next/image`. Mock data stores `picsum.photos` seed URLs (the shape a real photo-CDN response takes); `PropertyImage` transparently rewrites those to `/api/placeholder` (see `src/app/api/placeholder/route.ts`), which renders a deterministic, on-brand SVG (navy/gold/cream palette, a simple architectural line motif, a surveyor's tick-mark baseline) keyed by the same seed. This means the site has **zero external network dependency for imagery** — every image request stays on your own domain. When real listing photography exists, point `PROPERTIES[].images` at real URLs and `PropertyImage`'s rewrite becomes a no-op (it only rewrites `picsum.photos` URLs; anything else passes straight through to `next/image`).

### Forms & leads

One form component, `src/components/forms/enquiry-form.tsx` (React Hook Form + Zod), used everywhere a lead is captured — listing enquiries, project brochure gates, construction CTAs, contact, overseas, list-your-property. It posts to `POST /api/leads`, which validates with the same Zod schema (`src/lib/validation/lead-schema.ts`) and returns a simulated success response (400ms delay, no real email/CRM yet — swap the body of `src/app/api/leads/route.ts` for a real integration and the contract stays the same). WhatsApp (`src/lib/whatsapp.ts`) is the primary CTA everywhere per the brief; phone call is second; the form is third.

### Maps

`src/components/property/property-map.tsx` is a thin, typed abstraction (`markers`, `center`, `zoom`, `onMarkerHover`, …) over `property-map-internal.tsx`, which is the actual Leaflet + OpenStreetMap + marker-clustering implementation, loaded client-only via `next/dynamic`. To swap to Mapbox or Google Maps later, only `property-map-internal.tsx` changes — no consumer of `<PropertyMap />` needs to change.

### Internationalisation

English ships complete across every route. Urdu ships as a **translation scaffold**, not full routing parity (a deliberate, documented scope decision — see `PLAN.md` §7):

- `messages/en.json` / `messages/ur.json` — real translated strings for navigation, common CTAs, and the homepage hero/group message.
- `src/i18n/config.ts` — locale list and direction map.
- `src/app/globals.css` has `[dir="rtl"]` rules that switch to Noto Nastaliq Urdu and drop the Latin-script uppercase/tracking treatment — verified working at `/styleguide` (the "Internationalisation" section renders live Urdu copy in a `dir="rtl"` block).

**Not yet done**, and the concrete next step: move the existing ~30 route files under a `src/app/[locale]/` segment, add `next-intl`'s middleware for locale detection/routing, wrap the root layout in `NextIntlClientProvider`, and replace hard-coded English strings with `useTranslations()` calls against the message files above. This was deliberately not retrofitted into the already-complete, fully-verified route tree under time pressure — doing so safely is a real, scoped follow-up task, not a loose end to paper over.

### Accessibility, performance, SEO

- Every interactive primitive is built on Radix UI (dialog, select, tabs, accordion, popover, toast, navigation-menu, …), so keyboard navigation, focus trapping, and ARIA wiring come from a well-tested base. Focus rings are never removed, only restyled (see `:focus-visible` in `globals.css`).
- `prefers-reduced-motion` is honoured globally via CSS for all CSS-driven transitions; the homepage's Framer Motion scroll-reveals additionally check `useReducedMotion()` explicitly (Framer Motion is JS-driven, so the CSS media query alone doesn't reach it).
- Swept for horizontal-scroll regressions across every route at 360/768/1024/1440/1920px as part of the QA pass — a `TabsList` overflow and a cramped 1024px header (main nav breakpoint moved from `lg` to `xl`) were found and fixed this way.
- Per-route `metadata` exports (title/description/OpenGraph) on every page; `RealEstateListing` + `BreadcrumbList` JSON-LD on property and project detail, `LocalBusiness` JSON-LD on `/contact`; `src/app/sitemap.ts` and `src/app/robots.ts` cover every static route and every dynamic slug.

## Route map

See `PLAN.md` §4 for the full reasoning. Summary of what's live:

| Area | Routes |
|---|---|
| Group | `/`, `/about`, `/contact`, `/overseas`, `/list-your-property`, `/privacy`, `/terms` |
| Properties | `/properties`, `/properties/[slug]`, `/shortlist`, `/compare` |
| Services | `/services`, `/services/[slug]` |
| Projects | `/projects`, `/projects/[slug]` |
| Construction | `/construction`, `/construction/services/[slug]`, `/construction/portfolio`, `/construction/portfolio/[slug]`, `/construction/estimate` |
| Tools | `/tools/eminent-estimate`, `/tools/mortgage-calculator`, `/tools/area-converter` |
| Content | `/areas`, `/areas/[slug]`, `/insights`, `/insights/[slug]` |
| System | `/sitemap.xml`, `/robots.txt`, `/styleguide` (internal design-system reference, `noindex`) |

## Where every brand constant lives

`src/config/site.ts` is the **only** place business copy, contact details, and navigation structure are defined — `CONTACT` (phone, WhatsApp, address, socials), `EMINENT` (positioning, services, why-choose, audience split, closing CTA), `BURAQ` (positioning, services, signature lines, why-choose), `GROUP` (the combined-brand homepage message), `NAV` (all navigation link structures). Nothing elsewhere in the codebase should hard-code a phone number, address, or brand headline — if you need to change one, change it here once.

## Known gaps / honest state

- **Urdu locale routing** is scaffolded but not wired into the route tree (see "Internationalisation" above).
- **Real photography**: every image is a generated placeholder (see "Images" above) — this is by design for a demo dataset, not a bug, but is the first thing to replace with real listing/project photography.
- Mock data counts (agent response times, homepage trust stats) are placeholders, clearly marked — replace with real, verified figures before using any of this copy in production marketing.
- No automated test suite exists (unit/e2e) — the QA pass for this build was manual + scripted Playwright checks (typecheck, lint, build, and a horizontal-scroll sweep across 5 breakpoints × every route), not a committed test harness.
