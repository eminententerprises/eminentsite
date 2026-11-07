import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Bath, BedDouble, GitCompareArrows, Heart, MapPin, Maximize, ShieldCheck } from "lucide-react-native";
import type { Article, ConstructionProject, Project, Property } from "@/types";
import { Badge, PressableCard, Text } from "@/components/ui";
import { RemoteImage } from "@/components/layout";
import { formatPKR, formatPKRRange } from "@/lib/format-pkr";
import { formatAreaAuto } from "@/lib/area";
import { useSaved } from "@/state/saved";
import { colors, fonts, gradients, palette, radius, shadows, space } from "@/theme";

/* ------------------------------------------------------------ Property card */

export function PriceText({ amount, perMonth, size = "md" }: { amount: number; perMonth?: boolean; size?: "md" | "lg" }) {
  const formatted = formatPKR(amount, { perMonth });
  return (
    <Text variant={size === "lg" ? "priceLg" : "price"} color={palette.navy800} accessibilityLabel={formatted.full}>
      {formatted.short}
    </Text>
  );
}

function RoundIconButton({ active, onPress, label, kind }: { active: boolean; onPress: () => void; label: string; kind: "heart" | "compare" }) {
  const IconCmp = kind === "heart" ? Heart : GitCompareArrows;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={6}
      style={[styles.roundBtn, active && kind === "compare" && { backgroundColor: colors.accent }]}
    >
      <IconCmp
        size={17}
        color={active ? (kind === "heart" ? colors.danger : palette.paper) : palette.navy800}
        fill={active && kind === "heart" ? colors.danger : "transparent"}
        strokeWidth={2.2}
      />
    </Pressable>
  );
}

