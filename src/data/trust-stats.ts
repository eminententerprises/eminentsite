/**
 * Illustrative homepage trust-band figures. These are NOT audited business
 * metrics — they are indicative counts used to communicate scale honestly
 * without presenting unverified numbers as precise fact. Copy referencing
 * these must stay in "illustrative" register (e.g. "800+", not "exactly 800").
 */

export interface TrustStat {
  label: string;
  // PLACEHOLDER — illustrative figure, not an audited/verified statistic.
  value: string;
}

export const TRUST_STATS: TrustStat[] = [
  { label: "Years of Experience", value: "10+" },
  // PLACEHOLDER — illustrative count of advisory engagements, not a verified figure.
  { label: "Properties Advised On", value: "800+" },
  // PLACEHOLDER — illustrative count of completed/ongoing Buraq projects, not a verified figure.
  { label: "Construction Projects", value: "50+" },
];
