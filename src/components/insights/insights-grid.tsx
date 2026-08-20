"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article, ArticleCategory } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PropertyImage } from "@/components/media/property-image";
import { StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

const CATEGORIES: ArticleCategory[] = ["Market Insights", "Buying Guide", "Investment", "Construction", "Overseas"];

export function InsightsGrid({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState<ArticleCategory | "all">("all");
  const present = CATEGORIES.filter((c) => articles.some((a) => a.category === c));
  const filtered = category === "all" ? articles : articles.filter((a) => a.category === category);

  return (
    <div>
      <Tabs value={category} onValueChange={(v) => setCategory(v as ArticleCategory | "all")}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {present.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p aria-live="polite" className="mt-4 text-body-sm text-ink-muted">
        {filtered.length} article{filtered.length === 1 ? "" : "s"}
      </p>

      <StaggerGroup className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <StaggerItem key={article.slug}>
            <Link
              href={`/insights/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-surface-raised shadow-card transition-shadow hover:shadow-raised"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
                <PropertyImage
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <Badge variant="neutral" className="w-fit">
                  {article.category}
                </Badge>
                <p className="line-clamp-2 font-semibold text-ink-primary">{article.title}</p>
                <p className="line-clamp-2 text-body-sm text-ink-secondary">{article.excerpt}</p>
                <p className="mt-auto text-body-sm text-ink-muted">
                  {new Date(article.publishedAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })} · {article.readMinutes} min read
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
