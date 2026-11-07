import type { ComponentType, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, type LucideProps } from "lucide-react-native";
import { colors, fonts, gradients, palette, radius, shadows, space, type, type TypeVariant } from "@/theme";

export type Icon = ComponentType<LucideProps>;

/* ------------------------------------------------------------------ Text */

export function Text({
  variant = "bodyMd",
  color,
  style,
  ...props
}: RNTextProps & { variant?: TypeVariant; color?: string }) {
  return (
    <RNText
      maxFontSizeMultiplier={1.4}
      {...props}
      style={[{ color: colors.inkPrimary }, type[variant], color ? { color } : null, style]}
    />
  );
}

/** Small uppercase kicker above section headings — "text-label ... text-accent-strong" on the web. */
export function Kicker({ children, color = colors.accentStrong, style }: { children: ReactNode; color?: string; style?: StyleProp<TextStyle> }) {
  return (
    <Text variant="label" color={color} style={style}>
      {children}
    </Text>
  );
}

/* ---------------------------------------------------------------- Button */

type ButtonVariant = "primary" | "outline" | "ghost" | "whatsapp" | "inverted" | "danger";

export function Button({
  label,
  onPress,
  variant = "primary",
  icon: IconCmp,
  iconRight: IconRight,
  loading,
  disabled,
  size = "md",
  style,
  fullWidth,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: Icon;
  iconRight?: Icon;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}) {
  const height = size === "sm" ? 40 : size === "lg" ? 54 : 48;
  const fg =
    variant === "outline" || variant === "ghost"
      ? colors.accentStrong
      : variant === "inverted"
        ? palette.navy900
        : palette.paper;
  const isDisabled = disabled || loading;

  const content = (
    <View style={[styles.btnInner, { height, paddingHorizontal: size === "sm" ? 14 : 20 }]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {IconCmp ? <IconCmp size={18} color={fg} strokeWidth={2.2} /> : null}
          <Text variant="label" color={fg} style={{ fontFamily: fonts.bodyBold, fontSize: size === "sm" ? 12 : 13, letterSpacing: 1.1 }}>
            {label}
          </Text>
          {IconRight ? <IconRight size={18} color={fg} strokeWidth={2.2} /> : null}
        </>
      )}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        fullWidth && { alignSelf: "stretch" },
        variant === "outline" && styles.btnOutline,
        variant === "whatsapp" && { backgroundColor: palette.whatsapp },
        variant === "inverted" && { backgroundColor: palette.paper },
        variant === "danger" && { backgroundColor: colors.danger },
        variant === "primary" && shadows.accent,
        { opacity: isDisabled ? 0.55 : pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btnGradient}>
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  );
}

/* ----------------------------------------------------------------- Badge */

type BadgeVariant = "accent" | "neutral" | "verified" | "outline" | "dark" | "warm";

export function Badge({ label, variant = "neutral", style }: { label: string; variant?: BadgeVariant; style?: StyleProp<ViewStyle> }) {
  const map: Record<BadgeVariant, { bg: string; fg: string; border?: string }> = {
    accent: { bg: colors.accent, fg: palette.paper },
    neutral: { bg: "rgba(255,255,255,0.94)", fg: palette.navy800 },
    verified: { bg: colors.success, fg: palette.paper },
    outline: { bg: "transparent", fg: colors.inkSecondary, border: colors.borderStrong },
    dark: { bg: "rgba(16,28,61,0.78)", fg: palette.paper },
    warm: { bg: palette.cream200, fg: palette.navy800 },
  };
  const s = map[variant];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.border ?? "transparent" }, style]}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 0.9, textTransform: "uppercase" }} color={s.fg}>
        {label}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ Card */

export function Card({ children, style, padded = true }: { children: ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean }) {
  return <View style={[styles.card, padded && { padding: space.lg }, style]}>{children}</View>;
}

export function PressableCard({ children, style, onPress, accessibilityLabel }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress: () => void; accessibilityLabel?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.95 : 1 }, style]}
    >
      {children}
    </Pressable>
  );
}

/* --------------------------------------------------------- Section header */

