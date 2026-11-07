import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchX, SlidersHorizontal, Search as SearchIcon, X, WifiOff } from "lucide-react-native";
import type { FilterState, Purpose } from "@/types";
import { countActiveFilters, filterProperties } from "@/lib/repositories/property-repository";
import { useProperties } from "@/state/properties";
import { useFilters } from "@/state/filters";
import { Button, EmptyState, Text } from "@/components/ui";
import { Segmented, SelectField } from "@/components/form";
import { PropertyCard } from "@/components/cards";
import { FocusStatusBar, useTabInset } from "@/components/layout";
import { colors, fonts, GUTTER, palette, radius, space } from "@/theme";

const PAGE = 12;

const SORT_OPTIONS: { value: NonNullable<FilterState["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "area-desc", label: "Largest area" },
  { value: "price-per-marla-asc", label: "Lowest price per marla" },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabInset();
  const { properties, loading, error, refresh, refreshing } = useProperties();
  const { filters, patchFilters } = useFilters();
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  // The keyword value this input last agreed with in the shared filters.
  const [syncedKeyword, setSyncedKeyword] = useState(filters.keyword);

  // Home (or Reset) changed the keyword elsewhere: adopt it during render.
  if (filters.keyword !== syncedKeyword) {
    setSyncedKeyword(filters.keyword);
    setKeyword(filters.keyword ?? "");
  }

  // Debounced input → shared filters.
  useEffect(() => {
    const next = keyword.trim() || undefined;
    if (next === filters.keyword) return;
    const id = setTimeout(() => {
      setSyncedKeyword(next);
      patchFilters({ keyword: next });
    }, 250);
    return () => clearTimeout(id);
  }, [keyword]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => filterProperties(properties, filters), [properties, filters]);

  // Paging resets whenever the filters object changes.
  const [paging, setPaging] = useState({ key: filters, count: PAGE });
  const visible = paging.key === filters ? paging.count : PAGE;
  const loadMore = () => {
    if (visible < results.length) setPaging({ key: filters, count: visible + PAGE });
  };

  const activeCount = countActiveFilters(filters);
  const purposeValue: "all" | Purpose = filters.purpose ?? "all";

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceSunken }}>
      <FocusStatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
        <Text variant="displayMd" color={palette.navy800}>
          Properties
        </Text>
        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <SearchIcon size={18} color={colors.inkMuted} />
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              placeholder="Search area, title or ref"
              placeholderTextColor={colors.inkMuted}
              returnKeyType="search"
              style={styles.searchText}
              accessibilityLabel="Search listings"
            />
            {keyword ? (
              <Pressable onPress={() => setKeyword("")} hitSlop={10} accessibilityLabel="Clear search">
                <X size={18} color={colors.inkMuted} />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            onPress={() => router.push("/filters")}
            style={[styles.filterBtn, activeCount > 0 && { backgroundColor: palette.navy800, borderColor: palette.navy800 }]}
            accessibilityRole="button"
            accessibilityLabel={`Filters${activeCount ? `, ${activeCount} active` : ""}`}
          >
            <SlidersHorizontal size={20} color={activeCount > 0 ? palette.paper : palette.navy800} />
            {activeCount > 0 ? (
              <View style={styles.filterCount}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10 }} color={palette.paper}>
                  {activeCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
        <Segmented
          value={purposeValue}
          onChange={(v) => patchFilters({ purpose: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "All" },
            { value: "buy", label: "Buy" },
            { value: "rent", label: "Rent" },
          ]}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : error && properties.length === 0 ? (
        <EmptyState
          icon={WifiOff}
          title="Couldn't load listings"
          body="Check your internet connection and try again."
          action={<Button label="Try again" onPress={() => refresh()} />}
        />
      ) : (
        <FlatList
          data={results.slice(0, visible)}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: GUTTER, gap: space.lg, paddingBottom: tabInset + space.lg }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => refresh()} tintColor={colors.accent} colors={[colors.accent]} />}
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <View style={styles.resultsBar}>
              <Text variant="bodySm" color={colors.inkSecondary} style={{ flexShrink: 0 }}>
                <Text variant="bodySm" style={{ fontFamily: fonts.bodyBold }}>
                  {results.length}
                </Text>{" "}
                {results.length === 1 ? "property" : "properties"}
              </Text>
              <View style={{ width: 210 }}>
                <SelectField label={undefined} value={filters.sort ?? "newest"} options={SORT_OPTIONS} onChange={(v) => patchFilters({ sort: v })} />
              </View>
            </View>
          }
          renderItem={({ item }) => <PropertyCard property={item} />}
          ListEmptyComponent={
            <EmptyState
              icon={SearchX}
              title="No matching properties"
              body="Try widening your filters, or tell us what you need and we'll find it for you."
              action={
                <View style={{ gap: space.md, alignItems: "center" }}>
                  <Button label="Clear filters" variant="outline" onPress={() => router.push("/filters")} />
                  <Button label="Request a property" onPress={() => router.push({ pathname: "/enquire", params: { reason: "Buy/Sell" } })} />
                </View>
              }
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: palette.paper,
    paddingHorizontal: GUTTER,
    paddingBottom: space.lg,
    gap: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderHairline,
  },
  searchRow: { flexDirection: "row", gap: space.sm },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: palette.cream100,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    height: 48,
  },
  searchText: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.inkPrimary },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.paper,
  },
  filterCount: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  resultsBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.md },
});
