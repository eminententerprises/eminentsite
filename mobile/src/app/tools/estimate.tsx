import { useMemo, useState } from "react";
import { View } from "react-native";
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw } from "lucide-react-native";
import type { AreaUnit, PropertyType, ValuationInput, ValuationResult } from "@/types";
import { CITIES, CITY_LABELS, LOCATIONS, getLocationBySlug } from "@/data/locations";
import { AREA_UNIT_LABEL, toSqFt } from "@/lib/area";
import { estimateValuation } from "@/lib/valuation";
import { formatPKR } from "@/lib/format-pkr";
import { openWhatsApp } from "@/lib/links";
import { useProperties } from "@/state/properties";
import { Button, Card, Chip, Disclaimer, SectionHeader, Text } from "@/components/ui";
import { CheckRow, SelectField, Stepper, TextField, parseNumber } from "@/components/form";
import { PageIntro, Screen } from "@/components/layout";
import { PropertyCard } from "@/components/cards";
import { ResultLine, ResultPanel } from "@/components/result";
import { colors, palette, radius, space } from "@/theme";

/** Same option lists as the website's EminentEstimateForm. */
const STEP_LABELS = ["Location", "Property Type", "Area", "Condition & Age", "Features"] as const;
const TYPES: PropertyType[] = ["House", "Flat/Apartment", "Upper Portion", "Lower Portion", "Farm House", "Residential Plot"];
const UNITS: AreaUnit[] = ["marla", "kanal", "sqft", "sqyd"];
const CONDITIONS: ValuationInput["condition"][] = ["New", "Good", "Needs Renovation"];
const FEATURES = ["Corner Plot", "Boulevard Facing", "Park Facing", "Basement", "Servant Quarter", "Gas Available"];

