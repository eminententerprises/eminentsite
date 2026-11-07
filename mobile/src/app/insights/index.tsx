import { useState } from "react";
import { ScrollView, View } from "react-native";
import type { ArticleCategory } from "@/types";
import { getAllArticles } from "@/lib/repositories/article-repository";
import { Chip } from "@/components/ui";
import { PageIntro, Screen } from "@/components/layout";
import { ArticleCard } from "@/components/cards";
import { GUTTER, space } from "@/theme";

const CATEGORIES: ArticleCategory[] = ["Market Insights", "Buying Guide", "Investment", "Construction", "Overseas"];

export default function InsightsScreen() {
  const [category, setCategory] = useState<ArticleCategory | null>(null);
  const articles = getAllArticles().filter((a) => !category || a.category === category);

  return (
    <Screen padded={false}>
      <PageIntro kicker="Insights" title="Latest From Our Desk" body="Market notes, buying guides and construction know-how from the Eminent team." style={{ paddingHorizontal: GUTTER, paddingTop: space.xl }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.sm, paddingVertical: space.lg }}>
        <Chip label="All" selected={category === null} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: GUTTER, gap: space.lg }}>
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </View>
    </Screen>
  );
}
