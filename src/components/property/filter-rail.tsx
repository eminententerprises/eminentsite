"use client";

import { useState } from "react";
import {
  Home,
  Building2,
  Building,
  TreePine,
  LandPlot,
  Landmark,
  FileText,
  Sprout,
  Store,
  Briefcase,
  Warehouse,
  Factory,
  type LucideIcon,
} from "lucide-react";
import type { ApprovalStatus, PossessionStatus, PropertyType } from "@/types";
import { usePropertySearchParams } from "@/hooks/use-property-search-params";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATIONS, CITY_LABELS } from "@/data/locations";
import type { CityKey } from "@/types";
import { formatPKR } from "@/lib/format-pkr";
import { cn } from "@/lib/utils";

const RESIDENTIAL_TYPES: PropertyType[] = ["House", "Upper Portion", "Lower Portion", "Flat/Apartment", "Penthouse", "Farm House"];
const PLOT_TYPES: PropertyType[] = ["Residential Plot", "Commercial Plot", "Plot File", "Agricultural Land"];
const COMMERCIAL_TYPES: PropertyType[] = ["Shop", "Office", "Warehouse", "Building", "Factory"];

const TYPE_ICONS: Partial<Record<PropertyType, LucideIcon>> = {
  House: Home,
  "Upper Portion": Building2,
  "Lower Portion": Building2,
  "Flat/Apartment": Building,
  Penthouse: Building2,
  "Farm House": TreePine,
  "Residential Plot": LandPlot,
  "Commercial Plot": Landmark,
  "Plot File": FileText,
  "Agricultural Land": Sprout,
  Shop: Store,
  Office: Briefcase,
  Warehouse: Warehouse,
  Building: Building,
  Factory: Factory,
};

const APPROVAL_OPTIONS: ApprovalStatus[] = ["CDA Approved", "RDA Approved", "Approval Pending", "Not Applicable"];
const POSSESSION_OPTIONS: PossessionStatus[] = ["Ready", "Under Development", "Balloted"];

const PRICE_STEPS = [2_500_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000, 100_000_000];

