import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Clock, Globe, MapPin, MessageCircle, Navigation, Phone, Smartphone } from "lucide-react-native";
import { CONTACT } from "@/config/site";
import { callNumber, callOffice, openMaps, openSocial, openWhatsApp } from "@/lib/links";
import { Button, Card, ListRow, Text } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { colors, palette, space } from "@/theme";

export default function ContactScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <PageIntro kicker="Get In Touch" title="Contact Us" body="Visit our office in Blue Area, Islamabad, call or WhatsApp us directly, or send an enquiry and our team will get back to you." />

        <View style={{ gap: space.md, marginTop: space.xl }}>
          <Button label="Chat on WhatsApp" icon={MessageCircle} variant="whatsapp" size="lg" fullWidth onPress={() => openWhatsApp("Hi Eminent Enterprises, I'd like to get in touch.")} />
          <View style={{ flexDirection: "row", gap: space.md }}>
            <Button label="Call Mobile" icon={Smartphone} variant="outline" onPress={() => callNumber(CONTACT.mobileIntl)} style={{ flex: 1 }} fullWidth />
            <Button label="Call Office" icon={Phone} variant="outline" onPress={callOffice} style={{ flex: 1 }} fullWidth />
          </View>
        </View>

        <Card padded={false} style={{ marginTop: space.xl, overflow: "hidden" }}>
          <ListRow icon={MapPin} title="Office" subtitle={CONTACT.officeAddress} onPress={() => openMaps(CONTACT.officeCoords.lat, CONTACT.officeCoords.lng, "Eminent Enterprises")} right={<Navigation size={18} color={colors.accentStrong} />} />
          <ListRow icon={Phone} title={CONTACT.phone} subtitle={`Mobile / WhatsApp: ${CONTACT.mobile}`} onPress={callOffice} />
          <ListRow icon={Clock} title="Office Hours" subtitle={CONTACT.officeHours} />
          <ListRow icon={Globe} title="Service Region" subtitle={CONTACT.serviceRegion} last />
        </Card>

        <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.lg }}>
          {[
            { label: "Facebook", href: CONTACT.facebook.href },
            { label: "Instagram", href: CONTACT.instagram.href },
            { label: "TikTok", href: CONTACT.tiktok.href },
          ].map((s) => (
            <Button key={s.label} label={s.label} variant="outline" size="sm" onPress={() => openSocial(s.href)} style={{ flex: 1 }} fullWidth />
          ))}
        </View>

        <Card style={{ marginTop: space.xxl, gap: space.lg }}>
          <View style={{ gap: 4 }}>
            <Text variant="headingLg" color={palette.navy800}>
              Send an Enquiry
            </Text>
            <Text variant="bodySm" color={colors.inkSecondary}>
              Fill out the form and our team will reach out shortly.
            </Text>
          </View>
          <EnquiryForm showReason />
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}
