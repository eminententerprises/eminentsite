import type { ReactNode } from "react";
import { PropertyImage } from "@/components/media/property-image";
import { SectionReveal } from "@/components/home/section-reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  image: { src: string; alt: string };
  kicker?: string;
  heading: ReactNode;
  subheading?: ReactNode;
  cta?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
  imageClassName?: string;
  /** "lg" for landing/detail pages, "md" for lighter secondary heroes. */
  height?: "md" | "lg";
}

/**
 * Full-bleed, bottom-anchored hero used across every "Group 3" detail page
 * (construction landing, area guides, property/project/insight detail,
 * portfolio case studies). Standardizes the cinematic treatment — slow
 * ken-burns zoom, gradient scrim, fade-up copy — instead of hand-building it
 * per page.
 */
export function PageHero({ image, kicker, heading, subheading, cta, breadcrumb, className, imageClassName, height = "lg" }: PageHeroProps) {
  return (
    <div>
      {breadcrumb && <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">{breadcrumb}</div>}

      <section
        className={cn(
          "relative mt-6 overflow-hidden bg-surface-inverted-deep",
          height === "lg" ? "min-h-[420px] sm:min-h-[480px]" : "min-h-[280px] sm:min-h-[340px]",
          className,
        )}
      >
        <div className="absolute inset-0">
          <PropertyImage
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className={cn("animate-ken-burns object-cover", imageClassName)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/55 to-navy-900/15" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
          <SectionReveal>
            <div className="max-w-2xl">
              {kicker && <p className="text-label font-semibold uppercase tracking-widest text-accent">{kicker}</p>}
              <h1 className="mt-3 text-display-lg text-paper sm:text-display-xl">{heading}</h1>
              {subheading && <p className="mt-4 max-w-lg text-body-lg text-ink-inverted-muted">{subheading}</p>}
              {cta && <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{cta}</div>}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