export function FilterRail({ className }: { className?: string }) {
  const { filters, setFilters, clearFilters } = usePropertySearchParams();

  const activeCount =
    (filters.types?.length ?? 0) +
    (filters.cities?.length ?? 0) +
    (filters.approval?.length ?? 0) +
    (filters.possession?.length ?? 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.areaMin ? 1 : 0) +
    (filters.areaMax ? 1 : 0) +
    (filters.beds ? 1 : 0) +
    (filters.baths ? 1 : 0) +
    (filters.keyword ? 1 : 0) +
    (filters.addedWithinDays ? 1 : 0);

  function toggleInList<T extends string>(list: T[] | undefined, value: T): T[] {
    const set = new Set(list ?? []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    return Array.from(set);
  }

  return (
    <div className={cn("glass-panel-light flex flex-col rounded-3xl p-5", className)}>
      <div className="flex items-center justify-between border-b border-border-hairline pb-3">
        <h2 className="text-heading-md uppercase text-ink-primary">Filters {activeCount > 0 && `(${activeCount})`}</h2>
        {activeCount > 0 && (
          <Button variant="link" size="sm" onClick={clearFilters} className="h-auto p-0">
            Clear all
          </Button>
        )}
      </div>

      <div className="border-b border-border-hairline py-4">
        <Label htmlFor="filter-keyword">Keyword</Label>
        <Input
          id="filter-keyword"
          defaultValue={filters.keyword ?? ""}
          placeholder="e.g. corner, boulevard, DHA"
          className="mt-2"
          onBlur={(e) => setFilters({ keyword: e.target.value || undefined })}
          onKeyDown={(e) => {
            if (e.key === "Enter") setFilters({ keyword: (e.target as HTMLInputElement).value || undefined });
          }}
        />
      </div>

      <Accordion type="multiple" defaultValue={["type", "price", "location"]} className="mt-2 w-full">
        <AccordionItem value="type">
          <AccordionTrigger>Property Type</AccordionTrigger>
          <AccordionContent>
            <TypeGroup
              label="Residential"
              types={RESIDENTIAL_TYPES}
              selected={filters.types ?? []}
              onToggle={(t) => setFilters({ types: toggleInList(filters.types, t) })}
            />
            <TypeGroup
              label="Plots & Land"
              types={PLOT_TYPES}
              selected={filters.types ?? []}
              onToggle={(t) => setFilters({ types: toggleInList(filters.types, t) })}
            />
            <TypeGroup
              label="Commercial"
              types={COMMERCIAL_TYPES}
              selected={filters.types ?? []}
              onToggle={(t) => setFilters({ types: toggleInList(filters.types, t) })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Budget (PKR)</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price-min" className="text-body-sm font-normal text-ink-secondary">
                  Min
                </Label>
                <Select value={filters.priceMin ? String(filters.priceMin) : undefined} onValueChange={(v) => setFilters({ priceMin: Number(v) })}>
                  <SelectTrigger id="price-min" className="mt-1">
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
              </div>
              <div>
                <Label htmlFor="price-max" className="text-body-sm font-normal text-ink-secondary">
                  Max
                </Label>
                <Select value={filters.priceMax ? String(filters.priceMax) : undefined} onValueChange={(v) => setFilters({ priceMax: Number(v) })}>
                  <SelectTrigger id="price-max" className="mt-1">
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="area">
          <AccordionTrigger>Area</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="area-min" className="text-body-sm font-normal text-ink-secondary">
                  Min (Marla)
                </Label>
                <Input
                  id="area-min"
                  type="number"
                  min={0}
                  defaultValue={filters.areaMin ?? ""}
                  className="mt-1"
                  onBlur={(e) => setFilters({ areaMin: e.target.value ? Number(e.target.value) : undefined, areaUnit: "marla" })}
                />
              </div>
              <div>
                <Label htmlFor="area-max" className="text-body-sm font-normal text-ink-secondary">
                  Max (Marla)
                </Label>
                <Input
                  id="area-max"
                  type="number"
                  min={0}
                  defaultValue={filters.areaMax ?? ""}
                  className="mt-1"
                  onBlur={(e) => setFilters({ areaMax: e.target.value ? Number(e.target.value) : undefined, areaUnit: "marla" })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="beds-baths">
          <AccordionTrigger>Beds &amp; Baths</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3">
              <CountSelect id="beds" label="Beds (min)" value={filters.beds} onChange={(v) => setFilters({ beds: v })} />
              <CountSelect id="baths" label="Baths (min)" value={filters.baths} onChange={(v) => setFilters({ baths: v })} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <LocationPicker selected={filters.areas ?? []} onToggle={(slug) => setFilters({ areas: toggleInList(filters.areas, slug) })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="approval">
          <AccordionTrigger>Approval Status</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2.5">
              {APPROVAL_OPTIONS.map((a) => (
                <CheckboxRow
                  key={a}
                  id={`approval-${a}`}
                  label={a}
                  checked={(filters.approval ?? []).includes(a)}
                  onChange={() => setFilters({ approval: toggleInList(filters.approval, a) })}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="possession">
          <AccordionTrigger>Possession Status</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2.5">
              {POSSESSION_OPTIONS.map((p) => (
                <CheckboxRow
                  key={p}
                  id={`possession-${p}`}
                  label={p}
                  checked={(filters.possession ?? []).includes(p)}
                  onChange={() => setFilters({ possession: toggleInList(filters.possession, p) })}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="recency">
          <AccordionTrigger>Added to Site</AccordionTrigger>
          <AccordionContent>
            <Select value={filters.addedWithinDays ? String(filters.addedWithinDays) : "any"} onValueChange={(v) => setFilters({ addedWithinDays: v === "any" ? undefined : Number(v) })}>
              <SelectTrigger>
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function TypeGroup({
  label,
  types,
  selected,
  onToggle,
}: {
  label: string;
  types: PropertyType[];
  selected: PropertyType[];
  onToggle: (t: PropertyType) => void;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-body-sm font-semibold text-ink-secondary">{label}</p>
      <div className="flex flex-col gap-2.5">
        {types.map((t) => (
          <CheckboxRow key={t} id={`type-${t}`} label={t} icon={TYPE_ICONS[t]} checked={selected.includes(t)} onChange={() => onToggle(t)} />
        ))}
      </div>
    </div>
  );
}

function LocationPicker({ selected, onToggle }: { selected: string[]; onToggle: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const cities: CityKey[] = ["islamabad", "rawalpindi", "hills"];
  const filtered = LOCATIONS.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <Input placeholder="Search a society or sector…" value={query} onChange={(e) => setQuery(e.target.value)} className="mb-3" />
      <div className="max-h-64 overflow-y-auto pr-1">
        {cities.map((city) => {
          const cityLocations = filtered.filter((l) => l.city === city);
          if (cityLocations.length === 0) return null;
          return (
            <div key={city} className="mb-4 last:mb-0">
              <p className="mb-2 text-body-sm font-semibold text-ink-secondary">{CITY_LABELS[city]}</p>
              <div className="flex flex-col gap-2.5">
                {cityLocations.map((l) => (
                  <CheckboxRow key={l.slug} id={`area-${l.slug}`} label={l.name} checked={selected.includes(l.slug)} onChange={() => onToggle(l.slug)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CountSelect({ id, label, value, onChange }: { id: string; label: string; value?: number; onChange: (v?: number) => void }) {
  return (
    <div>
      <Label htmlFor={id} className="text-body-sm font-normal text-ink-secondary">
        {label}
      </Label>
      <Select value={value ? String(value) : "any"} onValueChange={(v) => onChange(v === "any" ? undefined : Number(v))}>
        <SelectTrigger id={id} className="mt-1">
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any</SelectItem>
          {[1, 2, 3, 4, 5].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}+
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CheckboxRow({
  id,
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  icon?: LucideIcon;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      {Icon && <Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />}
      <Label htmlFor={id} className="cursor-pointer font-normal text-ink-primary">
        {label}
      </Label>
    </div>
  );
}
