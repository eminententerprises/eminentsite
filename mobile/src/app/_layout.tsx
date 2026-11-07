import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { BigShoulders_800ExtraBold, BigShoulders_900Black } from "@expo-google-fonts/big-shoulders";
import { PublicSans_400Regular, PublicSans_500Medium, PublicSans_600SemiBold, PublicSans_700Bold } from "@expo-google-fonts/public-sans";
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { Fraunces_500Medium_Italic } from "@expo-google-fonts/fraunces";
import { PropertiesProvider } from "@/state/properties";
import { SavedProvider } from "@/state/saved";
import { FiltersProvider } from "@/state/filters";
import { colors, fonts, palette } from "@/theme";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BigShoulders_800ExtraBold,
    BigShoulders_900Black,
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
    Fraunces_500Medium_Italic,
  });

  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PropertiesProvider>
          <SavedProvider>
            <FiltersProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerTintColor: palette.navy800,
                  headerTitleStyle: { fontFamily: fonts.display, fontSize: 21, color: palette.navy800 },
                  headerStyle: { backgroundColor: colors.surfaceBase },
                  headerShadowVisible: false,
                  headerBackButtonDisplayMode: "minimal",
                  contentStyle: { backgroundColor: colors.surfaceBase },
                  animation: "slide_from_right",
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="property/[slug]" options={{ headerShown: false }} />
                <Stack.Screen name="filters" options={{ presentation: "modal", title: "Filters", animation: "slide_from_bottom" }} />
                <Stack.Screen name="enquire" options={{ presentation: "modal", title: "Send Enquiry", animation: "slide_from_bottom" }} />
                <Stack.Screen name="compare" options={{ title: "Compare" }} />
                <Stack.Screen name="projects/index" options={{ title: "" }} />
                <Stack.Screen name="projects/[slug]" options={{ title: "" }} />
                <Stack.Screen name="construction/index" options={{ title: "Construction" }} />
                <Stack.Screen name="construction/portfolio" options={{ title: "" }} />
                <Stack.Screen name="construction/[slug]" options={{ title: "" }} />
                <Stack.Screen name="construction/service/[slug]" options={{ title: "" }} />
                <Stack.Screen name="services/index" options={{ title: "" }} />
                <Stack.Screen name="services/[slug]" options={{ title: "" }} />
                <Stack.Screen name="areas/index" options={{ title: "" }} />
                <Stack.Screen name="areas/[slug]" options={{ title: "" }} />
                <Stack.Screen name="insights/index" options={{ title: "" }} />
                <Stack.Screen name="insights/[slug]" options={{ title: "" }} />
                <Stack.Screen name="tools/estimate" options={{ title: "" }} />
                <Stack.Screen name="tools/mortgage" options={{ title: "" }} />
                <Stack.Screen name="tools/area-converter" options={{ title: "" }} />
                <Stack.Screen name="tools/construction-cost" options={{ title: "" }} />
                <Stack.Screen name="tools/materials" options={{ title: "" }} />
                <Stack.Screen name="contact" options={{ title: "" }} />
                <Stack.Screen name="about" options={{ title: "" }} />
                <Stack.Screen name="overseas" options={{ title: "" }} />
                <Stack.Screen name="list-property" options={{ title: "" }} />
              </Stack>
            </FiltersProvider>
          </SavedProvider>
        </PropertiesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
