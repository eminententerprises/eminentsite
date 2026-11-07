import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CheckCircle2,
  Clock,
  GitCompareArrows,
  Heart,
  Home,
  Layers,
  Mail,
  MapPin,
  Maximize,
  Navigation,
  SearchX,
  Share2,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import type { PakistanFields, Property } from "@/types";
import { getAgentById } from "@/lib/repositories/agent-repository";
import { getLocationBySlug } from "@/data/locations";
import { formatAreaAuto } from "@/lib/area";
import { formatPKR } from "@/lib/format-pkr";
import { formatRelativeDate } from "@/lib/format-date";
import { whatsAppEnquiryMessage } from "@/lib/whatsapp";
import { openMaps, shareLink } from "@/lib/links";
import { similarProperties } from "@/lib/repositories/property-repository";
import { useProperties } from "@/state/properties";
import { useSaved } from "@/state/saved";
import { Badge, Button, Card, EmptyState, KeyValue, SectionHeader, SurveyLine, Text } from "@/components/ui";
import { CONTACT_BAR_HEIGHT, ContactBar, FocusStatusBar, RemoteImage, Screen } from "@/components/layout";
import { PriceText, PropertyCard } from "@/components/cards";
import { Gallery } from "@/components/gallery";
import { Glass } from "@/components/glass";
import { AreaConverter } from "@/components/area-converter";
import { colors, fonts, GUTTER, palette, radius, shadows, space } from "@/theme";

const FLAG_LABELS: [keyof PakistanFields, string][] = [
  ["cornerPlot", "Corner Plot"],
  ["boulevardFacing", "Boulevard Facing"],
  ["parkFacing", "Park Facing"],
  ["gasAvailable", "Gas Available"],
  ["electricityAvailable", "Electricity Available"],
  ["sewerage", "Sewerage"],
  ["servantQuarter", "Servant Quarter"],
  ["basement", "Basement"],
];

/** Same merge as the website's getPropertyHighlights: amenities + features + true-only flags. */
function highlightsFor(p: Property): string[] {
  const flags = FLAG_LABELS.filter(([k]) => p.pakistanFields[k] === true).map(([, l]) => l);
  return Array.from(new Set([...p.amenities, ...p.features, ...flags]));
}

