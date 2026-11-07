import { View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, MessageCircle, SearchX } from "lucide-react-native";
import type { EnquiryReason } from "@/types";
import { EMINENT } from "@/config/site";
import { SERVICE_DETAILS } from "@/data/service-details";
import { whatsAppServiceMessage } from "@/lib/whatsapp";
import { openWhatsApp } from "@/lib/links";
import { seedImage } from "@/lib/image";
import { useProperties } from "@/state/properties";
import { Bullet, Button, Card, EmptyState, IconCircle, SectionHeader, SurveyLine, Text } from "@/components/ui";
import { HeroBanner, Screen } from "@/components/layout";
import { PropertyCard } from "@/components/cards";
import { Accordion } from "@/components/accordion";
import { EnquiryForm } from "@/components/enquiry-form";
import { colors, fonts, GUTTER, palette, space } from "@/theme";

const REASON_BY_SLUG: Record<string, EnquiryReason> = {
  "property-sale-purchase": "Buy/Sell",
  "investment-portfolio-management": "Investment",
  "property-management-allied-services": "Property Management",
};

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { properties } = useProperties();
  const service = EMINENT.services.find((s) => s.slug === slug);

  if (!service) {
    return <EmptyState icon={SearchX} title="Service not found" action={<Button label="All services" onPress={() => router.replace("/services")} />} />;
  }

  const detail = SERVICE_DETAILS[service.slug];
  const featured = service.slug === "property-sale-purchase" ? properties.filter((p) => p.isFeatured).slice(0, 3) : [];

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ title: service.name }} />
      <HeroBanner image={seedImage(detail.heroImageSeed, 1200, 800)} kicker={EMINENT.name} title={service.name} body={service.description} height={320}>
        <Button
          label="Discuss on WhatsApp"
          icon={MessageCircle}
          variant="whatsapp"
          onPress={() => openWhatsApp(whatsAppServiceMessage({ title: service.name }))}
          style={{ marginTop: space.md }}
        />
      </HeroBanner>

      <View style={{ flexDirection: "row", backgroundColor: colors.surfaceWarm, paddingHorizontal: GUTTER, paddingVertical: space.xl, gap: space.md }}>
        {detail.stats.map((s) => (
          <View key={s.label} style={{ flex: 1, borderLeftWidth: 2, borderLeftColor: colors.accentStrong, paddingLeft: space.md }}>
            <Text variant="headingLg" color={palette.navy800}>
              {s.value}
            </Text>
            <Text variant="bodySm" color={colors.inkSecondary} style={{ fontSize: 12 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: GUTTER, gap: space.lg }}>
        <SurveyLine label={service.name} style={{ marginTop: space.lg }} />

        <SectionHeader title="What's Included" />
        <Text variant="bodyMd" color={colors.inkSecondary}>
          Everything below is part of the same engagement, not billed as separate add-ons.
        </Text>
        <View style={{ gap: space.md }}>
          {detail.highlights.map((h) => (
            <Card key={h.title} style={{ flexDirection: "row", gap: space.md }}>
              <IconCircle icon={h.icon} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="headingSm">{h.title}</Text>
                <Text variant="bodySm" color={colors.inkSecondary}>
                  {h.description}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <SectionHeader title="How It Works" style={{ marginTop: space.xl }} />
        <View style={{ gap: space.lg }}>
          {detail.process.map((step, i) => (
            <View key={step.title} style={{ flexDirection: "row", gap: space.lg }}>
              <Text style={{ fontFamily: fonts.displayBlack, fontSize: 30, lineHeight: 32, width: 40 }} color={colors.accentSoft}>
                {String(i + 1).padStart(2, "0")}
              </Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text variant="headingSm">{step.title}</Text>
                <Text variant="bodySm" color={colors.inkSecondary}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {featured.length > 0 ? (
          <>
            <SectionHeader title="Featured Listings" actionLabel="View all" onAction={() => router.navigate("/search")} style={{ marginTop: space.xl }} />
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </>
        ) : null}

        <Card style={{ gap: space.md, marginTop: space.xl }}>
          <Text variant="headingLg" color={palette.navy800}>
            Why Work With Eminent
          </Text>
          {EMINENT.whyChoose.map((r) => (
            <Bullet key={r} icon={CheckCircle2}>
              {r}
            </Bullet>
          ))}
        </Card>

        <SectionHeader title="Frequently Asked Questions" style={{ marginTop: space.xl }} />
        <Accordion items={detail.faqs} />

        <Text style={{ fontFamily: fonts.accent, fontSize: 22, lineHeight: 30, textAlign: "center", marginVertical: space.xl }} color={palette.navy800}>
          “{detail.pullQuote}”
        </Text>

        <Card style={{ gap: space.lg }}>
          <Text variant="headingLg" color={palette.navy800}>
            Send an Enquiry
          </Text>
          <EnquiryForm showReason defaultReason={REASON_BY_SLUG[service.slug]} />
        </Card>
      </View>
    </Screen>
  );
}
