import { Big_Shoulders, Public_Sans, JetBrains_Mono, Fraunces, Noto_Nastaliq_Urdu } from "next/font/google";

/** Display — condensed, heavy, uppercase authority. Headlines only. */
export const fontDisplay = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

/** Body — humanist, legible at small sizes. Everything else. */
export const fontBody = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Tabular utility — prices, areas, stats, schedules only. */
export const fontTabular = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tabular",
  display: "swap",
});

/** Buraq-only accent — signature lines and pull-quotes. Never headings or body. */
export const fontAccent = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-accent",
  display: "swap",
});

/** Urdu — RTL locale, heading and body. */
export const fontUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-urdu",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontTabular.variable,
  fontAccent.variable,
  fontUrdu.variable,
].join(" ");
