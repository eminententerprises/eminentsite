/**
 * Design tokens, mirrored 1:1 from the website's src/app/globals.css
 * (primitive + semantic layers). Change a value here only if the website's
 * token changed too, so web and app stay visually identical.
 */
import { Platform, type TextStyle, type ViewStyle } from "react-native";

export const palette = {
  navy50: "#eef2f8",
  navy100: "#dce3f1",
  navy200: "#b4c4df",
  navy300: "#8aa0c7",
  navy400: "#5c78a5",
  navy500: "#3b5680",
  navy600: "#253c60",
  navy700: "#172a47",
  navy800: "#0b1f45",
  navy900: "#101c3d",
  navy950: "#080f24",

  gold100: "#f4ead9",
  gold300: "#dbc09a",
  gold500: "#c9a177",
  gold700: "#8a6844",

  sky50: "#f2f7fb",
  sky300: "#a9c8dd",
  sky500: "#4f87a8",

  iris50: "#f3f1ff",
  iris100: "#e6e1fe",
  iris200: "#cec4fd",
  iris300: "#ab99fa",
  iris400: "#8b70f5",
  iris500: "#6c4eea",
  iris600: "#5638c9",
  iris700: "#422aa1",

  cream100: "#fbfaf5",
  cream200: "#f4f1e8",
  cream300: "#eae4d2",
  cream500: "#c9bc98",

  charcoal100: "#e5e4e2",
  charcoal200: "#cccac6",
  charcoal300: "#a3a09a",
  charcoal400: "#75726b",
  charcoal600: "#333029",
  charcoal800: "#1a1a1a",

  paper: "#ffffff",
  whatsapp: "#25D366",
  whatsappDark: "#1da851",
} as const;

export const colors = {
  surfaceBase: palette.paper,
  surfaceSunken: palette.cream100,
  surfaceRaised: palette.paper,
  surfaceInverted: palette.navy800,
  surfaceInvertedDeep: palette.navy900,
  surfaceWarm: palette.cream200,

  inkPrimary: palette.charcoal800,
  inkSecondary: palette.charcoal600,
  inkMuted: palette.charcoal400,
  inkInverted: palette.paper,
  inkInvertedMuted: palette.navy200,

  accent: palette.iris500,
  accentSoft: palette.iris200,
  accentStrong: palette.iris600,

  borderHairline: palette.charcoal200,
  borderStrong: palette.charcoal300,
  borderInverted: "rgba(255,255,255,0.16)",

  success: "#2f7d5a",
  warning: "#a9873f",
  danger: "#b3453f",
  info: palette.navy500,
} as const;

/** Font family names registered in app/_layout.tsx via expo-font. */
export const fonts = {
  display: "BigShoulders_800ExtraBold",
  displayBlack: "BigShoulders_900Black",
  body: "PublicSans_400Regular",
  bodyMedium: "PublicSans_500Medium",
  bodySemi: "PublicSans_600SemiBold",
  bodyBold: "PublicSans_700Bold",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold",
  accent: "Fraunces_500Medium_Italic",
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48 } as const;

export const radius = { sm: 6, md: 10, lg: 14, xl: 18, xxl: 24, pill: 999 } as const;

/** Horizontal page gutter used by every screen. */
export const GUTTER = 20;

export const type = {
  displayXl: { fontFamily: fonts.displayBlack, fontSize: 44, lineHeight: 44, textTransform: "uppercase", letterSpacing: 0.2 },
  displayLg: { fontFamily: fonts.display, fontSize: 36, lineHeight: 38, textTransform: "uppercase" },
  displayMd: { fontFamily: fonts.display, fontSize: 30, lineHeight: 32, textTransform: "uppercase" },
  displaySm: { fontFamily: fonts.display, fontSize: 26, lineHeight: 28, textTransform: "uppercase" },
  headingLg: { fontFamily: fonts.display, fontSize: 21, lineHeight: 24, textTransform: "uppercase" },
  headingMd: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 23 },
  headingSm: { fontFamily: fonts.bodySemi, fontSize: 15, lineHeight: 20 },
  bodyLg: { fontFamily: fonts.body, fontSize: 16.5, lineHeight: 25 },
  bodyMd: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodySm: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19 },
  label: { fontFamily: fonts.bodySemi, fontSize: 11.5, lineHeight: 15, textTransform: "uppercase", letterSpacing: 1.6 },
  price: { fontFamily: fonts.monoBold, fontSize: 17, lineHeight: 22 },
  priceLg: { fontFamily: fonts.monoBold, fontSize: 26, lineHeight: 32 },
  mono: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

function shadow(elevation: number, opacity: number, radiusPx: number, offsetY: number): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation },
    default: {
      shadowColor: palette.navy800,
      shadowOpacity: opacity,
      shadowRadius: radiusPx,
      shadowOffset: { width: 0, height: offsetY },
    },
  })!;
}

export const shadows = {
  card: shadow(2, 0.08, 6, 2),
  raised: shadow(6, 0.14, 18, 8),
  accent: Platform.select<ViewStyle>({
    android: { elevation: 6 },
    default: { shadowColor: palette.iris600, shadowOpacity: 0.32, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
  })!,
};

/** Gradient stops used across the app — same pairs as the website's Tailwind gradients. */
export const gradients = {
  primary: [palette.iris400, palette.iris600] as const,
  hero: ["rgba(16,28,61,0.88)", "rgba(16,28,61,0.55)", "rgba(8,15,36,0.94)"] as const,
  cardFade: ["transparent", "rgba(16,28,61,0.78)"] as const,
  irisCard: [palette.iris50, palette.paper] as const,
  creamCard: [palette.cream200, palette.paper] as const,
  skyCard: [palette.paper, palette.sky50] as const,
  closing: [palette.iris50, palette.paper, palette.sky50] as const,
};