export default function EstimateScreen() {
  const { properties } = useProperties();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState<string>("");
  const [type, setType] = useState<PropertyType | undefined>();
  const [areaValue, setAreaValue] = useState("5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("marla");
  const [condition, setCondition] = useState<ValuationInput["condition"] | undefined>();
  const [age, setAge] = useState(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const areaN = parseNumber(areaValue) ?? 0;
  const canNext = [!!city, !!type, areaN > 0, !!condition, true][step];

  const comparables = useMemo(() => {
    if (!result || !type) return [];
    const sqft = toSqFt(areaN, areaUnit);
    return properties
      .filter((p) => p.purpose === "buy" && p.location.areaSlug === result.comparableAreaSlug)
      .sort((a, b) => Math.abs(a.area.sqft - sqft) - Math.abs(b.area.sqft - sqft))
      .slice(0, 3);
  }, [result, properties, type, areaN, areaUnit]);

  function submit() {
    if (!type || !condition || !city) return;
    setResult(estimateValuation({ city, propertyType: type, areaValue: areaN, areaUnit, ageYears: age, condition, features }));
  }

  function reset() {
    setResult(null);
    setStep(0);
  }

  if (result) {
    const location = getLocationBySlug(city);
    const levels = ["Low", "Medium", "High"] as const;
    return (
      <Screen>
        <PageIntro kicker="Your Eminent Estimate" title={`${areaValue} ${AREA_UNIT_LABEL[areaUnit]} ${type}`} body={location ? `${location.name}, ${location.cityLabel}` : undefined} />
        <View style={{ marginTop: space.xl, gap: space.lg }}>
          <ResultPanel kicker="Indicative Value Range" value={`${formatPKR(result.low).short.replace("PKR ", "PKR ")} – ${formatPKR(result.high).short.replace("PKR ", "")}`} caption={`Mid-point ${formatPKR(result.mid).short}`}>
            <View style={{ marginTop: space.md }}>
              <ResultLine inverted label="Base rate used" value={`${formatPKR(result.pricePerMarlaUsed).short} / marla`} />
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 }}>
                <Text variant="bodySm" color={colors.inkInvertedMuted} style={{ flex: 1 }}>
                  Confidence
                </Text>
                {levels.map((l) => (
                  <View
                    key={l}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: radius.pill,
                      backgroundColor: l === result.confidence ? palette.iris400 : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Text variant="bodySm" color={palette.paper} style={{ fontSize: 12 }}>
                      {l}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ResultPanel>

          <Disclaimer>
            Indicative estimate, not a formal valuation. This range comes from a simplified set of rules applied to the area's indicative base rate, property type, condition, age and selected features. It doesn't account for an on-ground inspection, exact plot position, title status, or current negotiation dynamics. Speak to one of our advisors for a professional opinion before making any financial decision.
          </Disclaimer>

          <Button
            label="Get a professional valuation"
            icon={MessageCircle}
            variant="whatsapp"
            fullWidth
            onPress={() =>
              openWhatsApp(
                `Hi Eminent Enterprises, I used Eminent Estimate for a ${areaValue} ${AREA_UNIT_LABEL[areaUnit]} ${type} in ${location?.name ?? city} (indicative ${formatPKR(result.low).short} – ${formatPKR(result.high).short}). I'd like a professional valuation.`,
              )
            }
          />
          <Button label="Start over" icon={RotateCcw} variant="outline" fullWidth onPress={reset} />

          {comparables.length > 0 ? (
            <View style={{ gap: space.lg, marginTop: space.lg }}>
              <SectionHeader kicker="Live listings" title="Comparable Properties" />
              {comparables.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </View>
          ) : null}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageIntro kicker="Free Valuation Tool" title="Eminent Estimate" body="What's your property worth? Answer five quick questions for an instant indicative range." />

      {/* Progress */}
      <View style={{ flexDirection: "row", gap: 6, marginTop: space.xl }}>
        {STEP_LABELS.map((l, i) => (
          <View key={l} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= step ? colors.accent : palette.iris100 }} />
        ))}
      </View>
      <Text variant="label" color={colors.accentStrong} style={{ marginTop: space.md }}>
        Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
      </Text>

      <Card style={{ marginTop: space.lg, gap: space.lg }}>
        {step === 0 ? (
          <SelectField
            label="Where is the property?"
            value={city}
            placeholder="Choose an area / society"
            options={CITIES.flatMap((c) => LOCATIONS.filter((l) => l.city === c).map((l) => ({ value: l.slug, label: l.name, group: CITY_LABELS[c] })))}
            onChange={setCity}
          />
        ) : null}

        {step === 1 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
            {TYPES.map((t) => (
              <Chip key={t} label={t} selected={type === t} onPress={() => setType(t)} />
            ))}
          </View>
        ) : null}

        {step === 2 ? (
          <View style={{ flexDirection: "row", gap: space.md }}>
            <View style={{ flex: 1.2 }}>
              <TextField label="Size" value={areaValue} onChangeText={setAreaValue} keyboardType="decimal-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField label="Unit" value={areaUnit} options={UNITS.map((u) => ({ value: u, label: AREA_UNIT_LABEL[u] }))} onChange={setAreaUnit} />
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
              {CONDITIONS.map((c) => (
                <Chip key={c} label={c} selected={condition === c} onPress={() => setCondition(c)} />
              ))}
            </View>
            <Stepper label="Age of construction" value={age} onChange={setAge} min={0} max={60} suffix={age === 1 ? "year" : "years"} />
          </>
        ) : null}

        {step === 4 ? (
          <View>
            <Text variant="bodySm" color={colors.inkSecondary} style={{ marginBottom: space.sm }}>
              Select any that apply (optional).
            </Text>
            {FEATURES.map((f) => (
              <CheckRow key={f} label={f} checked={features.includes(f)} onToggle={() => setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))} />
            ))}
          </View>
        ) : null}
      </Card>

      <View style={{ flexDirection: "row", gap: space.md, marginTop: space.xl }}>
        {step > 0 ? <Button label="Back" icon={ArrowLeft} variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1 }} fullWidth /> : null}
        {step < STEP_LABELS.length - 1 ? (
          <Button label="Next" iconRight={ArrowRight} onPress={() => setStep(step + 1)} disabled={!canNext} style={{ flex: 2 }} fullWidth />
        ) : (
          <Button label="Get My Estimate" onPress={submit} style={{ flex: 2 }} fullWidth />
        )}
      </View>
    </Screen>
  );
}
