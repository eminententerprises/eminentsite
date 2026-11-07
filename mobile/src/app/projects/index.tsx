import { View } from "react-native";
import { getAllProjects } from "@/lib/repositories/project-repository";
import { PageIntro, Screen } from "@/components/layout";
import { ProjectCard } from "@/components/cards";
import { space } from "@/theme";

export default function ProjectsScreen() {
  const projects = getAllProjects();
  return (
    <Screen>
      <PageIntro kicker="New Projects" title="Off-Plan & Under Development" body="Developer projects across Islamabad, Rawalpindi and the hill regions, with payment plans and construction progress." />
      <View style={{ gap: space.lg, marginTop: space.xl }}>
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </View>
    </Screen>
  );
}
