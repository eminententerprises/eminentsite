import { useMemo, useState } from "react";
import { View } from "react-native";
import { MessageCircle } from "lucide-react-native";
import type { ConstructionEstimateInput } from "@/types";
import { estimateConstructionCost } from "@/lib/construction-estimate";
import { formatPKR } from "@/lib/format-pkr";
import { whatsAppConstructionMessage } from "@/lib/whatsapp";
import { openWhatsApp } from "@/lib/links";
import { Button, Card, Disclaimer, Text } from "@/components/ui";
import { Segmented, Stepper, TextField, parseNumber } from "@/components/form";
import { PageIntro, Screen } from "@/components/layout";
import { ResultLine, ResultPanel, ShareBar } from "@/components/result";
import { fonts, palette, space } from "@/theme";

export default function ConstructionCostScreen() {
  const [area, setArea] = useState("2000");
  const [storeys, setStoreys] = useState(2);
  const [tier, setTier] = useState<ConstructionEstimateInput["qualityTier"]>("Standard");
  const [scope, setScope] = useState<ConstructionEstimateInput["scope"]>("Turnkey");

  const areaN = parseNumber(area) ?? 0;
  const result = useMemo(
    () => (areaN > 0 ? estimateConstructionCost({ coveredAreaSqft: areaN, storeys, qualityTier: tier, scope }) : null),
    [areaN, storeys, tier, scope],
  );

  return (
    <Screen>
      <PageIntro kicker="Buraq Eminent Constructors" title="Construction Cost Estimator" body="Indicative build cost by covered area, storeys, finish quality and scope." />

      <Card style={{ gap: space.lg, marginTop: space.xl }}>
        <TextField label="Covered area per storey (sq ft)" value={area} onChangeText={setArea} keyboardType="number-pad" suffix="sq ft" />
        <Stepper label="Storeys" value={storeys} onChange={setStoreys} min={1} max={6} />
        <View>
          <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, marginBottom: 6 }}>
            Quality tier
          </Text>
          <Segmented value={tier} onChange={setTier} options={(["Standard", "Premium", "Luxury"] as const).map((t) => ({ value: t, label: t }))} />
        </View>
        <View>
          <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, marginBottom: 6 }}>
            Scope
          </Text>
          <Segmented value={scope} onChange={setScope} options={(["Grey Structure", "Turnkey"] as const).map((t) => ({ value: t, label: t }))} />
        </View>
      </Card>

      {result ? (
        <View style={{ marginTop: space.xl, gap: space.lg }}>
          <ResultPanel kicker="Estimated Total" value={formatPKR(result.total).short} caption={`≈ ${formatPKR(result.ratePerSqft).full} per sq ft · ${(areaN * storeys).toLocaleString("en-PK")} sq ft total`} />
          <Card>
            <Text variant="headingLg" color={palette.navy800} style={{ marginBottom: space.sm }}>
              Cost Breakdown
            </Text>
            {result.lines.map((l) => (
              <View key={l.label} style={{ marginBottom: space.sm }}>
                <ResultLine label={l.label} value={formatPKR(l.amount).short} />
                <ShareBar share={result.total ? l.amount / result.total : 0} />
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      <Disclaimer style={{ marginTop: space.xl }}>
        These figures are indicative estimates built from placeholder market rates, not a formal quotation. Always verify final costs with a Buraq project consultant before budgeting.
      </Disclaimer>
      <Button label="Discuss on WhatsApp" icon={MessageCircle} variant="whatsapp" onPress={() => openWhatsApp(whatsAppConstructionMessage())} fullWidth style={{ marginTop: space.xl }} />
    </Screen>
  );
}
