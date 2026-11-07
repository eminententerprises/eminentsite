import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { GitCompareArrows, X } from "lucide-react-native";
import type { Property } from "@/types";
import { formatAreaAuto } from "@/lib/area";
import { formatPKR } from "@/lib/format-pkr";
import { useSaved, MAX_COMPARE } from "@/state/saved";
import { useProperties } from "@/state/properties";
import { Button, EmptyState, Text } from "@/components/ui";
import { RemoteImage } from "@/components/layout";
import { colors, fonts, GUTTER, palette, radius, space } from "@/theme";

/** Same comparison rows as the website's CompareTable. */
const COMMON_AMENITIES = ["24/7 Security", "Gated Community", "Underground Electrification", "Community Park", "CCTV Surveillance"];

const ROWS: { label: string; value: (p: Property) => string }[] = [
  { label: "Price", value: (p) => formatPKR(p.price, { perMonth: p.priceUnit === "month" }).short },
  { label: "Price / Marla", value: (p) => (p.pricePerMarla ? formatPKR(p.pricePerMarla).short : "—") },
  { label: "Area", value: (p) => formatAreaAuto(p.area.sqft) },
  { label: "Type", value: (p) => p.type },
  { label: "Location", value: (p) => `${p.location.area}, ${p.location.cityLabel}` },
  { label: "Bedrooms", value: (p) => (p.beds != null ? String(p.beds) : "—") },
  { label: "Bathrooms", value: (p) => (p.baths != null ? String(p.baths) : "—") },
  { label: "Approval", value: (p) => p.pakistanFields.approval },
  { label: "Possession", value: (p) => p.pakistanFields.possession },
  { label: "Documentation", value: (p) => p.pakistanFields.plotFileOrRegistry },
  { label: "Corner Plot", value: (p) => (p.pakistanFields.cornerPlot ? "Yes" : "No") },
  { label: "Gas", value: (p) => (p.pakistanFields.gasAvailable ? "Yes" : "No") },
  { label: "Water", value: (p) => p.pakistanFields.waterSource },
  ...COMMON_AMENITIES.map((a) => ({ label: a, value: (p: Property) => (p.amenities.includes(a) ? "✓" : "—") })),
];

const COL = 168;
const LABEL_COL = 118;

export default function CompareScreen() {
  const { compare, toggleCompare, clearCompare } = useSaved();
  const { getById } = useProperties();
  const items = compare.map(getById).filter((p): p is Property => !!p);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        title="Nothing to compare yet"
        body={`Tap the compare icon on up to ${MAX_COMPARE} listings to see them side by side.`}
        action={<Button label="Browse properties" onPress={() => router.navigate("/search")} />}
      />
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.surfaceBase }} contentContainerStyle={{ paddingVertical: space.lg, paddingBottom: space.huge }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER }}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: LABEL_COL }} />
            {items.map((p) => (
              <View key={p.id} style={{ width: COL, paddingRight: space.md }}>
                <Pressable onPress={() => router.push(`/property/${p.slug}`)} accessibilityRole="link" accessibilityLabel={p.title}>
                  <RemoteImage src={p.images[0]?.src} style={{ height: 100, borderRadius: radius.md }} />
                  <Text variant="bodySm" numberOfLines={2} style={{ fontFamily: fonts.bodySemi, marginTop: 6 }}>
                    {p.title}
                  </Text>
                </Pressable>
                <Pressable onPress={() => toggleCompare(p.id)} style={styles.remove} accessibilityLabel={`Remove ${p.title} from comparison`} hitSlop={8}>
                  <X size={14} color={palette.paper} />
                </Pressable>
              </View>
            ))}
          </View>
          {ROWS.map((row, i) => (
            <View key={row.label} style={[styles.row, i % 2 === 0 && { backgroundColor: palette.cream100 }]}>
              <Text variant="bodySm" color={colors.inkSecondary} style={{ width: LABEL_COL, paddingLeft: 8 }}>
                {row.label}
              </Text>
              {items.map((p) => (
                <Text key={p.id} variant="bodySm" style={{ width: COL, paddingRight: space.md, fontFamily: i < 2 ? fonts.monoBold : fonts.bodySemi }}>
                  {row.value(p)}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <Button label="Clear comparison" variant="ghost" onPress={clearCompare} style={{ alignSelf: "center", marginTop: space.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 11, borderRadius: radius.sm },
  remove: {
    position: "absolute",
    top: 6,
    right: space.md + 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(16,28,61,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
});
