import { View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { MessageCircle, SearchX } from "lucide-react-native";
import type { ConstructionServiceSlug } from "@/types";
import { BURAQ } from "@/config/site";
import { getConstructionProjectsByService } from "@/lib/repositories/construction-repository";
import { whatsAppConstructionMessage } from "@/lib/whatsapp";
import { openWhatsApp } from "@/lib/links";
import { seedImage } from "@/lib/image";
import { Button, Card, EmptyState, SectionHeader, SurveyLine, Text } from "@/components/ui";
import { HeroBanner, Screen } from "@/components/layout";
import { CaseStudyCard } from "@/components/cards";
import { EnquiryForm } from "@/components/enquiry-form";
import { colors, GUTTER, palette, space } from "@/theme";

export default function ConstructionServiceScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const service = BURAQ.services.find((s) => s.slug === slug);

  if (!service) {
    return <EmptyState icon={SearchX} title="Service not found" action={<Button label="Construction" onPress={() => router.replace("/construction")} />} />;
  }

  const related = getConstructionProjectsByService(service.slug as ConstructionServiceSlug);
  const cover = related[0]?.afterImages[0]?.src ?? related[0]?.beforeImages[0]?.src ?? seedImage(`buraq-${service.slug}`, 1200, 800);

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ title: service.name }} />
      <HeroBanner image={cover} kicker={`Service ${String(service.order).padStart(2, "0")} of ${BURAQ.services.length}`} title={service.name} body={service.description} height={300}>
        <Button label="Discuss on WhatsApp" icon={MessageCircle} variant="whatsapp" onPress={() => openWhatsApp(whatsAppConstructionMessage())} style={{ marginTop: space.md }} />
      </HeroBanner>
      <View style={{ paddingHorizontal: GUTTER, gap: space.lg }}>
        <SurveyLine style={{ marginTop: space.lg }} />
        <SectionHeader title={related.length > 0 ? "Related Case Studies" : "Case Studies Coming Soon"} />
        {related.length > 0 ? (
          related.map((p) => <CaseStudyCard key={p.id} project={p} />)
        ) : (
          <Text variant="bodyMd" color={colors.inkSecondary}>
            We're building out our {service.name.toLowerCase()} portfolio. Get in touch and we'll walk you through recent work directly.
          </Text>
        )}
        <Card style={{ gap: space.lg, marginTop: space.lg }}>
          <Text variant="headingLg" color={palette.navy800}>
            Enquire About {service.name}
          </Text>
          <Text variant="bodySm" color={colors.inkSecondary}>
            Share a few details and our team will get back to you, usually the same day.
          </Text>
          <EnquiryForm showReason defaultReason={service.slug === "renovation" ? "Renovation" : "Construction"} />
        </Card>
      </View>
    </Screen>
  );
}
