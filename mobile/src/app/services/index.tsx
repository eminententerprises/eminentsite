import { View } from "react-native";
import { router } from "expo-router";
import { Briefcase, CheckCircle2, PieChart, Wrench } from "lucide-react-native";
import { EMINENT } from "@/config/site";
import { Bullet, Card, IconTile, PressableCard, Text } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { colors, palette, space } from "@/theme";

const ICONS = [Briefcase, PieChart, Wrench];

export default function ServicesScreen() {
  return (
    <Screen>
      <PageIntro kicker={EMINENT.name} title="Our Services" body={EMINENT.boilerplate} />
      <View style={{ gap: space.lg, marginTop: space.xl }}>
        {EMINENT.services.map((s, i) => (
          <PressableCard key={s.slug} onPress={() => router.push(`/services/${s.slug}`)} accessibilityLabel={s.name} style={{ padding: space.xl, gap: space.md }}>
            <IconTile icon={ICONS[i % ICONS.length]} />
            <Text variant="headingLg" color={palette.navy800}>
              {s.name}
            </Text>
            <Text variant="bodyMd" color={colors.inkSecondary}>
              {s.description}
            </Text>
            <Text variant="label" color={colors.accentStrong}>
              Learn more →
            </Text>
          </PressableCard>
        ))}
      </View>
      <Card style={{ marginTop: space.xxl, gap: space.md }}>
        <Text variant="headingLg" color={palette.navy800}>
          Why Choose Eminent
        </Text>
        {EMINENT.whyChoose.map((r) => (
          <Bullet key={r} icon={CheckCircle2}>
            {r}
          </Bullet>
        ))}
      </Card>
    </Screen>
  );
}
