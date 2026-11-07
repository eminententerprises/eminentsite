import { View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, Circle, FileDown, MapPin, Navigation, SearchX } from "lucide-react-native";
import { getProjectBySlug } from "@/lib/repositories/project-repository";
import { formatPKR } from "@/lib/format-pkr";
import { formatAreaAuto } from "@/lib/area";
import { whatsAppProjectMessage } from "@/lib/whatsapp";
import { openMaps } from "@/lib/links";
import { Badge, Bullet, Button, Card, Divider, EmptyState, Text } from "@/components/ui";
import { CONTACT_BAR_HEIGHT, ContactBar, Screen } from "@/components/layout";
import { Gallery } from "@/components/gallery";
import { ShareBar } from "@/components/result";
import { colors, fonts, GUTTER, palette, space } from "@/theme";

export default function ProjectDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const project = getProjectBySlug(String(slug));

  if (!project) {
    return <EmptyState icon={SearchX} title="Project not found" action={<Button label="All projects" onPress={() => router.replace("/projects")} />} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: project.name }} />
      <Screen padded={false} extraBottom={CONTACT_BAR_HEIGHT}>
        <Gallery images={project.images} height={280} />
        <View style={{ paddingHorizontal: GUTTER, paddingTop: space.xl, gap: space.lg }}>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            <Badge label={project.possession} variant="accent" />
            <Badge label={project.approval} variant="outline" />
          </View>
          <View style={{ gap: 6 }}>
            <Text variant="displayMd" color={palette.navy800}>
              {project.name}
            </Text>
            <Text variant="bodyMd" color={colors.inkSecondary}>
              {project.tagline}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MapPin size={15} color={colors.inkMuted} />
              <Text variant="bodySm" color={colors.inkMuted}>
                {project.location.area}, {project.location.cityLabel} · by {project.developer}
              </Text>
            </View>
          </View>
          <Text variant="bodyLg" color={colors.inkSecondary}>
            {project.description}
          </Text>

          <Heading>Unit Types</Heading>
          <Card padded={false} style={{ paddingHorizontal: space.lg }}>
            {project.unitTypes.map((u, i) => (
              <View key={u.name}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: space.md }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="headingSm">{u.name}</Text>
                    <Text variant="mono" color={colors.inkMuted}>
                      {u.areaSqft.toLocaleString("en-PK")} sq ft · {formatAreaAuto(u.areaSqft)}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text variant="bodySm" color={colors.inkMuted} style={{ fontSize: 11 }}>
                      from
                    </Text>
                    <Text variant="mono" style={{ fontFamily: fonts.monoBold }} color={palette.navy800}>
                      {formatPKR(u.startingPrice).short}
                    </Text>
                  </View>
                </View>
                {i < project.unitTypes.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>

          <Heading>Payment Plan</Heading>
          <Card style={{ gap: space.lg }}>
            {project.paymentPlan.map((m) => (
              <View key={m.label} style={{ gap: 6 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space.md }}>
                  <Text variant="bodySm" style={{ fontFamily: fonts.bodySemi, flex: 1 }}>
                    {m.label}
                  </Text>
                  <Text variant="mono" color={colors.accentStrong} style={{ fontFamily: fonts.monoBold }}>
                    {m.percentage}%
                  </Text>
                </View>
                <ShareBar share={m.percentage / 100} />
                {m.amountNote ? (
                  <Text variant="bodySm" color={colors.inkMuted} style={{ fontSize: 12 }}>
                    {m.amountNote}
                  </Text>
                ) : null}
              </View>
            ))}
          </Card>

          <Heading>Construction Progress</Heading>
          <View style={{ gap: space.md }}>
            {project.progress.map((m) => (
              <View key={m.label} style={{ flexDirection: "row", gap: space.md, alignItems: "center" }}>
                {m.complete ? <CheckCircle2 size={20} color={colors.success} /> : <Circle size={20} color={colors.borderStrong} />}
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMd" color={m.complete ? colors.inkPrimary : colors.inkMuted}>
                    {m.label}
                  </Text>
                  <Text variant="bodySm" color={colors.inkMuted} style={{ fontSize: 12 }}>
                    {new Date(m.date).toLocaleDateString("en-PK", { month: "short", year: "numeric" })}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {project.amenities.length ? (
            <>
              <Heading>Amenities</Heading>
              <View style={{ gap: space.sm }}>
                {project.amenities.map((a) => (
                  <Bullet key={a} icon={CheckCircle2}>
                    {a}
                  </Bullet>
                ))}
              </View>
            </>
          ) : null}

          {project.locationAdvantages.length ? (
            <>
              <Heading>Location Advantages</Heading>
              <View style={{ gap: space.sm }}>
                {project.locationAdvantages.map((a) => (
                  <Bullet key={a}>{a}</Bullet>
                ))}
              </View>
            </>
          ) : null}

          <View style={{ gap: space.md, marginTop: space.md }}>
            <Button
              label="Open in Maps"
              icon={Navigation}
              variant="outline"
              fullWidth
              onPress={() => openMaps(project.location.coords.lat, project.location.coords.lng, `${project.name}, ${project.location.area}`)}
            />
            {project.brochureAvailable ? (
              <Button
                label="Request Brochure"
                icon={FileDown}
                fullWidth
                onPress={() => router.push({ pathname: "/enquire", params: { reason: "Investment", message: `Please send me the brochure for ${project.name}.` } })}
              />
            ) : null}
          </View>
        </View>
      </Screen>
      <ContactBar whatsappMessage={whatsAppProjectMessage({ title: project.name })} />
    </View>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <Text variant="headingLg" color={palette.navy800} style={{ marginTop: space.md }}>
      {children}
    </Text>
  );
}
