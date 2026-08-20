"use client";

import { useEffect, useState } from "react";
import type { AreaUnit, CityKey, Property, PropertyType, ValuationInput } from "@/types";
import { CITY_LABELS, LOCATIONS, getLocationBySlug } from "@/data/locations";
import { filtersToParams } from "@/lib/property-filters-url";
import { estimateValuation } from "@/lib/valuation";
import { AREA_UNIT_LABEL } from "@/lib/area";
import { formatPKR, formatPKRRange } from "@/lib/format-pkr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SurveyLine } from "@/components/brand/survey-line";
import { PropertyCard } from "@/components/property/property-card";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Location", "Property Type", "Area", "Condition & Age", "Features"] as const;
const TOTAL_STEPS = STEP_LABELS.length;

const VALUATION_PROPERTY_TYPES: PropertyType[] = [
  "House",
  "Flat/Apartment",
  "Upper Portion",
  "Lower Portion",
  "Farm House",
  "Residential Plot",
];

const AREA_UNITS: AreaUnit[] = ["marla", "kanal", "sqft", "sqyd"];

const CONDITIONS: ValuationInput["condition"][] = ["New", "Good", "Needs Renovation"];

const FEATURE_OPTIONS = [
  "Corner Plot",
  "Boulevard Facing",
  "Park Facing",
  "Basement",
  "Servant Quarter",
  "Gas Available",
];

const CITY_ORDER: CityKey[] = ["islamabad", "rawalpindi", "hills"];

