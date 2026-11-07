import { AreaConverter } from "@/components/area-converter";
import { Card } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { space } from "@/theme";

export default function AreaConverterScreen() {
  return (
    <Screen>
      <PageIntro kicker="Tools" title="Area Converter" body="Convert between Marla, Kanal, square feet and square yards." />
      <Card style={{ marginTop: space.xl }}>
        <AreaConverter />
      </Card>
    </Screen>
  );
}
