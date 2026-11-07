import { View } from "react-native";
import { Tabs } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calculator, Heart, Home, LayoutGrid, Search } from "lucide-react-native";
import { useSaved } from "@/state/saved";
import { colors, fonts, palette } from "@/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { shortlist } = useSaved();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 11, marginTop: 2 },
        tabBarStyle: {
          backgroundColor: palette.paper,
          borderTopColor: colors.borderHairline,
          height: 70 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={String(color)} focused={focused} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarIcon: ({ color, focused }) => <TabIcon icon={Search} color={String(color)} focused={focused} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarBadge: shortlist.length > 0 ? shortlist.length : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent, fontFamily: fonts.bodyBold, fontSize: 10 },
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Heart} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{ title: "Tools", tabBarIcon: ({ color, focused }) => <TabIcon icon={Calculator} color={String(color)} focused={focused} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "More", tabBarIcon: ({ color, focused }) => <TabIcon icon={LayoutGrid} color={String(color)} focused={focused} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ icon: IconCmp, color, focused }: { icon: typeof Home; color: string; focused: boolean }) {
  return (
    <View
      style={{
        width: 52,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? palette.iris50 : "transparent",
      }}
    >
      <IconCmp size={21} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}
