import { router, Stack } from "expo-router";
import { Compass } from "lucide-react-native";
import { Button, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <EmptyState icon={Compass} title="Page not found" body="That page doesn't exist in the app." action={<Button label="Go home" onPress={() => router.replace("/")} />} />
    </>
  );
}
