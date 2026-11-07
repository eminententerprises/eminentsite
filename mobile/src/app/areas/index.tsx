import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import type { CityKey } from "@/types";
import { CITY_LABELS } from "@/data/locations";
import { getAllAreaGuides } from "@/lib/repositories/area-repository";
import { formatPKR } from "@/lib/format-pkr";
import { Chip, PressableCard, Text } from "@/components/ui";
import { PageIntro, RemoteImage, Screen } from "@/components/layout";
import { colors, palette, space } from "@/theme";

export default function AreasScreen() {
  const [city, setCity] = useState<CityKey | null>(null);
  const guides = getAllAreaGuides().filter((g) => !city || g.city === city);

  return (
    <Screen>
      <PageIntro kicker="Area Guides" title="Know the Neighbourhood" body="Price trends, amenities, landmarks and honest pros and cons for the twin cities' key societies." />
      <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.xl, flexWrap: "wrap" }}>
        <Chip label="All" selected={city === null} onPress={() => setCity(null)} />
        {(Object.keys(CITY_LABELS) as CityKey[]).map((c) => (
          <Chip key={c} label={CITY_LABELS[c]} selected={city === c} onPress={() => setCity(c)} />
        ))}
      </View>
      <View style={{ gap: space.lg, marginTop: space.xl }}>
        {guides.map((g) => {
          const latest = g.priceTrend[g.priceTrend.length - 1];
          return (
            <PressableCard key={g.slug} onPress={() => router.push(`/areas/${g.slug}`)} accessibilityLabel={g.name} style={{ overflow: "hidden" }}>
              <RemoteImage src={g.heroImage} style={{ aspectRatio: 16 / 8 }} />
              <View style={{ padding: space.lg, gap: 4 }}>
                <Text variant="label" color={colors.accentStrong}>
                  {g.cityLabel}
                </Text>
                <Text variant="headingLg" color={palette.navy800}>
                  {g.name}
                </Text>
                <Text variant="bodySm" color={colors.inkSecondary} numberOfLines={2}>
                  {g.summary}
                </Text>
                {latest ? (
                  <View style={styles.price}>
                    <Text variant="mono" color={palette.navy800}>
                      ~{formatPKR(latest.avgPricePerMarla).short} / marla
                    </Text>
                    <Text variant="bodySm" color={colors.inkMuted} style={{ fontSize: 12 }}>
                      {latest.quarter}
                    </Text>
                  </View>
                ) : null}
              </View>
            </PressableCard>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  price: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
    paddingTop: 10,
    marginTop: 8,
  },
});
