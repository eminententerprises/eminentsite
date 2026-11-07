import { KeyboardAvoidingView, Platform, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import type { EnquiryReason } from "@/types";
import { EnquiryForm } from "@/components/enquiry-form";
import { Screen } from "@/components/layout";
import { Button, Text } from "@/components/ui";
import { colors, palette, radius, space } from "@/theme";

const REASONS: EnquiryReason[] = ["Buy/Sell", "Investment", "Property Management", "Construction", "Renovation", "Other"];

/** Modal enquiry sheet. Optional params: ref + title (a listing), reason, message. */
export default function EnquireScreen() {
  const params = useLocalSearchParams<{ ref?: string; title?: string; reason?: string; message?: string }>();
  const reason = REASONS.includes(params.reason as EnquiryReason) ? (params.reason as EnquiryReason) : undefined;
  const defaultMessage = params.message ?? (params.title ? `I'm interested in ${params.title}. Please share more details.` : "");

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        {params.title ? (
          <View style={{ backgroundColor: palette.iris50, borderRadius: radius.lg, padding: space.lg, marginBottom: space.xl }}>
            <Text variant="label" color={colors.accentStrong}>
              Enquiring about
            </Text>
            <Text variant="headingSm" style={{ marginTop: 4 }}>
              {params.title}
            </Text>
            {params.ref ? (
              <Text variant="mono" color={colors.inkMuted} style={{ marginTop: 2 }}>
                Ref: {params.ref}
              </Text>
            ) : null}
          </View>
        ) : (
          <Text variant="bodyMd" color={colors.inkSecondary} style={{ marginBottom: space.xl }}>
            Fill out the form and our team will reach out shortly.
          </Text>
        )}
        <EnquiryForm propertyRef={params.ref} defaultReason={reason} showReason={!params.ref} defaultMessage={defaultMessage} />
        <Button label="Close" variant="ghost" onPress={() => router.back()} style={{ alignSelf: "center", marginTop: space.md }} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
