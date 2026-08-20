"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import type { AreaUnit, FilterState, PropertyType, Purpose } from "@/types";
import { LOCATIONS } from "@/data/locations";
import { filtersToParams } from "@/lib/property-filters-url";
import { formatPKR } from "@/lib/format-pkr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type HeroTab = "buy" | "rent" | "new-projects" | "build";

const HERO_TABS: { value: HeroTab; label: string }[] = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "new-projects", label: "New Projects" },
  { value: "build", label: "Build with Buraq" },
];

const GLASS_FIELD =
  "rounded-xl border-white/20 bg-white/10 text-paper backdrop-blur-md placeholder:text-ink-inverted-muted";

const HERO_TYPE_OPTIONS = [
  "House",
  "Flat/Apartment",
  "Upper Portion",
  "Farm House",
  "Residential Plot",
  "Commercial Plot",
  "Shop",
  "Office",
] as const;

// Mirrors the PRICE_STEPS / Select budget-range pattern used in filter-rail.tsx.
const PRICE_STEPS = [2_500_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000, 100_000_000];

const AREA_UNIT_OPTIONS: { value: AreaUnit; label: string }[] = [
  { value: "marla", label: "Marla" },
  { value: "kanal", label: "Kanal" },
];

export function HeroSearch() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<HeroTab>("buy");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSlug, setLocationSlug] = useState<string | undefined>(undefined);
  const [locationOpen, setLocationOpen] = useState(false);
  const [type, setType] = useState<string | undefined>(undefined);
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("marla");
  const [areaMin, setAreaMin] = useState<string>("");
  const [areaMax, setAreaMax] = useState<string>("");

  const filteredLocations = useMemo(() => {
    if (!locationQuery.trim()) return [];
    const q = locationQuery.trim().toLowerCase();
    return LOCATIONS.filter((l) => l.name.toLowerCase().includes(q)).slice(0, 8);
  }, [locationQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (tab === "build") {
      router.push("/construction");
      return;
    }

    if (tab === "new-projects") {
      router.push("/projects");
      return;
    }

    const purpose: Purpose = tab === "rent" ? "rent" : "buy";
    const filters: FilterState = {
      purpose,
      types: type ? [type as PropertyType] : undefined,
      areas: locationSlug ? [locationSlug] : undefined,
      keyword: !locationSlug && locationQuery.trim() ? locationQuery.trim() : undefined,
      priceMin,
      priceMax,
      areaMin: areaMin ? Number(areaMin) : undefined,
      areaMax: areaMax ? Number(areaMax) : undefined,
      areaUnit: areaMin || areaMax ? areaUnit : undefined,
      sort: "newest",
      page: 1,
    };

    const params = filtersToParams(filters);
    router.push(`/properties?${params.toString()}`);
  }

  const showPropertyFields = tab === "buy" || tab === "rent";

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7">
      <div className="relative mx-auto flex w-full flex-wrap justify-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md sm:w-fit">
        {HERO_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            aria-pressed={tab === t.value}
            className="relative isolate whitespace-nowrap rounded-full px-4 py-2.5 text-body-sm font-semibold uppercase tracking-wide transition-colors"
          >
            {tab === t.value && (
              <motion.span
                layoutId="hero-tab-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={cn("relative z-10", tab === t.value ? "text-navy-900" : "text-ink-inverted-muted hover:text-paper")}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {tab === "build" ? (
          <motion.div
            key="build"
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <p className="text-body-md text-ink-inverted-muted">
              Planning a new build, renovation or interior fit-out? Buraq Eminent Constructors — our sister company —
              handles it end to end.
            </p>
            <Button type="button" size="lg" className="mt-4 w-full sm:w-auto" onClick={() => router.push("/construction")}>
              Explore Construction Services
            </Button>
          </motion.div>
        ) : tab === "new-projects" ? (
          <motion.div
            key="new-projects"
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <p className="text-body-md text-ink-inverted-muted">
              Browse new-launch housing schemes and developments across Islamabad, Rawalpindi and the hill regions.
            </p>
            <Button type="button" size="lg" className="mt-4 w-full sm:w-auto" onClick={() => router.push("/projects")}>
              View New Projects
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="search"
            onSubmit={handleSubmit}
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 flex flex-col gap-4"
          >
          <div className="relative">
            <Label htmlFor="hero-location" className="text-ink-inverted-muted">
              Location
            </Label>
            <div className="relative mt-1.5">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <Input
                id="hero-location"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setLocationSlug(undefined);
                  setLocationOpen(true);
                }}
                onFocus={() => setLocationOpen(true)}
                onBlur={() => setTimeout(() => setLocationOpen(false), 150)}
                placeholder="e.g. DHA Phase II, F-7, Bahria Town…"
                className={cn(GLASS_FIELD, "pl-10")}
                autoComplete="off"
                role="combobox"
                aria-expanded={locationOpen && filteredLocations.length > 0}
                aria-controls="hero-location-listbox"
              />
            </div>
            {locationOpen && filteredLocations.length > 0 && (
              <ul
                id="hero-location-listbox"
                role="listbox"
                className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border-hairline bg-surface-raised shadow-raised"
              >
                {filteredLocations.map((loc) => (
                  <li key={loc.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={locationSlug === loc.slug}
                      className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-body-sm text-ink-primary transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-surface-sunken"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLocationQuery(loc.name);
                        setLocationSlug(loc.slug);
                        setLocationOpen(false);
                      }}
                    >
                      <span>{loc.name}</span>
                      <span className="text-body-sm text-ink-muted">{loc.cityLabel}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="hero-type" className="text-ink-inverted-muted">
                Property Type
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="hero-type" className={cn(GLASS_FIELD, "mt-1.5")}>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  {HERO_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-ink-inverted-muted">Area</Label>
              <div className="mt-1.5 grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Min"
                  value={areaMin}
                  onChange={(e) => setAreaMin(e.target.value)}
                  className={GLASS_FIELD}
                />
                <Input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="Max"
                  value={areaMax}
                  onChange={(e) => setAreaMax(e.target.value)}
                  className={GLASS_FIELD}
                />
                <Select value={areaUnit} onValueChange={(v) => setAreaUnit(v as AreaUnit)}>
                  <SelectTrigger className={cn(GLASS_FIELD, "w-24")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AREA_UNIT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-ink-inverted-muted">Budget (PKR)</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-3">
              <Select value={priceMin ? String(priceMin) : undefined} onValueChange={(v) => setPriceMin(Number(v))}>
                <SelectTrigger className={GLASS_FIELD}>
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_STEPS.map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {formatPKR(p).short}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceMax ? String(priceMax) : undefined} onValueChange={(v) => setPriceMax(Number(v))}>
                <SelectTrigger className={GLASS_FIELD}>
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_STEPS.map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {formatPKR(p).short}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

            <Button type="submit" size="lg" className={cn("mt-1 w-full gap-2", showPropertyFields && "sm:w-auto sm:self-start")}>
              <Search className="h-4 w-4" aria-hidden="true" />
              Search Properties
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
