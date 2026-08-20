import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import type { Project, PossessionStatus } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { PropertyImage } from "@/components/media/property-image";
import { formatPKR } from "@/lib/format-pkr";
import { cn } from "@/lib/utils";

export const POSSESSION_BADGE_VARIANT: Record<PossessionStatus, NonNullable<BadgeProps["variant"]>> = {
  Ready: "verified",
  "Under Development": "outline",
  Balloted: "neutral",
};

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const cover = project.images[0];
  const startingPrice = Math.min(...project.unitTypes.map((u) => u.startingPrice));

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border-hairline bg-[var(--card-bg)] shadow-[var(--card-shadow)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-100">
        <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-0" tabIndex={-1} aria-hidden="true" />
        {cover && (
          <PropertyImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-2/3 bg-gradient-to-t from-navy-900/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {project.isFeatured && <Badge variant="accent">Featured</Badge>}
          <Badge variant={POSSESSION_BADGE_VARIANT[project.possession]}>{project.possession}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="font-tabular-nums text-body-md font-semibold text-navy-800">
          Starting {formatPKR(startingPrice).short}
        </p>

        <Link href={`/projects/${project.slug}`} className="text-body-md font-semibold text-ink-primary hover:text-navy-800">
          {project.name}
        </Link>

        <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
          {project.developer}
        </p>

        <p className="line-clamp-2 text-body-sm text-ink-secondary">{project.tagline}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border-hairline pt-3">
          <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
            {project.location.area}, {project.location.cityLabel}
          </p>
          <Badge variant="outline">{project.approval}</Badge>
        </div>
      </div>
    </article>
  );
}
