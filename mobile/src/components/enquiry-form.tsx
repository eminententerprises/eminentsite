import { useState } from "react";
import { View } from "react-native";
import { CheckCircle2, Send } from "lucide-react-native";
import type { EnquiryReason } from "@/types";
import { leadSchema, type LeadFormValues } from "@/lib/validation/lead-schema";
import { submitLead } from "@/lib/api";
import { Button, Text } from "@/components/ui";
import { SelectField, TextField } from "@/components/form";
import { colors, palette, radius, space } from "@/theme";

const REASONS: EnquiryReason[] = ["Buy/Sell", "Investment", "Property Management", "Construction", "Renovation", "Other"];

type Errors = Partial<Record<keyof LeadFormValues, string>>;

/**
 * Same fields, validation (shared zod leadSchema) and endpoint as the
 * website's EnquiryForm — leads from the app land in the same place.
 */
export function EnquiryForm({
  propertyRef,
  defaultReason,
  showReason = false,
  submitLabel = "Send Enquiry",
  defaultMessage = "",
  onSuccess,
}: {
  propertyRef?: string;
  defaultReason?: EnquiryReason;
  showReason?: boolean;
  submitLabel?: string;
  defaultMessage?: string;
  onSuccess?: () => void;
}) {
  const [values, setValues] = useState<LeadFormValues>({
    name: "",
    phone: "",
    email: "",
    message: defaultMessage,
    reason: defaultReason,
    propertyRef,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  function set<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit() {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LeadFormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setStatus("submitting");
    setServerMessage(null);
    const res = await submitLead(parsed.data);
    if (!res.success) {
      setStatus("error");
      setServerMessage(res.message);
      return;
    }
    setStatus("success");
    setServerMessage(res.message);
    onSuccess?.();
  }

  if (status === "success") {
    return (
      <View
        accessibilityRole="alert"
        style={{ alignItems: "center", gap: space.md, padding: space.xl, backgroundColor: palette.iris50, borderRadius: radius.xl }}
      >
        <CheckCircle2 size={40} color={colors.success} />
        <Text variant="bodyMd" style={{ textAlign: "center" }}>
          {serverMessage}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: space.lg }}>
      <TextField label="Full name" value={values.name} onChangeText={(v) => set("name", v)} error={errors.name} autoComplete="name" autoCapitalize="words" placeholder="e.g. Ahmed Khan" />
      <TextField label="Phone / WhatsApp" value={values.phone} onChangeText={(v) => set("phone", v)} error={errors.phone} keyboardType="phone-pad" autoComplete="tel" placeholder="0300-1234567" />
      <TextField label="Email" optional value={values.email ?? ""} onChangeText={(v) => set("email", v)} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="you@example.com" />
      {showReason ? (
        <SelectField
          label="Reason for enquiry"
          value={values.reason}
          options={REASONS.map((r) => ({ value: r, label: r }))}
          onChange={(v) => set("reason", v)}
          error={errors.reason}
        />
      ) : null}
      <TextField label="Message" optional value={values.message ?? ""} onChangeText={(v) => set("message", v)} error={errors.message} multiline maxLength={1000} placeholder="Tell us what you're looking for" />
      {status === "error" && serverMessage ? (
        <Text variant="bodySm" color={colors.danger} accessibilityRole="alert">
          {serverMessage}
        </Text>
      ) : null}
      <Button label={submitLabel} icon={Send} onPress={onSubmit} loading={status === "submitting"} fullWidth size="lg" />
    </View>
  );
}
