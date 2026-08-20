import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPinned,
  TrendingUp,
  ShieldCheck,
  Handshake,
  ArrowRight,
  Globe2,
  Home as HomeIcon,
  KeyRound,
  Building2,
  HardHat,
} from "lucide-react";
import { EMINENT, BURAQ, GROUP } from "@/config/site";
import { getFeaturedProperties, searchProperties } from "@/lib/repositories/property-repository";
import { getFeaturedConstructionProjects } from "@/lib/repositories/construction-repository";
import { getAllArticles } from "@/lib/repositories/article-repository";
import { TRUST_STATS } from "@/data/trust-stats";
import { LOCATIONS } from "@/data/locations";
import { estimateMonthlyRentPerMarla } from "@/lib/area-pricing";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyImage } from "@/components/media/property-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SurveyLine } from "@/components/brand/survey-line";
import { HeroSearch } from "@/components/home/hero-search";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Marquee } from "@/components/shared/marquee";
import { AreaPriceMap, type AreaMapPoint } from "@/components/home/area-price-map";
import { CardMarquee } from "@/components/shared/card-marquee";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Eminent Enterprises is a trusted real estate advisory and property services firm in Islamabad & Rawalpindi, working alongside Buraq Eminent Constructors.",
};

const PILLAR_ICONS = [MapPinned, TrendingUp, ShieldCheck, Handshake];

const PATHWAYS = [
  { label: "Buy", href: "/properties?purpose=buy", icon: HomeIcon },
  { label: "Rent", href: "/properties?purpose=rent", icon: KeyRound },
  { label: "New Projects", href: "/projects", icon: Building2 },
  { label: "Build with Buraq", href: "/construction", icon: HardHat },
];

