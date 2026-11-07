import { View } from "react-native";
import { Tabs } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calculator, Heart, Home, LayoutGrid, Search } from "lucide-react-native";
import { useSaved } from "@/state/saved";
import { Glass } from "@/components/glass";
import { TabInsetContext } from "@/components/layout";
import { colors, fonts, palette } from "@/theme";

/** Floating glass tab bar geometry (Apple-style pill, 16pt from the screen edges). */
const BAR_HEIGHT = 66;
const BAR_SIDE = 16;
const BAR_GAP = 10;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { shortlist } = useSaved();
  const bottom = Math.max(insets.bottom, 8) + BAR_GAP;
  // Space every tab screen leaves at the bottom so content clears the bar.
  const inset = BAR_HEIGHT + bottom + 12;

  return (
    <TabInsetContext.Provider value={inset}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.inkMuted,
          tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 10.5, marginTop: 2 },
          tabBarItemStyle: { paddingVertical: 8 },
          tabBarStyle: {
            position: "absolute",
            left: BAR_SIDE,
            right: BAR_SIDE,
            bottom,
            height: BAR_HEIGHT,
            paddingTop: 0,
            paddingBottom: 0,
            borderRadius: BAR_HEIGHT / 2,
            borderTopWidth: 0,
            backgroundColor: "transparent",
            elevation: 0,
          },
          tabBarBackground: () => <Glass radius={BAR_HEIGHT / 2} intensity={80} style={{ flex: 1 }} />,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={String(color)} focused={focused} /> }} />
        <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: ({ color, focused }) => <TabIcon icon={Search} color={String(color)} focused={focused} /> }} />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            tabBarBadge: shortlist.length > 0 ? shortlist.length : undefined,
            tabBarBadgeStyle: { backgroundColor: colors.accent, fontFamily: fonts.bodyBold, fontSize: 10 },
            tabBarIcon: ({ color, focused }) => <TabIcon icon={Heart} color={String(color)} focused={focused} />,
          }}
        />
        <Tabs.Screen name="tools" options={{ title: "Tools", tabBarIcon: ({ color, focused }) => <TabIcon icon={Calculator} color={String(color)} focused={focused} /> }} />
        <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color, focused }) => <TabIcon icon={LayoutGrid} color={String(color)} focused={focused} /> }} />
      </Tabs>
    </TabInsetContext.Provider>
  );
}

function TabIcon({ icon: IconCmp, color, focused }: { icon: typeof Home; color: string; focused: boolean }) {
  return (
    <View
      style={{
        width: 46,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "rgba(108,78,234,0.12)" : "transparent",
      }}
    >
      <IconCmp size={20} color={color} strokeWidth={focused ? 2.4 : 2} fill={focused && IconCmp === Heart ? palette.iris200 : "transparent"} />
    </View>
  );
}
