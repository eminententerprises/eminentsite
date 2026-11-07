import { useMemo } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GitCompareArrows, Heart, MessageCircle } from "lucide-react-native";
import { useSaved } from "@/state/saved";
import { useProperties } from "@/state/properties";
import { openWhatsApp } from "@/lib/links";
import { Button, EmptyState, Text } from "@/components/ui";
import { PropertyCard } from "@/components/cards";
import { FocusStatusBar } from "@/components/layout";
import { colors, fonts, GUTTER, palette, radius, space } from "@/theme";

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { shortlist, compare, clearShortlist } = useSaved();
  const { getById, loading } = useProperties();

  const saved = useMemo(() => shortlist.map(getById).filter((p): p is NonNullable<typeof p> => !!p), [shortlist, getById]);

  function shareShortlist() {
    const lines = saved.map((p) => `• ${p.title} (Ref: ${p.ref})`).join("\n");
    openWhatsApp(`Hi Eminent Enterprises, I'm interested in these properties:\n${lines}\nCould you share more details?`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceSunken }}>
      <FocusStatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Text variant="displayMd" color={palette.navy800}>
            Saved
          </Text>
          {saved.length > 0 ? (
            <Pressable
              hitSlop={10}
              onPress={() =>
                Alert.alert("Clear saved properties?", "This removes every property from your saved list.", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: clearShortlist },
                ])
              }
            >
              <Text variant="label" color={colors.danger}>
                Clear all
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text variant="bodySm" color={colors.inkSecondary}>
          Saved on this device. Tap the heart on any listing to add it here.
        </Text>
        {compare.length > 0 ? (
          <Pressable onPress={() => router.push("/compare")} style={styles.compareBar} accessibilityRole="button">
            <GitCompareArrows size={18} color={palette.paper} />
            <Text variant="bodySm" color={palette.paper} style={{ flex: 1, fontFamily: fonts.bodySemi }}>
              {compare.length} {compare.length === 1 ? "property" : "properties"} in compare
            </Text>
            <Text variant="label" color={palette.iris200}>
              Compare →
            </Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={saved}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: GUTTER, gap: space.lg, paddingBottom: space.huge, flexGrow: 1 }}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListFooterComponent={
          saved.length > 0 ? (
            <Button label="Ask about these on WhatsApp" icon={MessageCircle} variant="whatsapp" onPress={shareShortlist} fullWidth />
          ) : undefined
        }
        ListEmptyComponent={
          loading ? undefined : (
            <EmptyState
              icon={Heart}
              title="No saved properties yet"
              body="Save listings you like and they'll appear here, ready to compare or share with our team."
              action={<Button label="Browse properties" onPress={() => router.navigate("/search")} />}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: palette.paper,
    paddingHorizontal: GUTTER,
    paddingBottom: space.lg,
    gap: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderHairline,
  },
  compareBar: {
    marginTop: space.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: palette.navy800,
    borderRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
});
