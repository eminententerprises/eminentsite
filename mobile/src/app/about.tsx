import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, CheckCircle2 } from "lucide-react-native";
import { BURAQ, EMINENT, GROUP } from "@/config/site";
import { TRUST_STATS } from "@/data/trust-stats";
import { Bullet, Button, Kicker, SurveyLine, Text } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { colors, GUTTER, gradients, palette, radius, space } from "@/theme";

const TIMELINE = [
  { label: "Founded", detail: "Eminent Enterprises begins advising local buyers and sellers across the twin cities." },
  { label: "10+ Years In", detail: `${EMINENT.credentialBadge} serving clients across Islamabad, Rawalpindi and the hill regions.` },
  { label: "Buraq Launches", detail: BURAQ.badge },
];

export default function AboutScreen() {
  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: GUTTER, paddingTop: space.xl }}>
        <PageIntro kicker="About Us" title={GROUP.headline} body={GROUP.body} />
        <SurveyLine style={{ marginTop: space.xl }} />

        <Text variant="displaySm" color={palette.navy800} style={{ marginTop: space.xl }}>
          Our Story
        </Text>
        <View style={{ marginTop: space.lg }}>
          {TIMELINE.map((t, i) => (
            <View key={t.label} style={{ flexDirection: "row", gap: space.lg }}>
              <View style={{ alignItems: "center", width: 14 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.accent, marginTop: 4 }} />
                {i < TIMELINE.length - 1 ? <View style={{ width: 2, flex: 1, backgroundColor: colors.accentSoft }} /> : null}
              </View>
              <View style={{ flex: 1, paddingBottom: space.xl }}>
                <Text variant="headingSm">{t.label}</Text>
                <Text variant="bodyMd" color={colors.inkSecondary} style={{ marginTop: 4 }}>
                  {t.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: palette.navy800, paddingVertical: space.xxl, paddingHorizontal: GUTTER, flexDirection: "row", gap: space.md }}>
        {TRUST_STATS.map((s) => (
          <View key={s.label} style={{ flex: 1, alignItems: "center" }}>
            <Text variant="displaySm" color={palette.paper}>
              {s.value}
            </Text>
            <Text variant="bodySm" color={colors.inkInvertedMuted} style={{ textAlign: "center", fontSize: 12 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: GUTTER, gap: space.lg, paddingTop: space.xxl }}>
        <BrandBlock colorsPair={gradients.irisCard} kicker="Real Estate Advisory" name={EMINENT.name} positioning={EMINENT.positioning} body={EMINENT.boilerplate} reasons={EMINENT.whyChoose.slice(0, 4)} />
        <BrandBlock colorsPair={gradients.creamCard} kicker="Construction" name={BURAQ.name} positioning={BURAQ.positioning} body={BURAQ.intro} reasons={BURAQ.whyChoose.slice(0, 4)}>
          <Button label="Visit Buraq" iconRight={ArrowRight} variant="outline" size="sm" onPress={() => router.push("/construction")} style={{ marginTop: space.md }} />
        </BrandBlock>

        <Text variant="displaySm" color={palette.navy800} style={{ marginTop: space.lg }}>
          Our Team
        </Text>
        <Text variant="bodyMd" color={colors.inkSecondary}>
          Our advisory and construction teams bring together local market specialists, property consultants, and site supervisors working across Islamabad, Rawalpindi and the hill regions. Each engagement is handled by a dedicated point of contact from first enquiry through to closing or handover.
        </Text>

        <View style={{ alignItems: "center", gap: space.md, marginTop: space.xl }}>
          <Text variant="headingLg">Have a property goal in mind?</Text>
          <Button label="Get in Touch" size="lg" onPress={() => router.push("/contact")} />
        </View>
      </View>
    </Screen>
  );
}

function BrandBlock({
  colorsPair,
  kicker,
  name,
  positioning,
  body,
  reasons,
  children,
}: {
  colorsPair: readonly [string, string];
  kicker: string;
  name: string;
  positioning: string;
  body: string;
  reasons: readonly string[];
  children?: React.ReactNode;
}) {
  return (
    <View style={{ borderRadius: radius.xxl, overflow: "hidden", padding: space.xxl, gap: space.sm }}>
      <LinearGradient colors={colorsPair} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Kicker>{kicker}</Kicker>
      <Text variant="displaySm" color={palette.navy800}>
        {name}
      </Text>
      <Text variant="label" color={colors.inkSecondary} style={{ letterSpacing: 1 }}>
        {positioning}
      </Text>
      <Text variant="bodyMd" color={colors.inkSecondary}>
        {body}
      </Text>
      <View style={{ gap: space.sm, marginTop: space.sm }}>
        {reasons.map((r) => (
          <Bullet key={r} icon={CheckCircle2}>
            {r}
          </Bullet>
        ))}
      </View>
      {children}
    </View>
  );
}
