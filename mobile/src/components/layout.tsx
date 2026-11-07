import type { ReactNode } from "react";
import { RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, type ImageProps } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Phone } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "expo-router";
import { Kicker, Text, Button } from "@/components/ui";
import { resolveImageSrc } from "@/lib/image";
import { callNumber, openWhatsApp } from "@/lib/links";
import { colors, GUTTER, gradients, palette, space } from "@/theme";

/** Scrollable page body with consistent gutters and safe bottom padding. */
export function Screen({
  children,
  padded = true,
  style,
  contentStyle,
  refreshing,
  onRefresh,
  bottomInset = true,
  extraBottom = 0,
}: {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  bottomInset?: boolean;
  extraBottom?: number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.surfaceBase }, style]}
      contentContainerStyle={[
        padded && { paddingHorizontal: GUTTER, paddingTop: space.xl },
        { paddingBottom: (bottomInset ? insets.bottom : 0) + space.huge + extraBottom },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.accent} colors={[colors.accent]} /> : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

/** Kicker + display heading + intro paragraph at the top of a page. */
export function PageIntro({ kicker, title, body, style }: { kicker?: string; title: string; body?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ gap: 8 }, style]}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <Text variant="displayMd" color={palette.navy800}>
        {title}
      </Text>
      {body ? (
        <Text variant="bodyLg" color={colors.inkSecondary}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}

/** Photo with a navy fade and overlaid copy — the mobile take on the website's PageHero. */
export function HeroBanner({
  image,
  kicker,
  title,
  body,
  children,
  height = 360,
  topInset = 0,
}: {
  image: string;
  kicker?: string;
  title: string;
  body?: string;
  children?: ReactNode;
  height?: number;
  topInset?: number;
}) {
  return (
    <View style={{ minHeight: height, backgroundColor: palette.navy900, justifyContent: "flex-end" }}>
      <RemoteImage src={image} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={{ paddingHorizontal: GUTTER, paddingTop: topInset + space.xxxl, paddingBottom: space.xxxl, gap: 10 }}>
        {kicker ? <Kicker color={palette.iris300}>{kicker}</Kicker> : null}
        <Text variant="displayLg" color={palette.paper}>
          {title}
        </Text>
        {body ? (
          <Text variant="bodyMd" color={colors.inkInvertedMuted} numberOfLines={4}>
            {body}
          </Text>
        ) : null}
        {children}
      </View>
    </View>
  );
}

/** expo-image wrapper that applies the website's image-source rewrite and a brand placeholder colour. */
export function RemoteImage({ src, style, contentFit = "cover", ...rest }: Omit<ImageProps, "source"> & { src?: string }) {
  const uri = resolveImageSrc(src);
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[{ backgroundColor: palette.navy100 }, style]}
      contentFit={contentFit}
      transition={250}
      cachePolicy="memory-disk"
      {...rest}
    />
  );
}

/** Sticky bottom bar with Call + WhatsApp — mirrors the website's mobile action bar. */
export function ContactBar({ whatsappMessage, phone, primary }: { whatsappMessage: string; phone?: string; primary?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
      {primary ?? (
        <Button label="Call" icon={Phone} variant="outline" onPress={() => callNumber(phone)} style={{ flex: 1 }} fullWidth />
      )}
      <Button label="WhatsApp" icon={MessageCircle} variant="whatsapp" onPress={() => openWhatsApp(whatsappMessage)} style={{ flex: 1 }} fullWidth />
    </View>
  );
}

export const CONTACT_BAR_HEIGHT = 80;

/** Status bar style that only applies while this screen is focused (tabs stay mounted). */
export function FocusStatusBar({ style }: { style: "light" | "dark" }) {
  const focused = useIsFocused();
  return focused ? <StatusBar style={style} /> : null;
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: space.md,
    paddingHorizontal: GUTTER,
    paddingTop: space.md,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
  },
});
