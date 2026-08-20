/**
 * i18n scaffold — see README.md "Internationalisation" section.
 *
 * English ships as the complete, default locale across every route already
 * built. Urdu ships as a translation scaffold: real message files with
 * correct RTL-ready strings (`/messages/ur.json`), plus the RTL font/layout
 * switch already wired in `src/app/globals.css` ([dir="rtl"] rules pick up
 * Noto Nastaliq Urdu and drop the uppercase/tracking treatment). Routing
 * every one of the site's ~30 routes through a `[locale]` segment is left
 * as the next implementation step rather than retrofitted under time
 * pressure — see README for the exact steps.
 */
export const locales = ["en", "ur"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ur: "rtl",
};
