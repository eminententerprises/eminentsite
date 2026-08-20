import type { MetadataRoute } from "next";
import { CONTACT, EMINENT, BURAQ } from "@/config/site";
import { getAllProperties } from "@/lib/repositories/property-repository";
import { getAllProjects } from "@/lib/repositories/project-repository";
import { getAllConstructionProjects } from "@/lib/repositories/construction-repository";
import { getAllAreaGuides } from "@/lib/repositories/area-repository";
import { getAllArticles } from "@/lib/repositories/article-repository";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/properties", priority: 0.9, changeFrequency: "daily" },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/construction", priority: 0.8, changeFrequency: "weekly" },
  { path: "/construction/portfolio", priority: 0.7, changeFrequency: "weekly" },
  { path: "/construction/estimate", priority: 0.6, changeFrequency: "monthly" },
  { path: "/tools/eminent-estimate", priority: 0.6, changeFrequency: "monthly" },
  { path: "/tools/mortgage-calculator", priority: 0.6, changeFrequency: "monthly" },
  { path: "/tools/area-converter", priority: 0.5, changeFrequency: "monthly" },
  { path: "/tools/material-calculator", priority: 0.6, changeFrequency: "monthly" },
  { path: "/areas", priority: 0.7, changeFrequency: "weekly" },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/overseas", priority: 0.6, changeFrequency: "monthly" },
  { path: "/list-your-property", priority: 0.6, changeFrequency: "monthly" },
  { path: "/shortlist", priority: 0.2, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.2, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = CONTACT.websiteHref;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const properties = await getAllProperties();
  const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: new Date(p.addedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(p.addedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const constructionPortfolioEntries: MetadataRoute.Sitemap = getAllConstructionProjects().map((p) => ({
    url: `${base}/construction/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const areaGuideEntries: MetadataRoute.Sitemap = getAllAreaGuides().map((g) => ({
    url: `${base}/areas/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${base}/insights/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const serviceEntries: MetadataRoute.Sitemap = EMINENT.services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const constructionServiceEntries: MetadataRoute.Sitemap = BURAQ.services.map((s) => ({
    url: `${base}/construction/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...propertyEntries,
    ...projectEntries,
    ...constructionPortfolioEntries,
    ...areaGuideEntries,
    ...articleEntries,
    ...serviceEntries,
    ...constructionServiceEntries,
  ];
}