export default function PropertyDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const { properties, getBySlug, loading } = useProperties();
  const { isShortlisted, toggleShortlist, isInCompare, toggleCompare } = useSaved();
  const property = getBySlug(String(slug));

  if (!property) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.surfaceBase }}>
        <FocusStatusBar style="dark" />
        <Pressable onPress={() => router.back()} style={[styles.fab, { position: "relative", margin: GUTTER }]} accessibilityLabel="Go back">
          <ArrowLeft size={20} color={palette.navy800} />
        </Pressable>
        {loading ? (
          <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: 80 }} />
        ) : (
          <EmptyState
            icon={SearchX}
            title="Listing not available"
            body="This property may have been sold, rented or removed."
            action={<Button label="Browse properties" onPress={() => router.replace("/search")} />}
          />
        )}
      </View>
    );
  }

  const p = property;
  const agent = getAgentById(p.agentId);
  const location = getLocationBySlug(p.location.areaSlug);
  const areaAverage = location?.basePricePerMarla;
  const vsAverage = p.pricePerMarla && areaAverage ? ((p.pricePerMarla - areaAverage) / areaAverage) * 100 : undefined;
  const highlights = highlightsFor(p);
  const similar = similarProperties(properties, p, 4);
  const saved = isShortlisted(p.id);
  const comparing = isInCompare(p.id);
  const pf = p.pakistanFields;

  const specs: [string, string][] = [
    ["Type", p.type],
    ["Area", formatAreaAuto(p.area.sqft)],
    ...(p.beds ? ([["Bedrooms", String(p.beds)]] as [string, string][]) : []),
    ...(p.baths ? ([["Bathrooms", String(p.baths)]] as [string, string][]) : []),
    ...(pf.floors ? ([["Floors", String(pf.floors)]] as [string, string][]) : []),
    ["Possession", pf.possession],
    ["Approval", pf.approval],
    ["Plot Documentation", pf.plotFileOrRegistry],
    ["Water Source", pf.waterSource],
    ["Reference", p.ref],
  ];

  // Indicative instalment — same assumptions as the website's MortgageSnippet.
  const loan = p.price * 0.8;
  const r = 0.19 / 12;
  const months = 15 * 12;
  const monthly = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceBase }}>
      <FocusStatusBar style="light" />
      <Screen padded={false} bottomInset={false} extraBottom={CONTACT_BAR_HEIGHT + insets.bottom}>
        <Gallery images={p.images} height={340 + insets.top} />

        <View style={{ paddingHorizontal: GUTTER, paddingTop: space.xl, gap: space.md }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <Badge label={p.purpose === "buy" ? "For Sale" : "For Rent"} variant="warm" />
            {p.isFeatured ? <Badge label="Featured" variant="accent" /> : null}
            {p.isVerified ? <Badge label="Verified" variant="verified" /> : null}
            <Badge label={pf.approval} variant="outline" />
          </View>
          <Text variant="displaySm" color={palette.navy800}>
            {p.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <MapPin size={16} color={colors.inkMuted} />
            <Text variant="bodyMd" color={colors.inkSecondary} style={{ flex: 1 }}>
              {[p.location.sector, p.location.area, p.location.cityLabel].filter(Boolean).join(", ")}
            </Text>
          </View>
          <Text variant="bodySm" color={colors.inkMuted}>
            Ref: {p.ref} · {formatRelativeDate(p.addedAt)}
          </Text>

          {/* PRICE */}
          <View style={styles.priceBlock}>
            <PriceText amount={p.price} perMonth={p.priceUnit === "month"} size="lg" />
            <Text variant="mono" color={colors.inkMuted}>
              {formatPKR(p.price, { perMonth: p.priceUnit === "month" }).full}
            </Text>
            {p.pricePerMarla ? (
              <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                <Text variant="mono" color={colors.inkSecondary}>
                  {formatPKR(p.pricePerMarla).short} per Marla
                </Text>
                {typeof vsAverage === "number" ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    {vsAverage > 0 ? <TrendingUp size={14} color={colors.danger} /> : <TrendingDown size={14} color={colors.success} />}
                    <Text variant="bodySm" color={vsAverage > 0 ? colors.danger : colors.success}>
                      {Math.abs(vsAverage).toFixed(0)}% {vsAverage > 0 ? "above" : "below"} area average
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <View style={styles.actionRow}>
              <ActionPill icon={Heart} label={saved ? "Saved" : "Save"} active={saved} onPress={() => toggleShortlist(p.id)} />
              <ActionPill icon={GitCompareArrows} label={comparing ? "Comparing" : "Compare"} active={comparing} onPress={() => toggleCompare(p.id)} />
              <ActionPill icon={Share2} label="Share" onPress={() => shareLink(p.title, `/properties/${p.slug}`)} />
            </View>
          </View>

          {/* KEY SPECS */}
          <View style={styles.specGrid}>
            {typeof p.beds === "number" ? <SpecTile icon={BedDouble} value={String(p.beds)} label="Beds" /> : null}
            {typeof p.baths === "number" ? <SpecTile icon={Bath} value={String(p.baths)} label="Baths" /> : null}
            <SpecTile icon={Maximize} value={formatAreaAuto(p.area.sqft)} label="Area" />
            {pf.floors ? <SpecTile icon={Layers} value={String(pf.floors)} label="Floors" /> : null}
            <SpecTile icon={Home} value={p.type} label="Type" />
          </View>

          {/* OVERVIEW */}
          <SectionTitle>Overview</SectionTitle>
          <Text variant="bodyLg" color={colors.inkSecondary}>
            {p.description}
          </Text>

          <SectionTitle>Property Details</SectionTitle>
          <Card padded={false} style={{ paddingHorizontal: space.lg }}>
            {specs.map(([label, value], i) => (
              <KeyValue key={label} label={label} value={value} last={i === specs.length - 1} />
            ))}
          </Card>

          {highlights.length > 0 ? (
            <>
              <SectionTitle>Features & Amenities</SectionTitle>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
                {highlights.map((h) => (
                  <View key={h} style={styles.highlight}>
                    <CheckCircle2 size={15} color={colors.success} />
                    <Text variant="bodySm">{h}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {p.floorPlans.length > 0 ? (
            <>
              <SectionTitle>Floor Plans</SectionTitle>
              <View style={{ gap: space.md }}>
                {p.floorPlans.map((fp) => (
                  <View key={fp.src} style={{ gap: 6 }}>
                    <RemoteImage src={fp.src} accessibilityLabel={fp.alt} style={{ aspectRatio: 4 / 3, borderRadius: radius.lg }} contentFit="contain" />
                    <Text variant="bodySm" color={colors.inkSecondary} style={{ fontFamily: fonts.bodySemi }}>
                      {fp.label}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          <SectionTitle>Location</SectionTitle>
          <Card style={{ gap: space.md }}>
            <View style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
              <MapPin size={20} color={colors.accentStrong} />
              <View style={{ flex: 1 }}>
                <Text variant="headingSm">{p.location.area}</Text>
                <Text variant="bodySm" color={colors.inkMuted}>
                  {p.location.cityLabel}
                  {p.location.sector ? ` · ${p.location.sector}` : ""}
                </Text>
              </View>
            </View>
            <Button
              label="Open in Maps"
              icon={Navigation}
              variant="outline"
              size="sm"
              onPress={() => openMaps(p.location.coords.lat, p.location.coords.lng, `${p.location.area}, ${p.location.cityLabel}`)}
            />
            <Text variant="bodySm" color={colors.inkMuted}>
              Pin shows the society/area centre, not the exact plot. Ask us for the precise location.
            </Text>
          </Card>

          <SectionTitle>Area Converter</SectionTitle>
          <Card>
            <AreaConverter initialSqft={p.area.sqft} />
          </Card>

          {/* AGENT */}
          {agent ? (
            <>
              <SectionTitle>Your Consultant</SectionTitle>
              <Card style={{ gap: space.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                  <RemoteImage src={agent.photo} style={{ width: 56, height: 56, borderRadius: 28 }} accessibilityLabel={agent.name} />
                  <View style={{ flex: 1 }}>
                    <Text variant="headingSm">{agent.name}</Text>
                    <Text variant="bodySm" color={colors.inkSecondary}>
                      {agent.role}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Clock size={14} color={colors.inkMuted} />
                  <Text variant="bodySm" color={colors.inkMuted}>
                    Typically responds within {agent.responseTimeHours}h
                  </Text>
                </View>
                <Button
                  label="Send Enquiry"
                  icon={Mail}
                  variant="outline"
                  fullWidth
                  onPress={() => router.push({ pathname: "/enquire", params: { ref: p.ref, title: p.title } })}
                />
              </Card>
            </>
          ) : null}

          {/* MORTGAGE */}
          {p.purpose === "buy" ? (
            <View style={styles.mortgage}>
              <Text variant="label" color={colors.inkSecondary}>
                Estimated Instalment
              </Text>
              <Text variant="priceLg" color={palette.navy800} style={{ marginTop: 6 }}>
                {formatPKR(monthly, { perMonth: true }).short}
              </Text>
              <Text variant="bodySm" color={colors.inkMuted} style={{ marginTop: 4 }}>
                Based on 20% down payment, 15-year tenure, ~19% indicative markup.
              </Text>
              <Pressable onPress={() => router.push({ pathname: "/tools/mortgage", params: { price: String(p.price) } })} style={{ marginTop: space.md }} accessibilityRole="link">
                <Text variant="label" color={colors.accentStrong}>
                  Open full calculator →
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {similar.length > 0 ? (
          <View style={{ paddingHorizontal: GUTTER, marginTop: space.xxl }}>
            <SurveyLine />
            <SectionHeader title="Similar Properties" style={{ marginTop: space.lg, marginBottom: space.lg }} />
            <View style={{ gap: space.lg }}>
              {similar.map((s) => (
                <PropertyCard key={s.id} property={s} />
              ))}
            </View>
          </View>
        ) : null}
      </Screen>

      {/* Floating top buttons over the gallery */}
      <View style={[styles.topBar, { top: insets.top + space.sm }]} pointerEvents="box-none">
        <GlassFab onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} label="Go back">
          <ArrowLeft size={20} color={palette.navy800} />
        </GlassFab>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          <GlassFab onPress={() => shareLink(p.title, `/properties/${p.slug}`)} label="Share listing">
            <Share2 size={19} color={palette.navy800} />
          </GlassFab>
          <GlassFab onPress={() => toggleShortlist(p.id)} label={saved ? "Remove from saved" : "Save property"}>
            <Heart size={19} color={saved ? colors.danger : palette.navy800} fill={saved ? colors.danger : "transparent"} />
          </GlassFab>
        </View>
      </View>

      <ContactBar whatsappMessage={whatsAppEnquiryMessage({ ref: p.ref, title: p.title })} />
    </View>
  );
}

function GlassFab({ onPress, label, children }: { onPress: () => void; label: string; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}>
      <Glass radius={22} intensity={70} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
        {children}
      </Glass>
    </Pressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="headingLg" color={palette.navy800} style={{ marginTop: space.xl }}>
      {children}
    </Text>
  );
}

function SpecTile({ icon: IconCmp, value, label }: { icon: typeof Bath; value: string; label: string }) {
  return (
    <View style={styles.specTile} accessibilityLabel={`${label}: ${value}`}>
      <IconCmp size={20} color={colors.accentStrong} />
      <Text variant="headingSm" numberOfLines={1}>
        {value}
      </Text>
      <Text variant="bodySm" color={colors.inkMuted} style={{ fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function ActionPill({ icon: IconCmp, label, active, onPress }: { icon: typeof Heart; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.pill, active && { backgroundColor: palette.iris50, borderColor: colors.accentSoft }, pressed && { opacity: 0.75 }]}
    >
      <IconCmp size={16} color={active ? colors.accentStrong : colors.inkSecondary} fill={active && IconCmp === Heart ? colors.accentStrong : "transparent"} />
      <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi }} color={active ? colors.accentStrong : colors.inkSecondary}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { position: "absolute", left: GUTTER, right: GUTTER, flexDirection: "row", justifyContent: "space-between" },
  fab: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  priceBlock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    paddingVertical: space.lg,
    marginTop: space.sm,
    gap: 2,
  },
  actionRow: { flexDirection: "row", gap: space.sm, marginTop: space.lg },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.sm },
  specTile: {
    flexBasis: "31%",
    flexGrow: 1,
    backgroundColor: palette.cream100,
    borderRadius: radius.lg,
    padding: space.md,
    gap: 4,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mortgage: {
    marginTop: space.xl,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    padding: space.xl,
  },
});
