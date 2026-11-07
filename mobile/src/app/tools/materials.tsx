import { useMemo, useState } from "react";
import { View } from "react-native";
import type { BoundaryWallThickness, MaterialEstimateInput, MaterialQuantityLine, MaterialScope, StructureType } from "@/types";
import { estimateMaterials } from "@/lib/material-estimate";
import { formatPKR } from "@/lib/format-pkr";
import { Card, Disclaimer, Divider, Text } from "@/components/ui";
import { CheckRow, Segmented, Stepper, TextField, parseNumber } from "@/components/form";
import { PageIntro, Screen } from "@/components/layout";
import { ResultPanel } from "@/components/result";
import { colors, fonts, palette, space } from "@/theme";

export default function MaterialsScreen() {
  const [area, setArea] = useState("2000");
  const [storeys, setStoreys] = useState(2);
  const [structure, setStructure] = useState<StructureType>("RCC Framed");
  const [scope, setScope] = useState<MaterialScope>("Grey Structure");
  const [tier, setTier] = useState<MaterialEstimateInput["qualityTier"]>("Standard");
  const [wall, setWall] = useState(false);
  const [wallLength, setWallLength] = useState("200");
  const [wallHeight, setWallHeight] = useState("6");
  const [wallThickness, setWallThickness] = useState<BoundaryWallThickness>(9);

  const areaN = parseNumber(area) ?? 0;
  const result = useMemo(
    () =>
      areaN > 0
        ? estimateMaterials({
            coveredAreaSqft: areaN,
            storeys,
            structureType: structure,
            scope,
            qualityTier: tier,
            includeBoundaryWall: wall,
            boundaryWallLengthFt: parseNumber(wallLength) ?? 0,
            boundaryWallHeightFt: parseNumber(wallHeight) ?? 0,
            boundaryWallThicknessIn: wallThickness,
          })
        : null,
    [areaN, storeys, structure, scope, tier, wall, wallLength, wallHeight, wallThickness],
  );

  return (
    <Screen>
      <PageIntro kicker="Buraq Eminent Constructors" title="Brick & Material Calculator" body="Bricks, cement, sand, crush and steel for your build, at planning-stage accuracy." />

      <Card style={{ gap: space.lg, marginTop: space.xl }}>
        <TextField label="Covered area per storey (sq ft)" value={area} onChangeText={setArea} keyboardType="number-pad" suffix="sq ft" />
        <Stepper label="Storeys" value={storeys} onChange={setStoreys} min={1} max={6} />
        <Labeled label="Structure">
          <Segmented value={structure} onChange={setStructure} options={(["RCC Framed", "Load Bearing"] as const).map((v) => ({ value: v, label: v }))} />
        </Labeled>
        <Labeled label="Scope">
          <Segmented value={scope} onChange={setScope} options={(["Grey Structure", "Turnkey"] as const).map((v) => ({ value: v, label: v }))} />
        </Labeled>
        <Labeled label="Quality tier">
          <Segmented value={tier} onChange={setTier} options={(["Standard", "Premium", "Luxury"] as const).map((v) => ({ value: v, label: v }))} />
        </Labeled>
        <Divider />
        <CheckRow label="Include boundary wall" checked={wall} onToggle={() => setWall(!wall)} />
        {wall ? (
          <View style={{ gap: space.lg }}>
            <View style={{ flexDirection: "row", gap: space.md }}>
              <View style={{ flex: 1 }}>
                <TextField label="Length" value={wallLength} onChangeText={setWallLength} keyboardType="number-pad" suffix="ft" />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="Height" value={wallHeight} onChangeText={setWallHeight} keyboardType="number-pad" suffix="ft" />
              </View>
            </View>
            <Labeled label="Wall thickness">
              <Segmented value={wallThickness} onChange={setWallThickness} options={[{ value: 4.5 as const, label: '4.5" (single)' }, { value: 9 as const, label: '9" (double)' }]} />
            </Labeled>
          </View>
        ) : null}
      </Card>

      {result ? (
        <View style={{ marginTop: space.xl, gap: space.lg }}>
          <ResultPanel kicker="Estimated Material Cost" value={formatPKR(result.totalMaterialCost).short} caption="Materials only. Excludes labour, fittings and fixtures." />
          <LineGroup title="Structure" lines={result.structure} />
          {result.boundaryWall.length > 0 ? <LineGroup title="Boundary Wall" lines={result.boundaryWall} /> : null}
          {result.finishing.length > 0 ? <LineGroup title="Finishing" lines={result.finishing} /> : null}
        </View>
      ) : null}

      <Disclaimer style={{ marginTop: space.xl }}>
        These are planning-stage estimates from standard thumb-rule quantities and placeholder market rates. Actual quantities depend on your approved drawings. Confirm with a Buraq site engineer before purchasing.
      </Disclaimer>
    </Screen>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, marginBottom: 6 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function LineGroup({ title, lines }: { title: string; lines: MaterialQuantityLine[] }) {
  return (
    <Card>
      <Text variant="headingLg" color={palette.navy800} style={{ marginBottom: space.sm }}>
        {title}
      </Text>
      {lines.map((l, i) => (
        <View key={l.key}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, gap: space.md }}>
            <View style={{ flex: 1 }}>
              <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi }}>
                {l.label}
              </Text>
              <Text variant="mono" color={colors.inkSecondary}>
                {Math.round(l.quantity).toLocaleString("en-PK")} {l.unit}
                {l.altQuantity ? ` · ${l.altQuantity}` : ""}
              </Text>
            </View>
            <Text variant="mono" color={palette.navy800} style={{ fontFamily: fonts.monoBold }}>
              {formatPKR(l.estimatedCost).short.replace("PKR ", "")}
            </Text>
          </View>
          {i < lines.length - 1 ? <Divider /> : null}
        </View>
      ))}
    </Card>
  );
}
