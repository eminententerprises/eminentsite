import type { ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { palette } from "@/theme";

/**
 * Frosted "glass" surface, Apple-style.
 *
 * iOS: real system material blur. Android: a frosted layer (translucent fill,
 * top highlight, white hairline edge). Android's native blur needs a target
 * view wrapping every screen, which is fragile across navigators, so this
 * fallback gives the same look reliably on every device.
 */
export function Glass({
  children,
  style,
  tone = "light",
  radius = 24,
  intensity = 60,
  elevated = true,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: "light" | "dark";
  radius?: number;
  intensity?: number;
  elevated?: boolean;
}) {
  const dark = tone === "dark";
  const ios = Platform.OS === "ios";
  const fill = ios ? (dark ? "rgba(16,28,61,0.35)" : "rgba(255,255,255,0.55)") : dark ? "rgba(16,28,61,0.82)" : "rgba(255,255,255,0.93)";

  return (
    // Android draws elevation from the view background, so the fill lives on the outer view there.
    <View style={[{ borderRadius: radius }, !ios && { backgroundColor: fill }, elevated && (dark ? styles.shadowDark : styles.shadowLight), style]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: "hidden" }]} pointerEvents="none">
        {Platform.OS === "ios" ? (
          <BlurView intensity={intensity} tint={dark ? "systemThinMaterialDark" : "systemThinMaterialLight"} style={StyleSheet.absoluteFill} />
        ) : null}
        {ios ? <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} /> : null}
        <LinearGradient
          colors={dark ? ["rgba(255,255,255,0.14)", "rgba(255,255,255,0)"] : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.55 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: radius, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: dark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.95)" },
          ]}
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowLight: Platform.select<ViewStyle>({
    android: { elevation: 8, shadowColor: palette.navy800 },
    default: { shadowColor: palette.navy800, shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  })!,
  shadowDark: Platform.select<ViewStyle>({
    android: { elevation: 10, shadowColor: "#000" },
    default: { shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  })!,
});
