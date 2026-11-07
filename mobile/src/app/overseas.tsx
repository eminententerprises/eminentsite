import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Banknote, ClipboardList, FileCheck, Video } from "lucide-react-native";
import { CONTACT, EMINENT } from "@/config/site";
import { Bullet, Card, Disclaimer, IconCircle, Text, type Icon } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { colors, palette, space } from "@/theme";

const POA_CHECKLIST = [
  "Draft the Power of Attorney (POA) specifying exactly which acts are authorised (e.g. sale, purchase, possession, registration).",
  "Have the POA attested at the Pakistani Embassy/Consulate in your country of residence.",
  "Get the attested POA counter-attested by the Ministry of Foreign Affairs (MOFA) in Pakistan, where required.",
  "Register the POA with the relevant Sub-Registrar in Pakistan before it is used in any transaction.",
  "Share certified copies with your appointed attorney/representative and keep the original secure.",
  "Confirm validity/expiry terms and whether the POA is general or limited to a specific transaction.",
];

const SECTIONS: { icon: Icon; title: string; body: string }[] = [
  {
    icon: Banknote,
    title: "Remittance-Based Purchases",
    body: "Many overseas Pakistanis fund property purchases through formal banking channels, remitting funds into a Pakistani bank account (commonly a Non-Resident Pakistani/foreign currency account) and using those funds to complete the transaction. Keeping a clear remittance trail through official banking channels generally makes it easier to demonstrate the legitimate source of funds later, including at the time of resale.",
  },
  {
    icon: FileCheck,
    title: "Filer Status & FBR Considerations",
    body: "Whether a buyer is an active taxpayer (a \"filer\") with Pakistan's Federal Board of Revenue (FBR) can affect withholding tax rates applied on property transactions. Overseas Pakistanis may also have specific provisions available to them under prevailing tax law. This is general background only. Confirm your filer status and the applicable withholding tax treatment with a qualified tax advisor before you commit to a purchase.",
  },
  {
    icon: Video,
    title: "Virtual Tours",
    body: "Can't visit in person? Request a live video walkthrough of any listing or project. Our team will schedule a call at a time that works across time zones and walk you through the property, the surrounding society, and answer questions in real time before you decide.",
  },
];

export default function OverseasScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <PageIntro kicker="Overseas Pakistanis" title="Invest in Pakistan From Anywhere" body={EMINENT.audienceSplit.international} />
        <Disclaimer style={{ marginTop: space.xl }}>
          The information on this page is informational only and does not constitute legal, tax or financial advice. Rules on remittances, filer status and property transfer change periodically. Always verify current requirements with your own legal and tax advisor before proceeding with any transaction.
        </Disclaimer>

        <View style={{ gap: space.lg, marginTop: space.xl }}>
          {SECTIONS.map((s) => (
            <Card key={s.title} style={{ gap: space.md }}>
              <IconCircle icon={s.icon} />
              <Text variant="headingLg" color={palette.navy800}>
                {s.title}
              </Text>
              <Text variant="bodyMd" color={colors.inkSecondary}>
                {s.body}
              </Text>
            </Card>
          ))}
          <Card style={{ gap: space.md }}>
            <IconCircle icon={ClipboardList} />
            <Text variant="headingLg" color={palette.navy800}>
              Power of Attorney Checklist
            </Text>
            {POA_CHECKLIST.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </Card>
        </View>

        <Disclaimer style={{ marginTop: space.lg }}>
          Power of attorney requirements and attestation processes vary by country of residence and can change. Verify the current procedure with the Pakistani Embassy/Consulate nearest you and your legal advisor.
        </Disclaimer>

        <Card style={{ gap: space.lg, marginTop: space.xxl }}>
          <View style={{ gap: 4 }}>
            <Text variant="headingLg" color={palette.navy800}>
              Request Information
            </Text>
            <Text variant="bodySm" color={colors.inkSecondary}>
              Tell us what you're looking to invest in, and where you're based. We'll follow up with tailored information, including virtual tour scheduling.
            </Text>
          </View>
          <EnquiryForm defaultReason="Investment" showReason submitLabel="Request Information" />
          <Text variant="bodySm" color={colors.inkMuted} style={{ textAlign: "center" }}>
            Prefer WhatsApp? Message us directly at {CONTACT.mobile}.
          </Text>
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}
