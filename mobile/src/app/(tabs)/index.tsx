import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowRight,
  Building2,
  Globe2,
  Handshake,
  HardHat,
  Home as HomeIcon,
  KeyRound,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react-native";
import { BURAQ, EMINENT, GROUP } from "@/config/site";
import { TRUST_STATS } from "@/data/trust-stats";
import { LOCATIONS } from "@/data/locations";
import { getFeaturedConstructionProjects } from "@/lib/repositories/construction-repository";
import { getAllArticles } from "@/lib/repositories/article-repository";
import { formatPKR } from "@/lib/format-pkr";
import { seedImage } from "@/lib/image";
import { openWhatsApp } from "@/lib/links";
import { useProperties } from "@/state/properties";
import { useFilters, DEFAULT_FILTERS } from "@/state/filters";
import { Button, IconCircle, IconTile, Kicker, PressableCard, SectionHeader, SurveyLine, Text } from "@/components/ui";
import { Segmented } from "@/components/form";
import { FocusStatusBar, RemoteImage, Screen } from "@/components/layout";
import { ArticleCard, CaseStudyCard, PropertyCard } from "@/components/cards";
import type { Purpose } from "@/types";
import { colors, fonts, GUTTER, gradients, palette, radius, shadows, space } from "@/theme";

const PILLAR_ICONS = [MapPinned, TrendingUp, ShieldCheck, Handshake];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { properties, refresh, refreshing } = useProperties();
  const { setFilters } = useFilters();
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const [keyword, setKeyword] = useState("");

  const featured = useMemo(() => properties.filter((p) => p.isFeatured).slice(0, 8), [properties]);
  const recent = useMemo(() => properties.slice(0, 6), [properties]);
  const showcase = featured.length > 0 ? featured : recent;
  const caseStudies = getFeaturedConstructionProjects(3);
  const articles = getAllArticles().slice(0, 3);

  const areaCards = useMemo(
    () =>
      LOCATIONS.filter((l) => l.city !== "hills").map((l) => ({
        ...l,
        count: properties.filter((p) => p.location.areaSlug === l.slug).length,
        cover: properties.find((p) => p.location.areaSlug === l.slug)?.images[0]?.src ?? seedImage(`areaguide-${l.slug}`, 600, 400),
      })),
    [properties],
  );

  function runSearch(next: { purpose?: Purpose; areas?: string[]; keyword?: string }) {
    setFilters({ ...DEFAULT_FILTERS, ...next, keyword: next.keyword?.trim() || undefined });
    router.navigate("/search");
  }

  const pathways = [
    { label: "Buy", icon: HomeIcon, onPress: () => runSearch({ purpose: "buy" }) },
    { label: "Rent", icon: KeyRound, onPress: () => runSearch({ purpose: "rent" }) },
    { label: "New Projects", icon: Building2, onPress: () => router.push("/projects") },
    { label: "Build with Buraq", icon: HardHat, onPress: () => router.push("/construction") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceBase }}>
      <FocusStatusBar style="light" />
      <Screen padded={false} bottomInset={false} refreshing={refreshing} onRefresh={() => refresh()}>
        {/* HERO */}
        <View style={{ backgroundColor: palette.navy900 }}>
          <RemoteImage src={seedImage("eminent-hero-skyline", 1200, 1400)} style={StyleSheet.absoluteFill} accessibilityLabel="Aerial view of a planned housing sector in Islamabad" />
          <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
          <View style={{ paddingTop: insets.top + space.lg, paddingHorizontal: GUTTER, paddingBottom: space.xxxl }}>
            <View style={styles.brandRow}>
              <View style={styles.logoMark}>
                <Text style={{ fontFamily: fonts.displayBlack, fontSize: 17 }} color={palette.paper}>
                  EE
                </Text>
              </View>
              <View>
                <Text style={{ fontFamily: fonts.display, fontSize: 17, letterSpacing: 0.6, textTransform: "uppercase" }} color={palette.paper}>
                  {EMINENT.name}
                </Text>
                <Text variant="bodySm" color={colors.inkInvertedMuted} style={{ fontSize: 11.5 }}>
                  {EMINENT.descriptor}
                </Text>
              </View>
            </View>

            <Kicker color={palette.iris300} style={{ marginTop: space.xxxl, letterSpacing: 3 }}>
              {EMINENT.positioning}
            </Kicker>
            <Text variant="displayXl" color={palette.paper} style={{ marginTop: space.md }}>
              {EMINENT.heroHeadline}
            </Text>
            <Text variant="bodyMd" color={colors.inkInvertedMuted} style={{ marginTop: space.md }}>
              {EMINENT.subPositioningBody}
            </Text>

            {/* Glass search panel */}
            <View style={styles.searchPanel}>
              <Segmented
                dark
                value={purpose}
                onChange={setPurpose}
                options={[
                  { value: "buy", label: "Buy" },
                  { value: "rent", label: "Rent" },
                ]}
              />
              <View style={styles.searchInput}>
                <Search size={18} color={colors.inkMuted} />
                <TextInput
                  value={keyword}
                  onChangeText={setKeyword}
                  placeholder="Area, society or keyword (e.g. DHA, F-10)"
                  placeholderTextColor={colors.inkMuted}
                  returnKeyType="search"
                  onSubmitEditing={() => runSearch({ purpose, keyword })}
                  style={styles.searchText}
                  accessibilityLabel="Search properties"
                />
              </View>
              <Button label="Search Properties" icon={Search} onPress={() => runSearch({ purpose, keyword })} fullWidth />
            </View>
          </View>
        </View>

        {/* PILLAR STRIP */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillarStrip} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.xl, alignItems: "center" }}>
          {EMINENT.pillars.map((p) => (
            <View key={p} style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
              <Text variant="label" color={palette.navy800} style={{ letterSpacing: 1.8 }}>
                {p}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: GUTTER }}>
          <SurveyLine />

          {/* GROUP + PATHWAYS */}
          <View style={{ paddingVertical: space.xxxl, alignItems: "center" }}>
            <Text variant="displayMd" color={palette.navy800} style={{ textAlign: "center" }}>
              {GROUP.headline}
            </Text>
            <Text variant="bodyMd" color={colors.inkSecondary} style={{ textAlign: "center", marginTop: space.md }}>
              {GROUP.body}
            </Text>
            <View style={styles.pathwayGrid}>
              {pathways.map((p) => (
                <Pressable
                  key={p.label}
                  onPress={p.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={p.label}
                  style={({ pressed }) => [styles.pathway, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
                >
                  <LinearGradient colors={gradients.skyCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <IconTile icon={p.icon} />
                  <Text variant="label" color={colors.inkPrimary} style={{ textAlign: "center", fontSize: 12 }}>
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* TWO-BRAND SPLIT */}
          <View style={{ gap: space.lg }}>
            <BrandPanel
              colorsPair={gradients.irisCard}
              kicker="Real Estate Advisory"
              title={EMINENT.name}
              body={EMINENT.boilerplate}
              cta="Explore Properties"
              onPress={() => runSearch({})}
            />
            <BrandPanel
              colorsPair={gradients.creamCard}
              kicker="Construction"
              title={BURAQ.name}
              body={BURAQ.intro}
              cta="Discover Buraq"
              outline
              onPress={() => router.push("/construction")}
            />
          </View>
        </View>

        {/* FEATURED LISTINGS */}
        {showcase.length > 0 ? (
          <View style={{ paddingTop: space.huge }}>
            <SectionHeader
              kicker="Handpicked"
              title={featured.length > 0 ? "Featured Listings" : "Latest Listings"}
              actionLabel="View all"
              onAction={() => runSearch({})}
              style={{ paddingHorizontal: GUTTER }}
            />
            <FlatList
              horizontal
              data={showcase}
              keyExtractor={(p) => p.id}
              showsHorizontalScrollIndicator={false}
              snapToInterval={292}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md, paddingVertical: space.lg }}
              renderItem={({ item }) => <PropertyCard property={item} style={{ width: 280 }} compact />}
            />
          </View>
        ) : null}

        {/* EXPLORE BY AREA */}
        <View style={{ paddingTop: space.xxxl }}>
          <SectionHeader kicker="Explore Islamabad & Rawalpindi" title="Find Your Perfect Sector" actionLabel="Guides" onAction={() => router.push("/areas")} style={{ paddingHorizontal: GUTTER }} />
          <Text variant="bodySm" color={colors.inkMuted} style={{ paddingHorizontal: GUTTER, marginTop: space.sm }}>
            Indicative price per marla. Figures are illustrative averages, not audited market data.
          </Text>
          <FlatList
            horizontal
            data={areaCards}
            keyExtractor={(a) => a.slug}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md, paddingVertical: space.lg }}
            renderItem={({ item }) => (
              <PressableCard onPress={() => runSearch({ areas: [item.slug] })} accessibilityLabel={`${item.name} listings`} style={{ width: 200, overflow: "hidden" }}>
                <RemoteImage src={item.cover} style={{ height: 110 }} />
                <View style={{ padding: space.md, gap: 3 }}>
                  <Text variant="headingSm" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text variant="bodySm" color={colors.inkMuted}>
                    {item.cityLabel}
                  </Text>
                  <Text variant="mono" color={colors.accentStrong} style={{ marginTop: 4 }}>
                    {formatPKR(item.basePricePerMarla).short.replace("PKR ", "")} / marla
                  </Text>
                  <Text variant="bodySm" color={colors.inkSecondary} style={{ fontSize: 12 }}>
                    {item.count} {item.count === 1 ? "listing" : "listings"}
                  </Text>
                </View>
              </PressableCard>
            )}
          />
        </View>

        {/* FOUR PILLARS */}
        <View style={styles.pillarsBand}>
          <View style={styles.pillarGrid}>
            {EMINENT.pillars.map((pillar, i) => (
              <View key={pillar} style={styles.pillarCard}>
                <LinearGradient colors={gradients.irisCard} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={StyleSheet.absoluteFill} />
                <IconTile icon={PILLAR_ICONS[i % PILLAR_ICONS.length]} size={54} />
                <Text variant="label" color={colors.inkPrimary} style={{ textAlign: "center", fontSize: 12 }}>
                  {pillar}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* BURAQ RECENT WORK */}
        {caseStudies.length > 0 ? (
          <View style={{ paddingTop: space.huge }}>
            <SectionHeader kicker={BURAQ.name} title="Recent Construction Work" actionLabel="Portfolio" onAction={() => router.push("/construction/portfolio")} style={{ paddingHorizontal: GUTTER }} />
            <FlatList
              horizontal
              data={caseStudies}
              keyExtractor={(c) => c.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md, paddingVertical: space.lg }}
              renderItem={({ item }) => <CaseStudyCard project={item} style={{ width: 270 }} />}
            />
          </View>
        ) : null}

        <View style={{ paddingHorizontal: GUTTER, gap: space.lg, paddingTop: space.xxxl }}>
          {/* AUDIENCE SPLIT */}
          <AudienceCard icon={HomeIcon} title="For Local Clients" body={EMINENT.audienceSplit.local} />
          <AudienceCard
            icon={Globe2}
            title="For International Clients"
            body={EMINENT.audienceSplit.international}
            linkLabel="Overseas Pakistanis Hub"
            onPress={() => router.push("/overseas")}
          />
        </View>

        {/* INSIGHTS */}
        {articles.length > 0 ? (
          <View style={{ paddingHorizontal: GUTTER, paddingTop: space.huge, gap: space.md }}>
            <SectionHeader kicker="Insights" title="Latest From Our Desk" actionLabel="All" onAction={() => router.push("/insights")} />
            <View style={{ gap: space.md, marginTop: space.sm }}>
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} horizontal />
              ))}
            </View>
          </View>
        ) : null}

        {/* TRUST BAND */}
        <View style={styles.trustBand}>
          <Kicker>Track Record</Kicker>
          <Text variant="headingLg" style={{ marginTop: 6 }}>
            {EMINENT.credentialBadge}
          </Text>
          <View style={{ flexDirection: "row", gap: space.md, marginTop: space.xl }}>
            {TRUST_STATS.map((s) => (
              <View key={s.label} style={styles.trustStat}>
                <Text variant="displaySm" color={palette.navy800}>
                  {s.value}
                </Text>
                <Text variant="bodySm" color={colors.inkSecondary} style={{ fontSize: 12 }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="bodySm" color={colors.inkMuted} style={{ marginTop: space.lg, fontSize: 12 }}>
            Figures are indicative of our scale, not audited public statistics.
          </Text>
        </View>

        {/* CLOSING CTA */}
        <View style={{ paddingHorizontal: GUTTER, paddingTop: space.xxxl }}>
          <View style={styles.closing}>
            <LinearGradient colors={gradients.closing} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text variant="displayMd" color={palette.navy800} style={{ textAlign: "center" }}>
              {EMINENT.closingCta.headline}
            </Text>
            <Text variant="bodyMd" color={colors.inkSecondary} style={{ textAlign: "center", marginTop: space.md }}>
              {EMINENT.closingCta.body}
            </Text>
            <Text variant="label" color={colors.accentStrong} style={{ textAlign: "center", marginTop: space.md, letterSpacing: 1 }}>
              {EMINENT.closingCta.signature}
            </Text>
            <View style={{ gap: space.md, marginTop: space.xl, alignSelf: "stretch" }}>
              <Button label="Get in Touch" onPress={() => router.push("/contact")} fullWidth size="lg" />
              <Button
                label="Chat on WhatsApp"
                icon={MessageCircle}
                variant="whatsapp"
                onPress={() => openWhatsApp("Hi Eminent Enterprises, I'd like to know more about your services.")}
                fullWidth
                size="lg"
              />
            </View>
          </View>
        </View>
        <View style={{ height: space.xxxl }} />
      </Screen>
    </View>
  );
}

function BrandPanel({
  colorsPair,
  kicker,
  title,
  body,
  cta,
  onPress,
  outline,
}: {
  colorsPair: readonly [string, string];
  kicker: string;
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
  outline?: boolean;
}) {
  return (
    <View style={styles.brandPanel}>
      <LinearGradient colors={colorsPair} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Kicker>{kicker}</Kicker>
      <Text variant="displaySm" color={palette.navy800} style={{ marginTop: space.sm }}>
        {title}
      </Text>
      <Text variant="bodyMd" color={colors.inkSecondary} numberOfLines={4} style={{ marginTop: space.md }}>
        {body}
      </Text>
      <Button label={cta} iconRight={ArrowRight} variant={outline ? "outline" : "primary"} onPress={onPress} style={{ marginTop: space.xl }} />
    </View>
  );
}

function AudienceCard({ icon, title, body, linkLabel, onPress }: { icon: typeof Globe2; title: string; body: string; linkLabel?: string; onPress?: () => void }) {
  return (
    <View style={styles.audience}>
      <IconCircle icon={icon} />
      <Text variant="headingLg" style={{ marginTop: space.md }}>
        {title}
      </Text>
      <Text variant="bodyMd" color={colors.inkSecondary} style={{ marginTop: space.sm }}>
        {body}
      </Text>
      {linkLabel && onPress ? (
        <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: space.md }} accessibilityRole="link">
          <Text variant="label" color={colors.accentStrong}>
            {linkLabel}
          </Text>
          <ArrowRight size={15} color={colors.accentStrong} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center", gap: space.md },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  searchPanel: {
    marginTop: space.xxl,
    padding: space.lg,
    gap: space.md,
    borderRadius: radius.xxl,
    backgroundColor: "rgba(16,28,61,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: palette.paper,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    height: 50,
  },
  searchText: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.inkPrimary },
  pillarStrip: {
    backgroundColor: colors.surfaceSunken,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderHairline,
    paddingVertical: 14,
    flexGrow: 0,
  },
  pathwayGrid: { flexDirection: "row", flexWrap: "wrap", gap: space.md, marginTop: space.xxl, alignSelf: "stretch" },
  pathway: {
    width: "47.9%",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.xxl,
    paddingHorizontal: space.sm,
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    overflow: "hidden",
    backgroundColor: palette.paper,
    ...shadows.card,
  },
  brandPanel: { borderRadius: radius.xxl, overflow: "hidden", paddingHorizontal: space.xxl, paddingVertical: space.xxxl },
  pillarsBand: { backgroundColor: colors.surfaceSunken, paddingHorizontal: GUTTER, paddingVertical: space.xxxl, marginTop: space.xl },
  pillarGrid: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
  pillarCard: {
    width: "47.9%",
    alignItems: "center",
    gap: space.lg,
    paddingVertical: space.xxl,
    paddingHorizontal: space.md,
    borderRadius: radius.xxl,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    backgroundColor: palette.paper,
    ...shadows.card,
  },
  audience: {
    borderRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    backgroundColor: palette.paper,
    padding: space.xxl,
  },
  trustBand: { backgroundColor: colors.surfaceWarm, marginTop: space.huge, paddingHorizontal: GUTTER, paddingVertical: space.xxxl },
  trustStat: { flex: 1, borderLeftWidth: 2, borderLeftColor: colors.accentStrong, paddingLeft: space.md },
  closing: { borderRadius: radius.xxl, overflow: "hidden", paddingHorizontal: space.xl, paddingVertical: space.huge, alignItems: "center" },
});
