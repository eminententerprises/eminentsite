import { useState } from "react";
import { ScrollView, View } from "react-native";
import { BURAQ } from "@/config/site";
import { getAllConstructionProjects } from "@/lib/repositories/construction-repository";
import { Chip } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { CaseStudyCard } from "@/components/cards";
import { GUTTER, space } from "@/theme";

export default function PortfolioScreen() {
  const [service, setService] = useState<string | null>(null);
  const all = getAllConstructionProjects();
  const projects = service ? all.filter((p) => p.serviceType === service) : all;

  return (
    <Screen padded={false}>
      <PageIntro kicker={BURAQ.name} title="Our Portfolio" body={BURAQ.signatureLines[3]} style={{ paddingHorizontal: GUTTER, paddingTop: space.xl }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.sm, paddingVertical: space.lg }}>
        <Chip label="All" selected={service === null} onPress={() => setService(null)} />
        {BURAQ.services.map((s) => (
          <Chip key={s.slug} label={s.name} selected={service === s.slug} onPress={() => setService(s.slug)} />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: GUTTER, gap: space.lg }}>
        {projects.map((p) => (
          <CaseStudyCard key={p.id} project={p} />
        ))}
      </View>
    </Screen>
  );
}
