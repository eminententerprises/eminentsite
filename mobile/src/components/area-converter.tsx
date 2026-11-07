import { useState } from "react";
import { View } from "react-native";
import { AREA_UNIT_LABEL, fromSqFt, toSqFt, type AreaUnit } from "@/lib/area";
import { Text } from "@/components/ui";
import { Segmented, SelectField, TextField, parseNumber } from "@/components/form";
import { colors, palette, radius, space } from "@/theme";

const UNITS: AreaUnit[] = ["marla", "kanal", "sqft", "sqyd"];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString("en-PK", { maximumFractionDigits: 2 });
}

/** Marla / Kanal / Sq Ft / Sq Yd converter with both Marla standards — same maths as the website (lib/area.ts). */
export function AreaConverter({ initialSqft }: { initialSqft?: number }) {
  const [unit, setUnit] = useState<AreaUnit>(initialSqft ? "marla" : "marla");
  const [value, setValue] = useState(initialSqft ? fmt(fromSqFt(initialSqft, "marla")).replace(/,/g, "") : "10");
  const [standard, setStandard] = useState<"standard" | "old">("standard");

  const n = parseNumber(value) ?? 0;
  const sqft = toSqFt(n, unit, standard);

  return (
    <View style={{ gap: space.lg }}>
      <Segmented
        value={standard}
        onChange={setStandard}
        options={[
          { value: "standard", label: "1 Marla = 225 sq ft" },
          { value: "old", label: "1 Marla = 272.25 sq ft" },
        ]}
      />
      <View style={{ flexDirection: "row", gap: space.md }}>
        <View style={{ flex: 1.2 }}>
          <TextField label="Value" value={value} onChangeText={setValue} keyboardType="decimal-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <SelectField label="Unit" value={unit} options={UNITS.map((u) => ({ value: u, label: AREA_UNIT_LABEL[u] }))} onChange={setUnit} />
        </View>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.md }}>
        {UNITS.filter((u) => u !== unit).map((u) => (
          <View
            key={u}
            style={{ flexBasis: "47%", flexGrow: 1, backgroundColor: palette.iris50, borderRadius: radius.lg, padding: space.lg, gap: 4 }}
            accessibilityLabel={`${fmt(fromSqFt(sqft, u, standard))} ${AREA_UNIT_LABEL[u]}`}
          >
            <Text variant="label" color={colors.inkMuted}>
              {AREA_UNIT_LABEL[u]}
            </Text>
            <Text variant="price" color={palette.navy800}>
              {fmt(fromSqFt(sqft, u, standard))}
            </Text>
          </View>
        ))}
      </View>
      <Text variant="bodySm" color={colors.inkMuted}>
        Two Marla standards are in use in Pakistan. Most modern societies use 225 sq ft; older revenue records often use 272.25 sq ft. Confirm which one applies to your property.
      </Text>
    </View>
  );
}
