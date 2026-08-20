import { Check, Circle } from "lucide-react";
import type { ConstructionProject } from "@/types";

/**
 * Per-project build timeline for a case study's own recorded phases
 * (`ConstructionProject.timeline`) — distinct from the landing page's
 * static, illustrative ProcessTimeline.
 */
export function CaseStudyTimeline({ timeline }: { timeline: ConstructionProject["timeline"] }) {
  return (
    <ol className="flex flex-col">
      {timeline.map((step, i) => (
        <li key={step.phase} className="relative flex gap-4 pb-8 last:pb-0">
          {i < timeline.length - 1 && (
            <span
              className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px ${step.complete ? "bg-accent-strong" : "bg-border-hairline"}`}
              aria-hidden="true"
            />
          )}
          <span
            className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
              step.complete
                ? "border-accent-strong bg-accent-strong text-ink-on-accent"
                : "border-border-strong bg-surface-base text-ink-muted"
            }`}
          >
            {step.complete ? <Check className="h-4 w-4" aria-hidden="true" /> : <Circle className="h-3 w-3 fill-current" aria-hidden="true" />}
          </span>
          <div className="pt-1">
            <p className={`text-body-md font-semibold ${step.complete ? "text-ink-primary" : "text-ink-muted"}`}>{step.phase}</p>
            <p className="text-body-sm text-ink-muted">{step.complete ? "Complete" : "Upcoming"}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
