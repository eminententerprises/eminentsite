import type { ReactNode } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Kicker, Text } from "@/components/ui";
import { colors, palette, radius, space } from "@/theme";

/** Dark navy result panel used by every calculator. */
export function ResultPanel({ kicker, value, caption, children }: { kicker: string; value: string; caption?: string; children?: ReactNode }) {
  return (
    <View style={{ borderRadius: radius.xxl, overflow: "hidden" }} accessibilityLiveRegion="polite">
      <LinearGradient colors={[palette.navy800, palette.navy900]} style={{ padding: space.xxl, gap: 6 }}>
        <Kicker color={palette.iris300}>{kicker}</Kicker>
        <Text variant="priceLg" color={palette.paper} style={{ fontSize: 28, lineHeight: 34 }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {value}
        </Text>
        {caption ? (
          <Text variant="bodySm" color={colors.inkInvertedMuted}>
            {caption}
          </Text>
        ) : null}
        {children}
      </LinearGradient>
    </View>
  );
}

export function ResultLine({ label, value, inverted, strong }: { label: string; value: string; inverted?: boolean; strong?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space.md, paddingVertical: 8 }}>
      <Text variant="bodySm" color={inverted ? colors.inkInvertedMuted : colors.inkSecondary} style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="mono" color={inverted ? palette.paper : strong ? palette.navy800 : colors.inkPrimary} style={strong ? { fontFamily: "JetBrainsMono_700Bold" } : undefined}>
        {value}
      </Text>
    </View>
  );
}

/** Proportional bar for cost breakdowns. */
export function ShareBar({ share }: { share: number }) {
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: palette.iris100, overflow: "hidden" }}>
      <View style={{ width: `${Math.max(2, Math.min(100, share * 100))}%`, height: "100%", backgroundColor: colors.accent }} />
    </View>
  );
}
