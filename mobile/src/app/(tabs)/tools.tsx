import { View } from "react-native";
import { router, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BrickWall, Calculator, Gauge, HardHat, Ruler } from "lucide-react-native";
import { NAV } from "@/config/site";
import { Card, IconTile, ListRow, Text, type Icon } from "@/components/ui";
import { FocusStatusBar, Screen } from "@/components/layout";
import { colors, GUTTER, palette, space } from "@/theme";

/** Website route → app route, with an icon per tool. */
const ROUTES: Record<string, { href: Href; icon: Icon }> = {
  "/tools/eminent-estimate": { href: "/tools/estimate", icon: Gauge },
  "/tools/mortgage-calculator": { href: "/tools/mortgage", icon: Calculator },
  "/tools/area-converter": { href: "/tools/area-converter", icon: Ruler },
  "/construction/estimate": { href: "/tools/construction-cost", icon: HardHat },
  "/tools/material-calculator": { href: "/tools/materials", icon: BrickWall },
};

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const groups = [
    { title: "Real Estate", items: NAV.calculators.realEstate },
    { title: "Construction", items: NAV.calculators.construction },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceSunken }}>
      <FocusStatusBar style="dark" />
      <Screen padded={false} bottomInset={false} style={{ backgroundColor: colors.surfaceSunken }}>
        <View style={{ paddingTop: insets.top + space.md, paddingHorizontal: GUTTER, gap: space.sm }}>
          <Text variant="displayMd" color={palette.navy800}>
            Calculators
          </Text>
          <Text variant="bodyMd" color={colors.inkSecondary}>
            Indicative figures to help you plan. For a firm quote, talk to our team.
          </Text>
        </View>

        {/* Featured tool */}
        <View style={{ paddingHorizontal: GUTTER, marginTop: space.xl }}>
          <Card style={{ flexDirection: "row", gap: space.lg, alignItems: "center", backgroundColor: palette.navy800, borderColor: palette.navy800 }}>
            <IconTile icon={Gauge} size={56} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="headingLg" color={palette.paper}>
                Eminent Estimate
              </Text>
              <Text variant="bodySm" color={colors.inkInvertedMuted}>
                What's my property worth? Get an instant indicative range in five quick steps.
              </Text>
              <Text variant="label" color={palette.iris300} style={{ marginTop: 6 }} onPress={() => router.push("/tools/estimate")}>
                Start estimate →
              </Text>
            </View>
          </Card>
        </View>

        {groups.map((g) => (
          <View key={g.title} style={{ paddingHorizontal: GUTTER, marginTop: space.xxl, gap: space.md }}>
            <Text variant="label" color={colors.inkMuted}>
              {g.title}
            </Text>
            <Card padded={false} style={{ overflow: "hidden" }}>
              {g.items.map((item, i) => {
                const route = ROUTES[item.href];
                return (
                  <ListRow
                    key={item.href}
                    icon={route?.icon}
                    title={item.label}
                    subtitle={item.description}
                    onPress={() => route && router.push(route.href)}
                    last={i === g.items.length - 1}
                  />
                );
              })}
            </Card>
          </View>
        ))}
      </Screen>
    </View>
  );
}
