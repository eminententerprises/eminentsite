import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, User } from "lucide-react";
import { getAllArticles, getArticleBySlug, getArticlesByCategory } from "@/lib/repositories/article-repository";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { PropertyImage } from "@/components/media/property-image";
import { SurveyLine } from "@/components/brand/survey-line";
import { SectionReveal, StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [{ url: article.coverImage }] },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const publishedLabel = new Date(article.publishedAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: article.title }]} />

      <SectionReveal>
        <div className="mx-auto mt-6 max-w-[760px]">
          <Badge variant="accent" className="w-fit">
            {article.category}
          </Badge>
          <h1 className="mt-3 text-display-lg">{article.title}</h1>
          <p className="mt-3 text-body-lg text-ink-secondary">{article.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border-hairline py-4 text-body-sm text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {publishedLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {article.readMinutes} min read
            </span>
          </div>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-navy-100">
            <PropertyImage src={article.coverImage} alt={article.title} fill sizes="(min-width: 768px) 760px, 100vw" priority className="animate-ken-burns object-cover" />
          </div>

          <div className="mt-8 flex flex-col gap-5">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-body-lg leading-relaxed text-ink-primary">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </SectionReveal>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-[1000px]">
          <SurveyLine className="mb-8" />
          <h2 className="text-display-sm">Related in {article.category}</h2>
          <StaggerGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((a) => (
              <StaggerItem key={a.slug}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-surface-raised shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-raised"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
                    <PropertyImage src={a.coverImage} alt={a.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-2/3 bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 p-4">
                    <p className="line-clamp-2 font-semibold text-ink-primary">{a.title}</p>
                    <p className="text-body-sm text-ink-muted">{a.readMinutes} min read</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}
    </div>
  );
}
