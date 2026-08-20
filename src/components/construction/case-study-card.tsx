import Link from "next/link";
import { MapPin, Calendar, Ruler } from "lucide-react";
import type { ConstructionProject } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PropertyImage } from "@/components/media/property-image";

export function CaseStudyCard({ project }: { project: ConstructionProject }) {
  const cover = project.afterImages[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-[var(--card-bg)] shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--shadow-raised)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-100">
        <Link href={`/construction/portfolio/${project.slug}`} className="absolute inset-0 z-0" tabIndex={-1} aria-hidden="true" />
        {cover && (
          <PropertyImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          <Badge variant="accent">{project.qualityTier}</Badge>
          {project.isFeatured && <Badge variant="outline">Featured</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Link
          href={`/construction/portfolio/${project.slug}`}
          className="line-clamp-2 text-body-md font-semibold text-ink-primary hover:text-navy-800"
        >
          {project.title}
        </Link>

        <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
          {project.location}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border-hairline pt-3 text-body-sm text-ink-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {project.year}
          </span>
          <span className="flex items-center gap-1 font-tabular-nums">
            <Ruler className="h-4 w-4 text-ink-muted" aria-hidden="true" /> {project.coveredAreaSqft.toLocaleString("en-PK")} sq ft
          </span>
        </div>
      </div>
    </article>
  );
}
