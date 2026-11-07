import { useMemo, useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ApprovalStatus, CityKey, FilterState, PossessionStatus, PropertyCategory, PropertyType } from "@/types";
import { PROPERTY_TYPE_CATEGORY } from "@/types";
import { CITIES, CITY_LABELS, LOCATIONS } from "@/data/locations";
import { filterProperties } from "@/lib/repositories/property-repository";
import { formatPKR } from "@/lib/format-pkr";
import { useFilters } from "@/state/filters";
import { useProperties } from "@/state/properties";
import { Button, Chip, Divider, Text } from "@/components/ui";
import { SelectField } from "@/components/form";
import { colors, GUTTER, palette, space } from "@/theme";

/** Same price steps as the website's filter rail. */
const PRICE_STEPS = [2_500_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000, 100_000_000];
const RENT_STEPS = [25_000, 50_000, 75_000, 100_000, 150_000, 250_000, 500_000];
const CATEGORIES: { value: PropertyCategory; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "plots", label: "Plots" },
  { value: "commercial", label: "Commercial" },
];
const APPROVALS: ApprovalStatus[] = ["CDA Approved", "RDA Approved", "Approval Pending", "Not Applicable"];
const POSSESSIONS: PossessionStatus[] = ["Ready", "Under Development", "Balloted"];
const COUNTS = [1, 2, 3, 4, 5];

function toggle<T>(list: T[] | undefined, value: T): T[] | undefined {
  const next = list?.includes(value) ? list.filter((v) => v !== value) : [...(list ?? []), value];
  return next.length ? next : undefined;
}

export default function FiltersScreen() {
  const insets = useSafeAreaInsets();
  const { filters, setFilters } = useFilters();
  const { properties } = useProperties();
  const [draft, setDraft] = useState<FilterState>(filters);

  const patch = (p: Partial<FilterState>) => setDraft((d) => ({ ...d, ...p }));
  const matchCount = useMemo(() => filterProperties(properties, draft).length, [properties, draft]);

  const types = (Object.keys(PROPERTY_TYPE_CATEGORY) as PropertyType[]).filter((t) => !draft.category || PROPERTY_TYPE_CATEGORY[t] === draft.category);
  const areas = LOCATIONS.filter((l) => !draft.cities?.length || draft.cities.includes(l.city));
  const steps = draft.purpose === "rent" ? RENT_STEPS : PRICE_STEPS;
  const priceOptions = steps.map((p) => ({ value: String(p), label: formatPKR(p).short }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceBase }}>
      <ScrollView contentContainerStyle={{ padding: GUTTER, gap: space.xxl, paddingBottom: 140 }}>
        <Section title="Category">
          <ChipWrap>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.value}
                label={c.label}
                selected={draft.category === c.value}
                onPress={() => patch({ category: draft.category === c.value ? undefined : c.value, types: undefined })}
              />
            ))}
          </ChipWrap>
        </Section>

        <Section title="Property type">
          <ChipWrap>
            {types.map((t) => (
              <Chip key={t} label={t} selected={!!draft.types?.includes(t)} onPress={() => patch({ types: toggle(draft.types, t) })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title="City">
          <ChipWrap>
            {CITIES.map((c: CityKey) => (
              <Chip key={c} label={CITY_LABELS[c]} selected={!!draft.cities?.includes(c)} onPress={() => patch({ cities: toggle(draft.cities, c), areas: undefined })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title="Area / society">
          <ChipWrap>
            {areas.map((a) => (
              <Chip key={a.slug} label={a.name} selected={!!draft.areas?.includes(a.slug)} onPress={() => patch({ areas: toggle(draft.areas, a.slug) })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title={draft.purpose === "rent" ? "Monthly rent" : "Price"}>
          <View style={{ flexDirection: "row", gap: space.md }}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Min"
                value={draft.priceMin ? String(draft.priceMin) : "any"}
                options={[{ value: "any", label: "Any" }, ...priceOptions]}
                onChange={(v) => patch({ priceMin: v === "any" ? undefined : Number(v) })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Max"
                value={draft.priceMax ? String(draft.priceMax) : "any"}
                options={[{ value: "any", label: "Any" }, ...priceOptions]}
                onChange={(v) => patch({ priceMax: v === "any" ? undefined : Number(v) })}
              />
            </View>
          </View>
        </Section>

        <Section title="Bedrooms (min)">
          <ChipWrap>
            <Chip label="Any" selected={draft.beds === undefined} onPress={() => patch({ beds: undefined })} />
            {COUNTS.map((n) => (
              <Chip key={n} label={n === 5 ? "5+" : String(n)} selected={draft.beds === n} onPress={() => patch({ beds: n })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title="Bathrooms (min)">
          <ChipWrap>
            <Chip label="Any" selected={draft.baths === undefined} onPress={() => patch({ baths: undefined })} />
            {COUNTS.map((n) => (
              <Chip key={n} label={n === 5 ? "5+" : String(n)} selected={draft.baths === n} onPress={() => patch({ baths: n })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title="Approval">
          <ChipWrap>
            {APPROVALS.map((a) => (
              <Chip key={a} label={a} selected={!!draft.approval?.includes(a)} onPress={() => patch({ approval: toggle(draft.approval, a) })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title="Possession">
          <ChipWrap>
            {POSSESSIONS.map((p) => (
              <Chip key={p} label={p} selected={!!draft.possession?.includes(p)} onPress={() => patch({ possession: toggle(draft.possession, p) })} />
            ))}
          </ChipWrap>
        </Section>

        <Section title="Listed">
          <ChipWrap>
            {[
              { v: undefined, l: "Any time" },
              { v: 7, l: "Last 7 days" },
              { v: 30, l: "Last 30 days" },
              { v: 90, l: "Last 3 months" },
            ].map((o) => (
              <Chip key={o.l} label={o.l} selected={draft.addedWithinDays === o.v} onPress={() => patch({ addedWithinDays: o.v })} />
            ))}
          </ChipWrap>
        </Section>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
        <Button
          label="Reset"
          variant="outline"
          onPress={() => setDraft({ sort: draft.sort, purpose: draft.purpose, keyword: draft.keyword })}
          style={{ flex: 1 }}
          fullWidth
        />
        <Button
          label={`Show ${matchCount} ${matchCount === 1 ? "result" : "results"}`}
          onPress={() => {
            setFilters(draft);
            router.back();
          }}
          style={{ flex: 2 }}
          fullWidth
        />
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: space.md }}>
      <Text variant="headingLg" color={palette.navy800}>
        {title}
      </Text>
      {children}
      <Divider style={{ marginTop: space.sm }} />
    </View>
  );
}

function ChipWrap({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>{children}</View>;
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: space.md,
    paddingHorizontal: GUTTER,
    paddingTop: space.md,
    backgroundColor: palette.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
  },
});
