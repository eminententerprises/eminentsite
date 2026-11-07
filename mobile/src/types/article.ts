export type ArticleCategory = "Market Insights" | "Buying Guide" | "Investment" | "Construction" | "Overseas";

export interface Article {
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  body: string[]; // paragraphs
  coverImage: string;
  publishedAt: string;
  readMinutes: number;
  author: string;
}
