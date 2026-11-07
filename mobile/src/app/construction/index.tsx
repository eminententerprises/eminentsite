import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Building2, CheckCircle2, Clock, Gem, HardHat, MessageCircle, ShieldCheck, Users, ArrowRight, Calculator, BrickWall } from "lucide-react-native";
import { BURAQ } from "@/config/site";
import { getFeaturedConstructionProjects } from "@/lib/repositories/construction-repository";
import { whatsAppConstructionMessage } from "@/lib/whatsapp";
import { openWhatsApp } from "@/lib/links";
import { seedImage } from "@/lib/image";
import { Bullet, Button, Card, IconTile, ListRow, SectionHeader, SurveyLine, Text } from "@/components/ui";
import { HeroBanner, Screen } from "@/components/layout";
import { CaseStudyCard } from "@/components/cards";
import { EnquiryForm } from "@/components/enquiry-form";
import { colors, fonts, GUTTER, palette, radius, space } from "@/theme";

const PILLAR_ICONS = [Gem, Clock, Users, ShieldCheck];

export default function ConstructionScreen() {
  const featured = getFeaturedConstructionProjects(3);
  const hero = featured[0]?.afterImages[0]?.src ?? seedImage("buraq-hero", 1200, 900);
  const services = [...BURAQ.services].sort((a, b) => a.order - b.order);

  return (
    <Screen padded={false} style={{ backgroundColor: palette.cream200 }}>
      <HeroBanner image={hero} kicker={BURAQ.badge} title={BURAQ.heroHeadline} body={BURAQ.intro} height={420}>
        <View style={{ gap: space.sm, marginTop: space.md }}>
          <Button label="Discuss Your Project" icon={MessageCircle} variant="whatsapp" onPress={() => openWhatsApp(whatsAppConstructionMessage())} fullWidth />
          <Button label="View Portfolio" variant="inverted" onPress={() => router.push("/construction/portfolio")} fullWidth />
        </View>
      </HeroBanner>

      <View style={{ paddingHorizontal: GUTTER, gap: space.lg }}>
        <SurveyLine label={BURAQ.name} style={{ marginTop: space.lg }} />

        <Text variant="displaySm" color={palette.navy800}>
          {BURAQ.subPositioning}
        </Text>
        <Text variant="bodyMd" color={colors.inkSecondary}>
          {BURAQ.subPositioningBody}
        </Text>
        <Card style={{ gap: space.sm }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <Building2 size={18} color={colors.accentStrong} />
            <Text variant="label" color={colors.accentStrong}>
              Working With Architects
            </Text>
          </View>
          <Text variant="bodyMd" color={colors.inkSecondary}>
            Every Buraq project begins with a partnership between our construction team and an independent architect matched to your site, budget and vision. From first concept sketches through to final structural sign-off, the same design panel stays involved, so what gets approved on paper is exactly what gets built on site.
          </Text>
        </Card>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.md, marginTop: space.md }}>
          {BURAQ.pillars.map((p, i) => (
            <View key={p} style={{ width: "47.9%", alignItems: "center", gap: space.md, backgroundColor: palette.paper, borderRadius: radius.xxl, paddingVertical: space.xl, paddingHorizontal: space.sm }}>
              <IconTile icon={PILLAR_ICONS[i] ?? Gem} />
              <Text variant="label" style={{ textAlign: "center", fontSize: 12 }} color={colors.inkPrimary}>
                {p}
              </Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Our Services" style={{ marginTop: space.xl }} />
        <Text variant="bodyMd" color={colors.inkSecondary}>
          A construction project moves through the same five stages, in order. Here's where Buraq fits into each one.
        </Text>
        <View style={{ gap: space.md }}>
          {services.map((s) => (
            <Pressable
              key={s.slug}
              onPress={() => router.push(`/construction/service/${s.slug}`)}
              accessibilityRole="button"
              accessibilityLabel={s.name}
              style={({ pressed }) => ({ flexDirection: "row", gap: space.lg, backgroundColor: palette.paper, borderRadius: radius.xl, padding: space.lg, opacity: pressed ? 0.85 : 1 })}
            >
              <Text style={{ fontFamily: fonts.displayBlack, fontSize: 30, lineHeight: 32 }} color={colors.accent}>
                {String(s.order).padStart(2, "0")}
              </Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="headingSm">{s.name}</Text>
                <Text variant="bodySm" color={colors.inkSecondary}>
                  {s.description}
                </Text>
              </View>
              <ArrowRight size={18} color={colors.inkMuted} style={{ alignSelf: "center" }} />
            </Pressable>
          ))}
        </View>

        <Card style={{ gap: space.md, marginTop: space.xl }}>
          <Text variant="headingLg" color={palette.navy800}>
            Why Choose Buraq
          </Text>
          {BURAQ.whyChoose.map((r) => (
            <Bullet key={r} icon={CheckCircle2}>
              {r}
            </Bullet>
          ))}
        </Card>
        <Text style={{ fontFamily: fonts.accent, fontSize: 22, lineHeight: 30, textAlign: "center", marginVertical: space.lg }} color={palette.navy800}>
          “{BURAQ.signatureLines[0]}”
        </Text>
      </View>

      {featured.length > 0 ? (
        <View style={{ gap: space.lg }}>
          <SectionHeader title="Recent Work" actionLabel="Portfolio" onAction={() => router.push("/construction/portfolio")} style={{ paddingHorizontal: GUTTER }} />
          <View style={{ paddingHorizontal: GUTTER, gap: space.lg }}>
            {featured.map((c) => (
              <CaseStudyCard key={c.id} project={c} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: GUTTER, gap: space.lg, marginTop: space.xxl }}>
        <Card padded={false} style={{ overflow: "hidden" }}>
          <ListRow icon={Calculator} title="Construction Cost Estimator" subtitle="Indicative build cost by covered area" onPress={() => router.push("/tools/construction-cost")} />
          <ListRow icon={BrickWall} title="Brick & Material Calculator" subtitle="Bricks, cement, sand, crush & steel" onPress={() => router.push("/tools/materials")} last />
        </Card>

        <Card style={{ gap: space.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
            <HardHat size={20} color={colors.accentStrong} />
            <Text variant="headingLg" color={palette.navy800}>
              Start Your Project
            </Text>
          </View>
          <EnquiryForm showReason defaultReason="Construction" submitLabel="Request a Consultation" />
        </Card>
        <Text style={{ fontFamily: fonts.accent, fontSize: 18, lineHeight: 26, textAlign: "center" }} color={colors.inkSecondary}>
          {BURAQ.signatureLines[2]}
        </Text>
      </View>
    </Screen>
  );
}
