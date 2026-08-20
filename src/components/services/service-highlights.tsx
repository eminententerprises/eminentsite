import type { ServiceHighlight } from "@/data/service-details";
import { StaggerGroup, StaggerItem } from "@/components/home/section-reveal";

export function ServiceHighlights({ highlights }: { highlights: ServiceHighlight[] }) {
  return (
    <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {highlights.map((h) => (
        <StaggerItem
          key={h.title}
          className="flex flex-col gap-3 rounded-2xl border border-border-hairline bg-surface-raised p-6 shadow-card"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
            <h.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-heading-md uppercase text-ink-primary">{h.title}</h3>
          <p className="text-body-sm text-ink-secondary">{h.description}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
