import { useState } from "react";
import { View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, Circle, MessageCircle, SearchX } from "lucide-react-native";
import { BURAQ } from "@/config/site";
import { getConstructionProjectBySlug } from "@/lib/repositories/construction-repository";
import { whatsAppProjectMessage } from "@/lib/whatsapp";
import { Badge, Button, Card, EmptyState, KeyValue, Text } from "@/components/ui";
import { Segmented } from "@/components/form";
import { CONTACT_BAR_HEIGHT, ContactBar, Screen } from "@/components/layout";
import { Gallery } from "@/components/gallery";
import { colors, GUTTER, palette, space } from "@/theme";

export default function CaseStudyScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const project = getConstructionProjectBySlug(String(slug));
  const [view, setView] = useState<"after" | "before">("after");

  if (!project) {
    return <EmptyState icon={SearchX} title="Project not found" action={<Button label="View portfolio" onPress={() => router.replace("/construction/portfolio")} />} />;
  }

  const service = BURAQ.services.find((s) => s.slug === project.serviceType);
  const images = view === "after" && project.afterImages.length ? project.afterImages : project.beforeImages;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: project.title }} />
      <Screen padded={false} extraBottom={CONTACT_BAR_HEIGHT}>
        <Gallery key={view} images={images} height={300} />
        <View style={{ paddingHorizontal: GUTTER, paddingTop: space.lg, gap: space.lg }}>
          {project.beforeImages.length && project.afterImages.length ? (
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "before", label: "Before" },
                { value: "after", label: "After" },
              ]}
            />
          ) : null}
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            <Badge label={project.qualityTier} variant="accent" />
            {service ? <Badge label={service.name} variant="warm" /> : null}
          </View>
          <Text variant="displaySm" color={palette.navy800}>
            {project.title}
          </Text>
          <Text variant="bodyMd" color={colors.inkMuted}>
            {project.location} · {project.year}
          </Text>
          <Text variant="bodyLg" color={colors.inkSecondary}>
            {project.summary}
          </Text>

          <Card padded={false} style={{ paddingHorizontal: space.lg }}>
            <KeyValue label="Covered area" value={`${project.coveredAreaSqft.toLocaleString("en-PK")} sq ft`} />
            <KeyValue label="Storeys" value={String(project.storeys)} />
            <KeyValue label="Duration" value={`${project.durationMonths} months`} />
            {project.specSheet.map((s, i) => (
              <KeyValue key={s.label} label={s.label} value={s.value} last={i === project.specSheet.length - 1} />
            ))}
          </Card>

          <Text variant="headingLg" color={palette.navy800} style={{ marginTop: space.md }}>
            Project Timeline
          </Text>
          <View style={{ gap: space.md }}>
            {project.timeline.map((t) => (
              <View key={t.phase} style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
                {t.complete ? <CheckCircle2 size={20} color={colors.success} /> : <Circle size={20} color={colors.borderStrong} />}
                <Text variant="bodyMd" color={t.complete ? colors.inkPrimary : colors.inkMuted}>
                  {t.phase}
                </Text>
              </View>
            ))}
          </View>

          <Button
            label="Start a similar project"
            icon={MessageCircle}
            variant="outline"
            fullWidth
            onPress={() => router.push({ pathname: "/enquire", params: { reason: project.serviceType === "renovation" ? "Renovation" : "Construction", message: `I'd like a project similar to "${project.title}".` } })}
          />
        </View>
      </Screen>
      <ContactBar whatsappMessage={whatsAppProjectMessage({ title: project.title })} />
    </View>
  );
}