export function SectionHeader({
  kicker,
  title,
  actionLabel,
  onAction,
  style,
  align = "left",
}: {
  kicker?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  align?: "left" | "center";
}) {
  return (
    <View style={[styles.sectionHeader, align === "center" && { flexDirection: "column", alignItems: "center" }, style]}>
      <View style={{ flex: align === "center" ? undefined : 1, alignItems: align === "center" ? "center" : "flex-start" }}>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <Text variant="displaySm" style={{ marginTop: kicker ? 6 : 0, textAlign: align }} color={palette.navy800}>
          {title}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="link" style={styles.sectionAction}>
          <Text variant="label" color={colors.accentStrong} style={{ letterSpacing: 1 }}>
            {actionLabel}
          </Text>
          <ChevronRight size={16} color={colors.accentStrong} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ----------------------------------------------------------- Survey line */

/** The website's signature "survey line" divider — a ruled line with tick marks. */
export function SurveyLine({ ticks = 24, label, inverted, style }: { ticks?: number; label?: string; inverted?: boolean; style?: StyleProp<ViewStyle> }) {
  const color = inverted ? palette.iris300 : colors.accent;
  return (
    <View style={[{ paddingVertical: space.sm }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {label ? (
        <Text variant="label" color={color} style={{ marginBottom: 6, fontSize: 10 }}>
          {label}
        </Text>
      ) : null}
      <View style={{ height: 1.5, backgroundColor: color, opacity: 0.7 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {Array.from({ length: ticks + 1 }).map((_, i) => (
          <View key={i} style={{ width: 1, height: i % 4 === 0 ? 9 : 5, backgroundColor: color, opacity: 0.55 }} />
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------- Icon tile */

/** Gradient iris square holding an icon — used on pathways and pillars. */
export function IconTile({ icon: IconCmp, size = 48 }: { icon: Icon; size?: number }) {
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ width: size, height: size, borderRadius: size * 0.32, alignItems: "center", justifyContent: "center" }, shadows.accent]}
    >
      <IconCmp size={size * 0.44} color={palette.paper} strokeWidth={2} />
    </LinearGradient>
  );
}

export function IconCircle({ icon: IconCmp, size = 44, bg = colors.accentSoft, fg = colors.accentStrong }: { icon: Icon; size?: number; bg?: string; fg?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <IconCmp size={size * 0.45} color={fg} strokeWidth={2} />
    </View>
  );
}

/* ----------------------------------------------------------------- Misc */

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.borderHairline }, style]} />;
}

export function Chip({ label, selected, onPress, icon: IconCmp }: { label: string; selected?: boolean; onPress?: () => void; icon?: Icon }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, { opacity: pressed ? 0.8 : 1 }]}
    >
      {IconCmp ? <IconCmp size={15} color={selected ? palette.paper : colors.inkSecondary} /> : null}
      <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi }} color={selected ? palette.paper : colors.inkPrimary}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ListRow({
  icon: IconCmp,
  title,
  subtitle,
  onPress,
  right,
  last,
}: {
  icon?: Icon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={({ pressed }) => [styles.listRow, !last && styles.listRowBorder, pressed && { backgroundColor: palette.cream100 }]}
    >
      {IconCmp ? (
        <View style={styles.listRowIcon}>
          <IconCmp size={19} color={colors.accentStrong} strokeWidth={2} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text variant="headingSm">{title}</Text>
        {subtitle ? (
          <Text variant="bodySm" color={colors.inkMuted} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={colors.inkMuted} /> : null)}
    </Pressable>
  );
}

export function KeyValue({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.kv, !last && styles.listRowBorder]}>
      <Text variant="bodySm" color={colors.inkSecondary} style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, flexShrink: 1, textAlign: "right" }}>
        {value}
      </Text>
    </View>
  );
}

export function Disclaimer({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.disclaimer, style]}>
      <Text variant="bodySm" color={colors.inkSecondary}>
        {children}
      </Text>
    </View>
  );
}

export function EmptyState({ icon: IconCmp, title, body, action }: { icon: Icon; title: string; body?: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <IconCircle icon={IconCmp} size={64} />
      <Text variant="headingLg" style={{ marginTop: space.lg, textAlign: "center" }} color={palette.navy800}>
        {title}
      </Text>
      {body ? (
        <Text variant="bodyMd" color={colors.inkSecondary} style={{ marginTop: space.sm, textAlign: "center", maxWidth: 320 }}>
          {body}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: space.xl }}>{action}</View> : null}
    </View>
  );
}

export function Bullet({ children, icon: IconCmp, color = colors.success }: { children: ReactNode; icon?: Icon; color?: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
      {IconCmp ? (
        <IconCmp size={18} color={color} style={{ marginTop: 2 }} />
      ) : (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, marginTop: 8 }} />
      )}
      <Text variant="bodyMd" color={colors.inkSecondary} style={{ flex: 1 }}>
        {children}
      </Text>
    </View>
  );
}

export type { PressableProps };

const styles = StyleSheet.create({
  btn: { borderRadius: radius.pill, overflow: "hidden", alignSelf: "flex-start", backgroundColor: colors.accent },
  btnGradient: { borderRadius: radius.pill },
  btnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  btnOutline: { backgroundColor: palette.paper, borderWidth: 1.5, borderColor: colors.accentSoft },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, alignSelf: "flex-start" },
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    ...shadows.card,
  },
  sectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: space.md },
  sectionAction: { flexDirection: "row", alignItems: "center", gap: 2, paddingBottom: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    backgroundColor: palette.paper,
  },
  chipSelected: { backgroundColor: palette.navy800, borderColor: palette.navy800 },
  listRow: { flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: 14, paddingHorizontal: space.lg },
  listRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderHairline },
  listRowIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: palette.iris50, alignItems: "center", justifyContent: "center" },
  kv: { flexDirection: "row", alignItems: "center", gap: space.lg, paddingVertical: 11 },
  disclaimer: {
    backgroundColor: palette.cream200,
    borderLeftWidth: 3,
    borderLeftColor: palette.gold500,
    padding: space.md,
    borderRadius: radius.md,
  },
  empty: { alignItems: "center", paddingVertical: 56, paddingHorizontal: 24 },
});
