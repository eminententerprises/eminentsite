import { View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SearchX, Share2 } from "lucide-react-native";
import { getAllArticles, getArticleBySlug } from "@/lib/repositories/article-repository";
import { shareLink } from "@/lib/links";
import { Badge, Button, EmptyState, SectionHeader, SurveyLine, Text } from "@/components/ui";
import { RemoteImage, Screen } from "@/components/layout";
import { ArticleCard } from "@/components/cards";
import { colors, GUTTER, palette, space } from "@/theme";

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const article = getArticleBySlug(String(slug));

  if (!article) {
    return <EmptyState icon={SearchX} title="Article not found" action={<Button label="All insights" onPress={() => router.replace("/insights")} />} />;
  }

  const more = getAllArticles().filter((a) => a.slug !== article.slug).slice(0, 2);
  const date = new Date(article.publishedAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ title: article.category }} />
      <RemoteImage src={article.coverImage} style={{ aspectRatio: 16 / 10 }} accessibilityLabel={article.title} />
      <View style={{ paddingHorizontal: GUTTER, paddingTop: space.xl, gap: space.md }}>
        <Badge label={article.category} variant="warm" />
        <Text variant="displaySm" color={palette.navy800}>
          {article.title}
        </Text>
        <Text variant="bodySm" color={colors.inkMuted}>
          {article.author} · {date} · {article.readMinutes} min read
        </Text>
        <SurveyLine />
        <Text variant="bodyLg" color={colors.inkPrimary} style={{ fontStyle: "italic" }}>
          {article.excerpt}
        </Text>
        {article.body.map((para, i) => (
          <Text key={i} variant="bodyLg" color={colors.inkSecondary}>
            {para}
          </Text>
        ))}
        <Button label="Share article" icon={Share2} variant="outline" onPress={() => shareLink(article.title, `/insights/${article.slug}`)} style={{ marginTop: space.md }} />

        {more.length ? (
          <View style={{ gap: space.md, marginTop: space.xxl }}>
            <SectionHeader title="Keep Reading" />
            {more.map((a) => (
              <ArticleCard key={a.slug} article={a} horizontal />
            ))}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
