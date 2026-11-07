import { useMemo, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BANK_MARKUP_PRESETS } from "@/data/bank-presets";
import { calculateMortgage } from "@/lib/mortgage";
import { formatPKR } from "@/lib/format-pkr";
import { Card, Disclaimer, Divider, Text } from "@/components/ui";
import { Segmented, SelectField, TextField, parseNumber } from "@/components/form";
import { PageIntro, Screen } from "@/components/layout";
import { ResultLine, ResultPanel } from "@/components/result";
import { colors, fonts, palette, space } from "@/theme";

const DOWN_PAYMENTS = [10, 20, 30, 40, 50];
const TENURES = [5, 10, 15, 20, 25];

export default function MortgageScreen() {
  const params = useLocalSearchParams<{ price?: string }>();
  const [price, setPrice] = useState(params.price ?? "15000000");
  const [down, setDown] = useState(20);
  const [tenure, setTenure] = useState(15);
  const [rate, setRate] = useState(String(BANK_MARKUP_PRESETS[0].markupRatePercent));
  const [showSchedule, setShowSchedule] = useState<"year" | "none">("none");

  const priceN = parseNumber(price) ?? 0;
  const rateN = parseNumber(rate) ?? 0;
  const result = useMemo(
    () => (priceN > 0 && rateN > 0 ? calculateMortgage({ propertyPrice: priceN, downPaymentPercent: down, tenureYears: tenure, markupRatePercent: rateN }) : null),
    [priceN, down, tenure, rateN],
  );

  const yearly = useMemo(() => {
    if (!result) return [];
    const rows: { year: number; paid: number; balance: number }[] = [];
    for (let y = 1; y <= tenure; y++) {
      const slice = result.schedule.slice((y - 1) * 12, y * 12);
      if (!slice.length) break;
      rows.push({ year: y, paid: slice.reduce((s, r) => s + r.payment, 0), balance: slice[slice.length - 1].balance });
    }
    return rows;
  }, [result, tenure]);

  return (
    <Screen>
      <PageIntro kicker="Home Finance" title="Mortgage Calculator" body="Estimate your monthly instalment and total cost of financing." />

      <Card style={{ gap: space.lg, marginTop: space.xl }}>
        <TextField label="Property price (PKR)" value={price} onChangeText={setPrice} keyboardType="number-pad" suffix={priceN ? formatPKR(priceN).short.replace("PKR ", "") : undefined} />
        <View>
          <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, marginBottom: 6 }}>
            Down payment: {down}% {priceN ? `(${formatPKR((priceN * down) / 100).short})` : ""}
          </Text>
          <Segmented value={down} onChange={setDown} options={DOWN_PAYMENTS.map((d) => ({ value: d, label: `${d}%` }))} />
        </View>
        <View>
          <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, marginBottom: 6 }}>
            Tenure
          </Text>
          <Segmented value={tenure} onChange={setTenure} options={TENURES.map((t) => ({ value: t, label: `${t}y` }))} />
        </View>
        <SelectField
          label="Indicative bank preset"
          value={BANK_MARKUP_PRESETS.find((b) => String(b.markupRatePercent) === rate)?.bankLabel ?? ""}
          placeholder="Choose a preset or type a rate"
          options={BANK_MARKUP_PRESETS.map((b) => ({ value: b.bankLabel, label: `${b.bankLabel} — ${b.markupRatePercent}%` }))}
          onChange={(label) => {
            const preset = BANK_MARKUP_PRESETS.find((b) => b.bankLabel === label);
            if (preset) setRate(String(preset.markupRatePercent));
          }}
        />
        <TextField label="Markup rate (% per year)" value={rate} onChangeText={setRate} keyboardType="decimal-pad" suffix="%" />
        <Text variant="bodySm" color={colors.inkMuted}>
          Bank presets are indicative placeholders, not real institution names or offers. Enter your bank's actual quoted rate for a more accurate estimate.
        </Text>
      </Card>

      {result ? (
        <View style={{ marginTop: space.xl, gap: space.lg }}>
          <ResultPanel kicker="Monthly Instalment" value={formatPKR(result.monthlyInstalment, { perMonth: true }).short} caption={formatPKR(result.monthlyInstalment).full}>
            <View style={{ marginTop: space.md }}>
              <ResultLine inverted label="Loan amount" value={formatPKR(result.loanAmount).short} />
              <ResultLine inverted label="Total markup" value={formatPKR(result.totalMarkup).short} />
              <ResultLine inverted label="Total repaid" value={formatPKR(result.totalPaid).short} />
            </View>
          </ResultPanel>

          <Card>
            <Text variant="headingLg" color={palette.navy800}>
              Year-by-year
            </Text>
            <Text variant="label" color={colors.accentStrong} style={{ marginTop: space.sm }} onPress={() => setShowSchedule(showSchedule === "year" ? "none" : "year")}>
              {showSchedule === "year" ? "Hide schedule" : "Show amortisation schedule"}
            </Text>
            {showSchedule === "year" ? (
              <View style={{ marginTop: space.md }}>
                {yearly.map((r, i) => (
                  <View key={r.year}>
                    <ResultLine label={`Year ${r.year} · paid ${formatPKR(r.paid).short.replace("PKR ", "")}`} value={`Bal. ${formatPKR(r.balance).short.replace("PKR ", "")}`} />
                    {i < yearly.length - 1 ? <Divider /> : null}
                  </View>
                ))}
              </View>
            ) : null}
          </Card>
        </View>
      ) : null}

      <Disclaimer style={{ marginTop: space.xl }}>
        Indicative figures, not a loan offer. This calculator uses a standard reducing-balance amortisation formula against the markup rate you enter or select. It doesn't account for processing fees, insurance, or eligibility checks. Verify with your bank or Islamic finance provider before making a decision.
      </Disclaimer>
    </Screen>
  );
}
