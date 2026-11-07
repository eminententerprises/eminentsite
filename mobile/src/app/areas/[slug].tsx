import { useMemo } from "react";
import { View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, MinusCircle, PlusCircle, SearchX } from "lucide-react-native";
import { getAreaGuideBySlug } from "@/lib/repositories/area-repository";
import { formatPKR } from "@/lib/format-pkr";
import { useProperties } from "@/state/properties";
import { useFilters, DEFAULT_FILTERS } from "@/state/filters";
import { Bullet, Button, Card, Disclaimer, EmptyState, KeyValue, SectionHeader, Text } from "@/components/ui";
import { HeroBanner, Screen } from "@/components/layout";
import { PropertyCard } from "@/components/cards";
import { colors, fonts, GUTTER, palette, radius, space } from "@/theme";

export default function AreaGuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const guide = getAreaGuideBySlug(String(slug));
  const { properties } = useProperties();
  const { setFilters } = useFilters();
  const listings = useMemo(() => properties.filter((p) => p.location.areaSlug === slug).slice(0, 4), [properties, slug]);

  if (!guide) {
    return <EmptyState icon={SearchX} title="Area guide not found" action={<Button label="All areas" onPress={() => router.replace("/areas")} />} />;
  }

  const max = Math.max(...guide.priceTrend.map((p) => p.avgPricePerMarla), 1);
  const first = guide.priceTrend[0]?.avgPricePerMarla;
  const last = guide.priceTrend[guide.priceTrend.length - 1]?.avgPricePerMarla;
  const growth = first && last ? ((last - first) / first) * 100 : undefined;

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ title: guide.name }} />
      <HeroBanner image={guide.heroImage} kicker={`Area Guide · ${guide.cityLabel}`} title={guide.name} body={guide.summary} height={300} />

      <View style={{ paddingHorizontal: GUTTER, gap: space.lg, paddingTop: space.xl }}>
        <SectionHeader title="Price Trend" />
        <Card style={{ gap: space.md }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end", height: 140, gap: 6 }} accessibilityLabel={`Average price per marla from ${guide.priceTrend[0]?.quarter} to ${guide.priceTrend[guide.priceTrend.length - 1]?.quarter}`}>
            {guide.priceTrend.map((p, i) => (
              <View key={p.quarter} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <View
                  style={{
                    width: "100%",
                    height: `${(p.avgPricePerMarla / max) * 100}%`,
                    backgroundColor: i === guide.priceTrend.length - 1 ? colors.accent : palette.iris200,
                    borderTopLeftRadius: radius.sm,
                    borderTopRightRadius: radius.sm,
                  }}
                />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="mono" color={colors.inkMuted} style={{ fontSize: 11 }}>
              {guide.priceTrend[0]?.quarter}
            </Text>
            <Text variant="mono" color={colors.inkMuted} style={{ fontSize: 11 }}>
              {guide.priceTrend[guide.priceTrend.length - 1]?.quarter}
            </Text>
          </View>
          {last ? (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <View>
                <Text variant="bodySm" color={colors.inkMuted}>
                  Latest avg. per marla
                </Text>
                <Text variant="price" color={palette.navy800}>
                  {formatPKR(last).short}
                </Text>
              </View>
              {typeof growth === "number" ? (
                <Text variant="mono" style={{ fontFamily: fonts.monoBold }} color={growth >= 0 ? colors.success : colors.danger}>
                  {growth >= 0 ? "+" : ""}
                  {growth.toFixed(1)}%
                </Text>
              ) : null}
            </View>
          ) : null}
        </Card>

        {guide.avgPriceByType.length ? (
          <>
            <SectionHeader title="Average by Type" />
            <Card padded={false} style={{ paddingHorizontal: space.lg }}>
              {guide.avgPriceByType.map((t, i) => (
                <KeyValue key={t.type} label={t.type} value={`${formatPKR(t.pricePerMarla).short} / marla`} last={i === guide.avgPriceByType.length - 1} />
              ))}
            </Card>
          </>
        ) : null}

        <SectionHeader title="Amenities" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
          {guide.amenities.map((a) => (
            <View key={a} style={{ flexDirection: "row", gap: 6, alignItems: "center", borderWidth: 1, borderColor: colors.borderHairline, borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 7 }}>
              <CheckCircle2 size={14} color={colors.success} />
              <Text variant="bodySm">{a}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Nearby Landmarks" />
        <Card padded={false} style={{ paddingHorizontal: space.lg }}>
          {guide.landmarks.map((l, i) => (
            <KeyValue key={l.name} label={l.name} value={`${l.distanceKm} km`} last={i === guide.landmarks.length - 1} />
          ))}
        </Card>

        <View style={{ gap: space.md }}>
          <Card style={{ gap: space.sm }}>
            <Text variant="headingLg" color={colors.success}>
              Pros
            </Text>
            {guide.pros.map((p) => (
              <Bullet key={p} icon={PlusCircle} color={colors.success}>
                {p}
              </Bullet>
            ))}
          </Card>
          <Card style={{ gap: space.sm }}>
            <Text variant="headingLg" color={colors.danger}>
              Cons
            </Text>
            {guide.cons.map((c) => (
              <Bullet key={c} icon={MinusCircle} color={colors.danger}>
                {c}
              </Bullet>
            ))}
          </Card>
        </View>

        <Disclaimer>Prices are indicative averages for illustration, not audited market data.</Disclaimer>

        {listings.length > 0 ? (
          <>
            <SectionHeader
              title={`Listings in ${guide.name}`}
              actionLabel="See all"
              onAction={() => {
                setFilters({ ...DEFAULT_FILTERS, areas: [guide.slug] });
                router.navigate("/search");
              }}
              style={{ marginTop: space.lg }}
            />
            {listings.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </>
        ) : null}
      </View>
    </Screen>
  );
}
