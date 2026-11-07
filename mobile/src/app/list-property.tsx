import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react-native";
import { z } from "zod";
import type { CityKey } from "@/types";
import { PROPERTY_TYPE_CATEGORY } from "@/types";
import { CITIES, CITY_LABELS } from "@/data/locations";
import { leadSchema } from "@/lib/validation/lead-schema";
import { submitLead } from "@/lib/api";
import { Button, Card, SurveyLine, Text } from "@/components/ui";
import { Segmented, SelectField, TextField } from "@/components/form";
import { PageIntro, Screen } from "@/components/layout";
import { colors, palette, radius, space } from "@/theme";

/** Same schema and composed message as the website's ListPropertyForm. */
const listingSchema = leadSchema.extend({
  intent: z.enum(["sell", "rent"]),
  propertyType: z.string().trim().min(1, "Select a property type"),
  city: z.string().trim().min(1, "Select a city"),
  area: z.string().trim().min(2, "Enter the area / society"),
  expectedPrice: z.string().trim().min(1, "Enter your expected price"),
  details: z.string().trim().max(1000, "Keep this under 1000 characters").optional(),
});
type Values = z.infer<typeof listingSchema>;
type Errors = Partial<Record<keyof Values, string>>;

const STEP_ONE: (keyof Values)[] = ["intent", "propertyType", "city", "area", "expectedPrice", "details"];
const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_CATEGORY);

export default function ListPropertyScreen() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({ intent: "sell", propertyType: "", city: "", area: "", expectedPrice: "", details: "", name: "", phone: "", email: "", reason: "Buy/Sell" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof Values>(k: K, v: Values[K]) {
    setValues((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(keys?: (keyof Values)[]): boolean {
    const parsed = listingSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next: Errors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof Values;
      if ((!keys || keys.includes(key)) && !next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setStatus("submitting");
    const composed = [
      `Listing request: ${values.intent === "sell" ? "Sell" : "Rent out"} a ${values.propertyType} in ${values.area}, ${CITY_LABELS[values.city as CityKey] ?? values.city}.`,
      `Expected price: ${values.expectedPrice}.`,
      values.details ? `Additional details: ${values.details}` : undefined,
    ]
      .filter(Boolean)
      .join(" ");
    const res = await submitLead({ name: values.name, phone: values.phone, email: values.email, reason: "Buy/Sell", message: composed });
    setStatus(res.success ? "success" : "error");
    setMessage(res.message);
  }

  if (status === "success") {
    return (
      <Screen>
        <View style={{ alignItems: "center", gap: space.md, padding: space.xxl, backgroundColor: palette.iris50, borderRadius: radius.xxl, marginTop: space.xl }}>
          <CheckCircle2 size={48} color={colors.success} />
          <Text variant="headingLg" style={{ textAlign: "center" }}>
            {message}
          </Text>
          <Text variant="bodyMd" color={colors.inkSecondary} style={{ textAlign: "center" }}>
            Our team will review your submission and reach out to arrange next steps.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <PageIntro kicker="Sell or Rent Out" title="List Your Property" body="Tell us about your property and we'll handle valuation, marketing and buyer or tenant screening." />
        <Text variant="label" color={colors.accentStrong} style={{ marginTop: space.xl }}>
          Step {step + 1} of 2 · {step === 0 ? "Property Details" : "Your Contact Information"}
        </Text>
        <SurveyLine ticks={8} />

        <Card style={{ gap: space.lg, marginTop: space.md }}>
          {step === 0 ? (
            <>
              <Segmented
                value={values.intent}
                onChange={(v) => set("intent", v)}
                options={[
                  { value: "sell", label: "I want to sell" },
                  { value: "rent", label: "I want to rent out" },
                ]}
              />
              <SelectField label="Property type" value={values.propertyType} options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))} onChange={(v) => set("propertyType", v)} error={errors.propertyType} />
              <SelectField label="City" value={values.city} options={CITIES.map((c) => ({ value: c, label: CITY_LABELS[c] }))} onChange={(v) => set("city", v)} error={errors.city} />
              <TextField label="Area / society" value={values.area} onChangeText={(v) => set("area", v)} error={errors.area} placeholder="e.g. DHA Phase II, Sector F" />
              <TextField label="Expected price" value={values.expectedPrice} onChangeText={(v) => set("expectedPrice", v)} error={errors.expectedPrice} placeholder={values.intent === "sell" ? "e.g. 2.5 Crore" : "e.g. 85,000 / month"} />
              <TextField label="Additional details" optional value={values.details ?? ""} onChangeText={(v) => set("details", v)} error={errors.details} multiline maxLength={1000} placeholder="Size, condition, features…" />
              <Button label="Continue" iconRight={ArrowRight} fullWidth onPress={() => validate(STEP_ONE) && setStep(1)} />
            </>
          ) : (
            <>
              <TextField label="Full name" value={values.name} onChangeText={(v) => set("name", v)} error={errors.name} autoComplete="name" autoCapitalize="words" />
              <TextField label="Phone / WhatsApp" value={values.phone} onChangeText={(v) => set("phone", v)} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" placeholder="0300-1234567" />
              <TextField label="Email" optional value={values.email ?? ""} onChangeText={(v) => set("email", v)} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
              {status === "error" && message ? (
                <Text variant="bodySm" color={colors.danger} accessibilityRole="alert">
                  {message}
                </Text>
              ) : null}
              <View style={{ flexDirection: "row", gap: space.md }}>
                <Button label="Back" icon={ArrowLeft} variant="outline" onPress={() => setStep(0)} style={{ flex: 1 }} fullWidth />
                <Button label="Submit" icon={Send} onPress={submit} loading={status === "submitting"} style={{ flex: 2 }} fullWidth />
              </View>
            </>
          )}
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}
