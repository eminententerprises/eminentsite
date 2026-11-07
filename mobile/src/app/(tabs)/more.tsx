import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BookOpen,
  Briefcase,
  Building2,
  ClipboardPlus,
  FileText,
  Globe,
  Globe2,
  HardHat,
  Info,
  LockKeyhole,
  Mail,
  MapPinned,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react-native";
import { CONTACT, EMINENT } from "@/config/site";
import { callNumber, openSocial, openWebPath, openWhatsApp } from "@/lib/links";
import { Card, ListRow, Text } from "@/components/ui";
import { FocusStatusBar, Screen } from "@/components/layout";
import { colors, fonts, GUTTER, palette, radius, space } from "@/theme";

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  const sections = [
    {
      title: "Explore",
      rows: [
        { icon: Building2, title: "New Projects", onPress: () => router.push("/projects") },
        { icon: MapPinned, title: "Area Guides", onPress: () => router.push("/areas") },
        { icon: BookOpen, title: "Insights", onPress: () => router.push("/insights") },
        { icon: Globe2, title: "Overseas Pakistanis", onPress: () => router.push("/overseas") },
      ],
    },
    {
      title: "Services",
      rows: [
        { icon: Briefcase, title: "Real Estate Services", subtitle: "Sale & purchase, investment, management", onPress: () => router.push("/services") },
        { icon: HardHat, title: "Buraq Construction", subtitle: "Build, renovate, interiors, supervision", onPress: () => router.push("/construction") },
        { icon: ClipboardPlus, title: "List Your Property", subtitle: "Sell or rent out with us", onPress: () => router.push("/list-property") },
      ],
    },
    {
      title: "Company",
      rows: [
        { icon: Info, title: "About Us", onPress: () => router.push("/about") },
        { icon: Mail, title: "Contact Us", onPress: () => router.push("/contact") },
        { icon: Globe, title: "Visit Website", subtitle: CONTACT.website, onPress: () => openWebPath("/") },
      ],
    },
    {
      title: "Legal",
      rows: [
        { icon: ShieldCheck, title: "Privacy Policy", onPress: () => openWebPath("/privacy") },
        { icon: FileText, title: "Terms of Use", onPress: () => openWebPath("/terms") },
        { icon: LockKeyhole, title: "Admin Dashboard", subtitle: "For Eminent staff", onPress: () => openWebPath("/admin") },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceSunken }}>
      <FocusStatusBar style="dark" />
      <Screen padded={false} bottomInset={false} style={{ backgroundColor: colors.surfaceSunken }}>
        <View style={{ paddingTop: insets.top + space.md, paddingHorizontal: GUTTER }}>
          <Text variant="displayMd" color={palette.navy800}>
            More
          </Text>
        </View>

        {/* Quick contact */}
        <View style={{ paddingHorizontal: GUTTER, marginTop: space.lg }}>
          <View style={styles.contactCard}>
            <Text variant="headingLg" color={palette.paper}>
              Talk to {EMINENT.name}
            </Text>
            <Text variant="bodySm" color={colors.inkInvertedMuted}>
              {CONTACT.officeHours}
            </Text>
            <View style={{ flexDirection: "row", gap: space.sm, marginTop: space.md }}>
              <QuickAction icon={Phone} label="Call" onPress={() => callNumber()} />
              <QuickAction icon={MessageCircle} label="WhatsApp" onPress={() => openWhatsApp("Hi Eminent Enterprises, I'd like to get in touch.")} green />
              <QuickAction icon={Mail} label="Enquire" onPress={() => router.push("/enquire")} />
            </View>
          </View>
        </View>

        {sections.map((s) => (
          <View key={s.title} style={{ paddingHorizontal: GUTTER, marginTop: space.xxl, gap: space.md }}>
            <Text variant="label" color={colors.inkMuted}>
              {s.title}
            </Text>
            <Card padded={false} style={{ overflow: "hidden" }}>
              {s.rows.map((r, i) => (
                <ListRow key={r.title} icon={r.icon} title={r.title} subtitle={"subtitle" in r ? r.subtitle : undefined} onPress={r.onPress} last={i === s.rows.length - 1} />
              ))}
            </Card>
          </View>
        ))}

        <View style={{ flexDirection: "row", justifyContent: "center", gap: space.xl, marginTop: space.xxxl }}>
          {[CONTACT.facebook, CONTACT.instagram, CONTACT.tiktok].map((s, i) => (
            <Pressable key={s.href} onPress={() => openSocial(s.href)} accessibilityRole="link" hitSlop={8}>
              <Text variant="label" color={colors.accentStrong}>
                {["Facebook", "Instagram", "TikTok"][i]}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text variant="bodySm" color={colors.inkMuted} style={{ textAlign: "center", marginTop: space.lg, fontSize: 12 }}>
          {EMINENT.legalName} · v{version}
        </Text>
      </Screen>
    </View>
  );
}

function QuickAction({ icon: IconCmp, label, onPress, green }: { icon: typeof Phone; label: string; onPress: () => void; green?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.quick, green && { backgroundColor: palette.whatsapp }, pressed && { opacity: 0.8 }]}
    >
      <IconCmp size={20} color={palette.paper} />
      <Text variant="bodySm" color={palette.paper} style={{ fontFamily: fonts.bodySemi, fontSize: 12.5 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contactCard: { backgroundColor: palette.navy800, borderRadius: radius.xxl, padding: space.xl, gap: 4 },
  quick: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
});
