/**
 * Area unit conversion for Pakistani real estate. Marla and Kanal are the
 * dominant local units; Sq Ft / Sq Yd are used mainly for commercial and
 * apartment listings. Two competing Marla standards are in real use — this
 * module defaults to the modern 225 sq ft standard but exposes the 272 sq ft
 * "old" standard for listing detail's unit converter, per the brief.
 */

export type AreaUnit = "marla" | "kanal" | "sqft" | "sqyd";

export const SQFT_PER_MARLA_STANDARD = 225;
export const SQFT_PER_MARLA_OLD = 272.25;
export const MARLA_PER_KANAL = 20;
export const SQFT_PER_SQYD = 9;

export function toSqFt(value: number, unit: AreaUnit, marlaStandard: "standard" | "old" = "standard"): number {
  const sqftPerMarla = marlaStandard === "standard" ? SQFT_PER_MARLA_STANDARD : SQFT_PER_MARLA_OLD;
  switch (unit) {
    case "sqft":
      return value;
    case "sqyd":
      return value * SQFT_PER_SQYD;
    case "marla":
      return value * sqftPerMarla;
    case "kanal":
      return value * MARLA_PER_KANAL * sqftPerMarla;
  }
}

export function fromSqFt(sqft: number, unit: AreaUnit, marlaStandard: "standard" | "old" = "standard"): number {
  const sqftPerMarla = marlaStandard === "standard" ? SQFT_PER_MARLA_STANDARD : SQFT_PER_MARLA_OLD;
  switch (unit) {
    case "sqft":
      return sqft;
    case "sqyd":
      return sqft / SQFT_PER_SQYD;
    case "marla":
      return sqft / sqftPerMarla;
    case "kanal":
      return sqft / (MARLA_PER_KANAL * sqftPerMarla);
  }
}

export const AREA_UNIT_LABEL: Record<AreaUnit, string> = {
  marla: "Marla",
  kanal: "Kanal",
  sqft: "Sq Ft",
  sqyd: "Sq Yd",
};

/** Human label for the dominant local unit — Kanal above 4000 sq ft, else Marla. */
export function formatAreaAuto(sqft: number): string {
  if (sqft >= MARLA_PER_KANAL * SQFT_PER_MARLA_STANDARD) {
    return `${trimDecimal(fromSqFt(sqft, "kanal"))} Kanal`;
  }
  return `${trimDecimal(fromSqFt(sqft, "marla"))} Marla`;
}

export function formatArea(value: number, unit: AreaUnit): string {
  return `${trimDecimal(value)} ${AREA_UNIT_LABEL[unit]}`;
}

function trimDecimal(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2).replace(/0$/, "");
}