export default function HomePage() {
  const featuredProperties = getFeaturedProperties(8);
  const featuredProjects = getFeaturedConstructionProjects(3);
  const articles = getAllArticles().slice(0, 3);

  const areaMapPoints: AreaMapPoint[] = LOCATIONS.filter(
    (l): l is typeof l & { city: "islamabad" | "rawalpindi" } => l.city === "islamabad" || l.city === "rawalpindi",
  ).map((l) => {
    const buySearch = searchProperties({ areas: [l.slug], purpose: "buy" });
    const rentSearch = searchProperties({ areas: [l.slug], purpose: "rent" });
    const buyCover = buySearch.results[0]?.images[0];
    const rentCover = rentSearch.results[0]?.images[0];

    return {
      slug: l.slug,
      name: l.name,
      city: l.city,
      cityLabel: l.cityLabel,
      lat: l.coords.lat,
      lng: l.coords.lng,
      buyPricePerMarla: l.basePricePerMarla,
      buyListingCount: buySearch.total,
      rentPricePerMarla: estimateMonthlyRentPerMarla(l.basePricePerMarla),
      rentListingCount: rentSearch.total,
      buyImage: buyCover ? { src: buyCover.src, alt: buyCover.alt } : undefined,
      rentImage: rentCover ? { src: rentCover.src, alt: rentCover.alt } : undefined,
      fallbackImage: { src: `https://picsum.photos/seed/areaguide-${l.slug}/600/400`, alt: `${l.name}, ${l.cityLabel}` },
    };
  });

  return (
    <div>
      {/* HERO — full-bleed, centered, floating glass search */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <PropertyImage
            src="https://picsum.photos/seed/eminent-hero-skyline/1920/1200"
            alt="Aerial view of a planned housing sector in Islamabad"
            fill
            sizes="100vw"
            priority
            className="animate-ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/85 via-navy-900/60 to-navy-950/92" />
        </div>
        <div className="hero-glow" />

        <div className="relative mx-auto flex max-w-[1100px] flex-col items-center px-4 pb-6 pt-20 text-center sm:px-6 sm:pt-28">
          <SectionReveal>
            <p className="text-label font-semibold uppercase tracking-[0.3em] text-accent">{EMINENT.positioning}</p>
            <h1 className="mx-auto mt-4 max-w-3xl text-display-lg text-paper sm:text-display-xl">{EMINENT.heroHeadline}</h1>
            <p className="mx-auto mt-5 max-w-xl text-body-lg text-ink-inverted-muted">{EMINENT.subPositioningBody}</p>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.25}>
          <div className="relative mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
            <HeroSearch />
          </div>
        </SectionReveal>

        <div className="relative flex justify-center pb-8" aria-hidden="true">
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
          </span>
        </div>
      </section>

      <div className="border-y border-border-hairline bg-surface-sunken py-4">
        <Marquee items={[...EMINENT.pillars]} />
      </div>

      <SurveyLine className="mx-auto my-2 max-w-[1440px] px-4 sm:px-6" />

      {/* GROUP positioning + PATHWAYS */}
      <SectionReveal>
        <section className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-display-md">{GROUP.headline}</h2>
          <p className="mx-auto mt-3 line-clamp-2 max-w-xl text-body-lg text-ink-secondary">{GROUP.body}</p>

          <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PATHWAYS.map((p) => (
              <StaggerItem key={p.label}>
                <Link
                  href={p.href}
                  className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-border-hairline bg-gradient-to-br from-white to-sky-50 px-4 py-8 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-raised"
                >
                  <div
                    className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-sky-300/40 blur-2xl transition-transform duration-500 group-hover:scale-125"
                    aria-hidden="true"
                  />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-400 to-iris-600 text-white shadow-[0_8px_20px_rgba(86,56,201,0.3)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-body-sm font-semibold uppercase tracking-wide text-ink-primary">{p.label}</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </SectionReveal>

      {/* TWO-BRAND SPLIT */}
      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-4 pb-4 sm:px-6 md:grid-cols-2">
        <SectionReveal>
          <div className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-iris-50 to-white px-6 py-14 sm:px-10">
            <div>
              <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Real Estate Advisory</p>
              <h3 className="mt-3 text-display-sm text-navy-800">{EMINENT.name}</h3>
              <p className="mt-4 line-clamp-3 max-w-md text-body-md text-ink-secondary">{EMINENT.boilerplate}</p>
            </div>
            <Button asChild size="lg" className="w-fit">
              <Link href="/properties">
                Explore Properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-cream-200 to-white px-6 py-14 sm:px-10">
            <div>
              <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Construction</p>
              <h3 className="mt-3 text-display-sm text-ink-primary">{BURAQ.name}</h3>
              <p className="mt-4 line-clamp-3 max-w-md text-body-md text-ink-secondary">{BURAQ.intro}</p>
            </div>
            <Button asChild variant="outline" size="lg" className="w-fit">
              <Link href="/construction">
                Discover Buraq <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </SectionReveal>
      </section>

      {/* FEATURED LISTINGS */}
      {featuredProperties.length > 0 && (
        <SectionReveal>
          <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Handpicked</p>
                <h2 className="mt-2 text-display-sm">Featured Listings</h2>
              </div>
              <Link href="/properties" className="flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
                View All Properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <CardMarquee className="mt-8" itemClassName="w-[280px] shrink-0 sm:w-[320px]" durationSeconds={50}>
              {featuredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} className="w-full" />
              ))}
            </CardMarquee>
          </section>
        </SectionReveal>
      )}

      {/* EXPLORE BY AREA — price map */}
      <SectionReveal>
        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Explore Islamabad &amp; Rawalpindi</p>
            <h2 className="mt-2 text-display-sm">Find Your Perfect Sector</h2>
            <p className="mt-4 text-body-lg text-ink-secondary">
              Hover a sector to see indicative pricing and live listings, or click through to explore. Figures are
              illustrative averages, not audited market data.
            </p>
          </div>
          <div className="mt-8">
            <AreaPriceMap points={areaMapPoints} />
          </div>
        </section>
      </SectionReveal>

      {/* FOUR PILLARS */}
      <SectionReveal>
        <section className="bg-surface-sunken px-4 py-16 sm:px-6 sm:py-20">
          <StaggerGroup className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 sm:grid-cols-4">
            {EMINENT.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
              return (
                <StaggerItem
                  key={pillar}
                  className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-border-hairline bg-gradient-to-br from-white to-iris-50 px-5 py-10 text-center shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-raised"
                >
                  <div
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-soft/70 blur-2xl transition-transform duration-500 group-hover:scale-125"
                    aria-hidden="true"
                  />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-400 to-iris-600 text-white shadow-[0_8px_20px_rgba(86,56,201,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <p className="relative text-body-sm font-semibold uppercase tracking-wide text-ink-primary">{pillar}</p>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </section>
      </SectionReveal>

      {/* FEATURED BURAQ PROJECTS */}
      {featuredProjects.length > 0 && (
        <SectionReveal>
          <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Buraq Eminent Constructors</p>
                <h2 className="mt-2 text-display-sm">Recent Construction Work</h2>
              </div>
              <Link href="/construction/portfolio" className="flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
                View Portfolio <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => {
                const cover = project.afterImages[0] ?? project.beforeImages[0];
                return (
                  <StaggerItem key={project.id}>
                    <Link
                      href={`/construction/portfolio/${project.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-surface-raised shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-raised"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-navy-100">
                        {cover && (
                          <PropertyImage
                            src={cover.src}
                            alt={cover.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-2/3 bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <Badge variant="accent" className="absolute left-3 top-3 z-10">
                          {project.qualityTier}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1.5 p-4">
                        <p className="font-semibold text-ink-primary">{project.title}</p>
                        <p className="text-body-sm text-ink-secondary">{project.location}</p>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </section>
        </SectionReveal>
      )}

      {/* AUDIENCE SPLIT */}
      <SectionReveal>
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <StaggerGroup className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2">
            <StaggerItem className="rounded-3xl border border-border-hairline bg-surface-raised p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                <HomeIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-heading-lg uppercase text-ink-primary">For Local Clients</h3>
              <p className="mt-2 line-clamp-2 text-body-md text-ink-secondary">{EMINENT.audienceSplit.local}</p>
            </StaggerItem>
            <StaggerItem className="rounded-3xl border border-border-hairline bg-surface-raised p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                <Globe2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-heading-lg uppercase text-ink-primary">For International Clients</h3>
              <p className="mt-2 line-clamp-2 text-body-md text-ink-secondary">{EMINENT.audienceSplit.international}</p>
              <Link href="/overseas" className="mt-3 inline-flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
                Overseas Pakistanis Hub <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </StaggerItem>
          </StaggerGroup>
        </section>
      </SectionReveal>

      {/* INSIGHTS TEASER */}
      {articles.length > 0 && (
        <SectionReveal>
          <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Insights</p>
                <h2 className="mt-2 text-display-sm">Latest From Our Desk</h2>
              </div>
              <Link href="/insights" className="flex items-center gap-1 text-body-sm font-semibold uppercase tracking-wide text-accent-strong hover:underline">
                All Insights <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {articles.map((article) => (
                <StaggerItem key={article.slug}>
                  <Link
                    href={`/insights/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-surface-raised shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-raised"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
                      <PropertyImage
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <Badge variant="neutral" className="w-fit">
                        {article.category}
                      </Badge>
                      <p className="line-clamp-2 font-semibold text-ink-primary">{article.title}</p>
                      <p className="mt-auto text-body-sm text-ink-muted">
                        {new Date(article.publishedAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })} · {article.readMinutes} min read
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        </SectionReveal>
      )}

      {/* TRUST BAND */}
      <SectionReveal>
        <section className="bg-surface-warm px-4 py-14 sm:px-6">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 text-center sm:flex-row sm:items-stretch sm:justify-between sm:text-left">
            <div className="sm:max-w-xs">
              <p className="text-label font-semibold uppercase tracking-widest text-accent-strong">Track Record</p>
              <p className="mt-2 text-heading-lg uppercase text-ink-primary">{EMINENT.credentialBadge}</p>
              <p className="mt-2 text-body-sm text-ink-muted">Figures below are indicative of our scale, not audited public statistics.</p>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label} className="border-l-2 border-accent-strong pl-4 text-left">
                  <AnimatedCounter value={stat.value} className="text-display-sm text-navy-800" />
                  <p className="mt-1 text-body-sm text-ink-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SurveyLine className="mx-auto my-2 max-w-[1440px] px-4 sm:px-6" />

      {/* CLOSING CTA */}
      <SectionReveal>
        <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-iris-50 via-white to-sky-50 px-4 py-20 text-center">
            <div className="hero-glow opacity-60" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-display-md text-navy-800">{EMINENT.closingCta.headline}</h2>
              <p className="mt-4 line-clamp-2 text-body-lg text-ink-secondary">{EMINENT.closingCta.body}</p>
              <p className="mt-2 text-body-sm uppercase tracking-wide text-accent-strong">{EMINENT.closingCta.signature}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={buildWhatsAppLink("Hi Eminent Enterprises, I'd like to know more about your services.")} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}
