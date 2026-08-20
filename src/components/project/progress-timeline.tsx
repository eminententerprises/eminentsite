import { Check } from "lucide-react";
import type { ProgressMilestone } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Simple complete/future dot-and-line timeline. Deliberately plain — the
 * Survey Line device is reserved for section dividers elsewhere on this
 * page, not reused here.
 */
export function ProgressTimeline({ milestones }: { milestones: ProgressMilestone[] }) {
  return (
    <ol className="flex flex-col">
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1;
        const date = new Date(m.date);

        return (
          <li key={m.label} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.75rem)] w-px",
                  m.complete ? "bg-accent-strong" : "bg-border-hairline",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                m.complete
                  ? "border-accent-strong bg-accent-strong text-ink-on-accent"
                  : "border-border-strong bg-surface-base text-ink-muted",
              )}
            >
              {m.complete ? <Check className="h-4 w-4" aria-hidden="true" /> : <span className="h-2 w-2 bg-current" aria-hidden="true" />}
            </span>
            <div className="pt-1">
              <p className={cn("text-body-md font-semibold", m.complete ? "text-ink-primary" : "text-ink-secondary")}>
                {m.label}
              </p>
              <p className="mt-0.5 font-tabular-nums text-body-sm text-ink-muted">
                {date.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                {!m.complete && " · Planned"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
