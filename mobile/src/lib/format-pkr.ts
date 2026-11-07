/**
 * Pakistani currency formatting: lakh/crore notation, not Western
 * thousand-grouping. 1 Lakh = 100,000. 1 Crore = 10,000,000.
 */

export interface FormattedPKR {
  /** e.g. "PKR 2.75 Crore" */
  short: string;
  /** e.g. "PKR 27,500,000" — for tooltips / full precision */
  full: string;
}

export function formatPKR(amount: number, options?: { perMonth?: boolean }): FormattedPKR {
  const suffix = options?.perMonth ? "/month" : "";
  const full = `PKR ${Math.round(amount).toLocaleString("en-PK")}${suffix}`;

  if (amount >= 1_00_00_000) {
    const crore = amount / 1_00_00_000;
    return { short: `PKR ${trimDecimal(crore)} Crore${suffix}`, full };
  }
  if (amount >= 1_00_000) {
    const lakh = amount / 1_00_000;
    return { short: `PKR ${trimDecimal(lakh)} Lakh${suffix}`, full };
  }
  if (options?.perMonth) {
    return { short: `Rs ${Math.round(amount).toLocaleString("en-PK")}${suffix}`, full };
  }
  return { short: full, full };
}

function trimDecimal(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2).replace(/0$/, "");
}

/** Formats a min–max range compactly, e.g. "PKR 85 Lakh – 1.2 Crore" */
export function formatPKRRange(min: number, max: number): string {
  if (min === max) return formatPKR(min).short;
  const minLabel = formatPKR(min).short.replace("PKR ", "");
  const maxLabel = formatPKR(max).short.replace("PKR ", "");
  return `PKR ${minLabel} – ${maxLabel}`;
}