/** HTML ids can't contain spaces — slugify labels used as element ids. */
function slugifyId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function EminentEstimateForm() {
  const [step, setStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [city, setCity] = useState<string | undefined>(undefined);
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>(undefined);
  const [areaValue, setAreaValue] = useState("5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("marla");
  const [condition, setCondition] = useState<ValuationInput["condition"] | undefined>(undefined);
  const [ageYears, setAgeYears] = useState("0");
  const [features, setFeatures] = useState<string[]>([]);

  function toggleFeature(feature: string) {
    setFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]));
  }

  const step1Valid = Boolean(city);
  const step2Valid = Boolean(propertyType);
  const step3Valid = Number(areaValue) > 0;
  const step4Valid = Boolean(condition) && ageYears !== "" && Number(ageYears) >= 0;
  const stepValid: Record<number, boolean> = { 1: step1Valid, 2: step2Valid, 3: step3Valid, 4: step4Valid, 5: true };
  const allStepsValid = step1Valid && step2Valid && step3Valid && step4Valid;

  function goNext() {
    if (!stepValid[step]) return;
    const next = Math.min(step + 1, TOTAL_STEPS);
    setStep(next);
    setMaxStepReached((m) => Math.max(m, next));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function jumpTo(n: number) {
    if (n <= maxStepReached) setStep(n);
  }

  // Computed directly from current field state on every render — this is
  // cheap and pure, so there's no need to stash it via an effect + setState.
  const valuationInput: ValuationInput | null = allStepsValid
    ? {
        city: city as string,
        propertyType: propertyType as PropertyType,
        areaValue: Number(areaValue),
        areaUnit,
        ageYears: Number(ageYears),
        condition: condition as ValuationInput["condition"],
        features,
      }
    : null;

  const result = submitted && valuationInput ? estimateValuation(valuationInput) : null;
  const comparableLocationName = result ? getLocationBySlug(result.comparableAreaSlug)?.name ?? city : undefined;

  const [comparables, setComparables] = useState<Property[]>([]);

  useEffect(() => {
    // `submitted` never reverts to false once set, so `result` never goes
    // from populated back to null within a session — nothing to reset here.
    if (!result || !valuationInput) return;

    const params = filtersToParams({ areas: [result.comparableAreaSlug], types: [valuationInput.propertyType] });
    let cancelled = false;

    fetch(`/api/properties/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { results: Property[] }) => {
        if (!cancelled) setComparables(data.results.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setComparables([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.comparableAreaSlug, valuationInput?.propertyType]);

  return (
    <div>
      <nav aria-label="Estimate form steps">
        <ol className="flex flex-wrap gap-1.5">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const isCurrent = n === step;
            const isReachable = n <= maxStepReached;
            return (
              <li key={label} className="min-w-[5.5rem] flex-1">
                <button
                  type="button"
                  onClick={() => jumpTo(n)}
                  disabled={!isReachable}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border px-2 text-body-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-strong disabled:cursor-not-allowed",
                    isCurrent
                      ? "border-navy-800 bg-navy-800 text-white"
                      : isReachable
                        ? "border-border-strong text-ink-primary hover:border-navy-800"
                        : "border-border-hairline text-ink-muted opacity-50",
                  )}
                >
                  <span className="font-tabular-nums">{n}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-3 font-tabular-nums text-label uppercase tracking-widest text-accent-strong">
          Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}
        </p>
        <div className="relative mt-1.5">
          <SurveyLine ticks={TOTAL_STEPS - 1} className="opacity-25" />
          <div
            className="absolute inset-0 overflow-hidden transition-[width] duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          >
            <SurveyLine ticks={TOTAL_STEPS - 1} />
          </div>
        </div>
      </nav>

      <div className="mt-8 min-h-[18rem] rounded-2xl border border-border-hairline p-5 sm:p-6">
        {step === 1 && (
          <div>
            <h2 className="mb-4 text-heading-lg uppercase text-ink-primary">Where is the property located?</h2>
            <LocationStep value={city} onChange={setCity} />
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="mb-4 text-heading-lg uppercase text-ink-primary">What type of property is it?</h2>
            <div className="max-w-sm">
              <Label htmlFor="property-type">Property type</Label>
              <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
                <SelectTrigger id="property-type" className="mt-1.5">
                  <SelectValue placeholder="Select a property type" />
                </SelectTrigger>
                <SelectContent>
                  {VALUATION_PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="mb-4 text-heading-lg uppercase text-ink-primary">How large is it?</h2>
            <div className="flex flex-col gap-4 sm:max-w-md sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="area-value">Covered / plot area</Label>
                <Input
                  id="area-value"
                  type="number"
                  min={0}
                  step={0.01}
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="mt-1.5 font-tabular-nums"
                />
              </div>
              <div className="w-full sm:w-40">
                <Label htmlFor="area-unit">Unit</Label>
                <Select value={areaUnit} onValueChange={(v) => setAreaUnit(v as AreaUnit)}>
                  <SelectTrigger id="area-unit" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AREA_UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {AREA_UNIT_LABEL[u]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="mb-4 text-heading-lg uppercase text-ink-primary">What condition and age is it?</h2>
            <div className="flex flex-col gap-6">
              <div>
                <Label id="condition-label">Condition</Label>
                <RadioGroup
                  aria-labelledby="condition-label"
                  value={condition}
                  onValueChange={(v) => setCondition(v as ValuationInput["condition"])}
                  className="mt-2 flex flex-col gap-2.5"
                >
                  {CONDITIONS.map((c) => (
                    <div key={c} className="flex items-center gap-2.5">
                      <RadioGroupItem value={c} id={`condition-${slugifyId(c)}`} />
                      <Label htmlFor={`condition-${slugifyId(c)}`} className="cursor-pointer font-normal text-ink-primary">
                        {c}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="max-w-xs">
                <Label htmlFor="age-years">Age (years)</Label>
                <Input
                  id="age-years"
                  type="number"
                  min={0}
                  step={1}
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  className="mt-1.5 font-tabular-nums"
                />
                <p className="mt-1.5 text-body-sm text-ink-muted">Enter 0 for a brand-new property. Plots aren&apos;t aged.</p>
              </div>
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="mb-2 text-heading-lg uppercase text-ink-primary">Any standout features?</h2>
            <p className="mb-4 text-body-sm text-ink-secondary">
              Select any that apply. Each adds a small premium to the estimate, capped overall.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {FEATURE_OPTIONS.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`feature-${slugifyId(f)}`}
                    checked={features.includes(f)}
                    onCheckedChange={() => toggleFeature(f)}
                  />
                  <Label htmlFor={`feature-${slugifyId(f)}`} className="cursor-pointer font-normal text-ink-primary">
                    {f}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button type="button" variant="outline" size="md" onClick={goBack} disabled={step === 1}>
          Back
        </Button>
        {step === TOTAL_STEPS ? (
          <Button type="button" size="md" onClick={() => setSubmitted(true)} disabled={!allStepsValid}>
            Get My Estimate
          </Button>
        ) : (
          <Button type="button" size="md" onClick={goNext} disabled={!stepValid[step]}>
            Next
          </Button>
        )}
      </div>

      {result && valuationInput && (
        <section aria-labelledby="estimate-result-heading" className="mt-12 border-t border-border-hairline pt-10">
          <h2 id="estimate-result-heading" className="text-display-sm">
            Your Estimated Value
          </h2>
          <p className="mt-1 text-body-md text-ink-secondary">
            {valuationInput.propertyType} in {comparableLocationName}
          </p>

          <p className="mt-4 font-tabular-nums text-3xl font-semibold text-navy-800">
            {formatPKRRange(result.low, result.high)}
          </p>
          <p className="mt-1 font-tabular-nums text-body-sm text-ink-muted">Midpoint estimate: {formatPKR(result.mid).short}</p>

          <div className="mt-5 max-w-xs">
            <ConfidenceBand level={result.confidence} />
          </div>

          <p className="mt-4 font-tabular-nums text-body-sm text-ink-secondary">
            Base rate used: {formatPKR(result.pricePerMarlaUsed).short} per Marla
          </p>

          <div className="mt-6 rounded-xl border border-border-strong bg-surface-sunken p-4">
            <p className="text-body-sm font-semibold uppercase tracking-wide text-ink-primary">
              Indicative estimate — not a formal valuation
            </p>
            <p className="mt-1.5 text-body-sm text-ink-secondary">
              This range comes from a simplified set of rules applied to the area&apos;s indicative base rate, property
              type, condition, age and selected features. It doesn&apos;t account for an on-ground inspection, exact
              plot position, title status, or current negotiation dynamics. Treat it as a starting point, not a market
              valuation — speak to one of our advisors for a professional opinion before making any financial decision.
            </p>
          </div>

          {comparables.length > 0 ? (
            <div className="mt-10">
              <h3 className="mb-4 text-heading-lg uppercase text-ink-primary">Comparable Listings</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {comparables.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-10 text-body-sm text-ink-muted">
              We don&apos;t currently have comparable listings on file for this area and property type.
            </p>
          )}

          <div className="mt-10 border-t border-border-hairline pt-8">
            <h3 className="mb-1 text-heading-lg uppercase text-ink-primary">Get a Professional Valuation</h3>
            <p className="mb-5 text-body-sm text-ink-secondary">
              Want a verified number? Share a few details and one of our advisors will follow up.
            </p>
            <EnquiryForm defaultReason="Investment" showReason />
          </div>
        </section>
      )}
    </div>
  );
}

function LocationStep({ value, onChange }: { value?: string; onChange: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = LOCATIONS.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <Label htmlFor="location-search">Search for your area</Label>
      <Input
        id="location-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. DHA, Bahria, F-10"
        className="mt-1.5 mb-4"
      />
      <RadioGroup value={value} onValueChange={onChange} className="max-h-72 overflow-y-auto pr-1">
        {CITY_ORDER.map((cityKey) => {
          const cityLocations = filtered.filter((l) => l.city === cityKey);
          if (cityLocations.length === 0) return null;
          return (
            <div key={cityKey} className="mb-4 last:mb-0">
              <p className="mb-2 text-body-sm font-semibold text-ink-secondary">{CITY_LABELS[cityKey]}</p>
              <div className="flex flex-col gap-2.5">
                {cityLocations.map((l) => (
                  <div key={l.slug} className="flex items-center gap-2.5">
                    <RadioGroupItem value={l.slug} id={`loc-${l.slug}`} />
                    <Label htmlFor={`loc-${l.slug}`} className="cursor-pointer font-normal text-ink-primary">
                      {l.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-body-sm text-ink-muted">No areas match &ldquo;{query}&rdquo;.</p>}
      </RadioGroup>
    </div>
  );
}

function ConfidenceBand({ level }: { level: "Low" | "Medium" | "High" }) {
  const levels: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];
  const currentIndex = levels.indexOf(level);

  return (
    <div>
      <div className="flex gap-1">
        {levels.map((l, i) => (
          <div key={l} className={cn("h-2 flex-1", i <= currentIndex ? "bg-accent-strong" : "bg-border-hairline")} />
        ))}
      </div>
      <p className="mt-1.5 text-body-sm text-ink-secondary">
        Confidence: <span className="font-semibold text-ink-primary">{level}</span>
      </p>
    </div>
  );
}