export function PropertyCard({ property, style, compact }: { property: Property; style?: StyleProp<ViewStyle>; compact?: boolean }) {
  const { isShortlisted, toggleShortlist, isInCompare, toggleCompare } = useSaved();
  const cover = property.images[0];
  const saved = isShortlisted(property.id);
  const comparing = isInCompare(property.id);

  return (
    <PressableCard
      onPress={() => router.push(`/property/${property.slug}`)}
      accessibilityLabel={`${property.title}, ${formatPKR(property.price, { perMonth: property.priceUnit === "month" }).short}`}
      style={[{ overflow: "hidden" }, style]}
    >
      <View style={{ aspectRatio: compact ? 16 / 11 : 4 / 3 }}>
        <RemoteImage src={cover?.src} accessibilityLabel={cover?.alt} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={gradients.cardFade} style={[StyleSheet.absoluteFill, { top: "55%" }]} />
        <View style={styles.badgeRow}>
          {property.isFeatured ? <Badge label="Featured" variant="accent" /> : null}
          <Badge label={property.purpose === "buy" ? "For Sale" : "For Rent"} />
        </View>
        <View style={styles.actionCol}>
          <RoundIconButton kind="heart" active={saved} label={saved ? "Remove from saved" : "Save property"} onPress={() => toggleShortlist(property.id)} />
          <RoundIconButton kind="compare" active={comparing} label={comparing ? "Remove from compare" : "Add to compare"} onPress={() => toggleCompare(property.id)} />
        </View>
        <Text variant="mono" color={palette.paper} style={styles.typeOnImage}>
          {property.type}
        </Text>
      </View>

      <View style={{ padding: space.lg, gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <PriceText amount={property.price} perMonth={property.priceUnit === "month"} />
          {property.isVerified ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={14} color={colors.success} />
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 0.8, textTransform: "uppercase" }} color={colors.success}>
                Verified
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="headingSm" numberOfLines={2}>
          {property.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MapPin size={14} color={colors.inkMuted} />
          <Text variant="bodySm" color={colors.inkSecondary} numberOfLines={1} style={{ flex: 1 }}>
            {property.location.area}, {property.location.cityLabel}
          </Text>
        </View>
        <View style={styles.specRow}>
          {typeof property.beds === "number" ? <Spec icon="bed" value={String(property.beds)} label="beds" /> : null}
          {typeof property.baths === "number" ? <Spec icon="bath" value={String(property.baths)} label="baths" /> : null}
          <Spec icon="area" value={formatAreaAuto(property.area.sqft)} label="area" />
        </View>
      </View>
    </PressableCard>
  );
}

function Spec({ icon, value, label }: { icon: "bed" | "bath" | "area"; value: string; label: string }) {
  const IconCmp = icon === "bed" ? BedDouble : icon === "bath" ? Bath : Maximize;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }} accessibilityLabel={`${value} ${label}`}>
      <IconCmp size={16} color={colors.inkMuted} />
      <Text variant="bodySm" color={colors.inkSecondary} style={{ fontFamily: fonts.mono }}>
        {value}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------- Project card */

export function ProjectCard({ project, style }: { project: Project; style?: StyleProp<ViewStyle> }) {
  const prices = project.unitTypes.map((u) => u.startingPrice);
  const cover = project.images[0];
  return (
    <PressableCard onPress={() => router.push(`/projects/${project.slug}`)} accessibilityLabel={project.name} style={[{ overflow: "hidden" }, style]}>
      <View style={{ aspectRatio: 16 / 10 }}>
        <RemoteImage src={cover?.src} accessibilityLabel={cover?.alt} style={StyleSheet.absoluteFill} />
        <View style={styles.badgeRow}>
          <Badge label={project.possession} variant="dark" />
          <Badge label={project.approval} />
        </View>
      </View>
      <View style={{ padding: space.lg, gap: 6 }}>
        <Text variant="headingLg" color={palette.navy800}>
          {project.name}
        </Text>
        <Text variant="bodySm" color={colors.inkSecondary} numberOfLines={2}>
          {project.tagline}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
          <MapPin size={14} color={colors.inkMuted} />
          <Text variant="bodySm" color={colors.inkMuted}>
            {project.location.area}, {project.location.cityLabel}
          </Text>
        </View>
        {prices.length ? (
          <Text variant="price" color={colors.accentStrong} style={{ marginTop: 4, fontSize: 15 }}>
            {formatPKRRange(Math.min(...prices), Math.max(...prices))}
          </Text>
        ) : null}
      </View>
    </PressableCard>
  );
}

/* ------------------------------------------------------------- Article card */

export function ArticleCard({ article, style, horizontal }: { article: Article; style?: StyleProp<ViewStyle>; horizontal?: boolean }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" });
  if (horizontal) {
    return (
      <PressableCard onPress={() => router.push(`/insights/${article.slug}`)} accessibilityLabel={article.title} style={[{ flexDirection: "row", overflow: "hidden" }, style]}>
        <RemoteImage src={article.coverImage} style={{ width: 110, minHeight: 110 }} />
        <View style={{ flex: 1, padding: space.md, gap: 6 }}>
          <Badge label={article.category} variant="warm" />
          <Text variant="headingSm" numberOfLines={2}>
            {article.title}
          </Text>
          <Text variant="bodySm" color={colors.inkMuted}>
            {date} · {article.readMinutes} min read
          </Text>
        </View>
      </PressableCard>
    );
  }
  return (
    <PressableCard onPress={() => router.push(`/insights/${article.slug}`)} accessibilityLabel={article.title} style={[{ overflow: "hidden" }, style]}>
      <RemoteImage src={article.coverImage} style={{ aspectRatio: 16 / 10 }} />
      <View style={{ padding: space.lg, gap: 8 }}>
        <Badge label={article.category} variant="warm" />
        <Text variant="headingSm" numberOfLines={2}>
          {article.title}
        </Text>
        <Text variant="bodySm" color={colors.inkMuted}>
          {date} · {article.readMinutes} min read
        </Text>
      </View>
    </PressableCard>
  );
}

/* ------------------------------------------------------ Case study (Buraq) */

export function CaseStudyCard({ project, style }: { project: ConstructionProject; style?: StyleProp<ViewStyle> }) {
  const cover = project.afterImages[0] ?? project.beforeImages[0];
  return (
    <PressableCard onPress={() => router.push(`/construction/${project.slug}`)} accessibilityLabel={project.title} style={[{ overflow: "hidden" }, style]}>
      <View style={{ aspectRatio: 4 / 3 }}>
        <RemoteImage src={cover?.src} accessibilityLabel={cover?.alt} style={StyleSheet.absoluteFill} />
        <View style={styles.badgeRow}>
          <Badge label={project.qualityTier} variant="accent" />
        </View>
      </View>
      <View style={{ padding: space.lg, gap: 4 }}>
        <Text variant="headingSm">{project.title}</Text>
        <Text variant="bodySm" color={colors.inkSecondary}>
          {project.location}
        </Text>
        <Text variant="mono" color={colors.inkMuted} style={{ marginTop: 4 }}>
          {project.coveredAreaSqft.toLocaleString("en-PK")} sq ft · {project.storeys} storey · {project.year}
        </Text>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  badgeRow: { position: "absolute", top: 12, left: 12, flexDirection: "row", gap: 6, flexWrap: "wrap", right: 60 },
  actionCol: { position: "absolute", top: 12, right: 12, gap: 8 },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  typeOnImage: { position: "absolute", left: 14, bottom: 10, fontSize: 11.5, letterSpacing: 0.6, textTransform: "uppercase" },
  specRow: {
    flexDirection: "row",
    gap: 18,
    flexWrap: "wrap",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
    paddingTop: 10,
    marginTop: 2,
  },
});

export const cardRadius = radius.xl;
