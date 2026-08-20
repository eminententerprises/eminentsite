import { ClipboardList, PencilRuler, Stamp, HardHat, KeyRound } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Consultation",
    description: "We understand your site, budget and lifestyle needs before a single drawing is made.",
  },
  {
    icon: PencilRuler,
    title: "Design",
    description: "Architectural concepts, layouts and material selections are worked through with you and our panel.",
  },
  {
    icon: Stamp,
    title: "Approvals",
    description: "Drawings and documentation are finalised and taken through the relevant approval process.",
  },
  {
    icon: HardHat,
    title: "Construction",
    description: "Grey structure through to finishing, supervised on site against the approved plan and quality bar.",
  },
  {
    icon: KeyRound,
    title: "Handover",
    description: "A final walkthrough, snag-list closure and handover of a space that's ready to live or work in.",
  },
] as const;

/**
 * Static, illustrative process timeline for the Buraq landing page — not
 * tied to any single case study's mock timeline data (see
 * CaseStudyTimeline for the per-project variant on the portfolio detail page).
 */
export function ProcessTimeline() {
  return (
    <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-hairline bg-border-hairline sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((step) => (
        <li key={step.title} className="flex flex-col gap-3 bg-surface-raised p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-strong text-accent-strong">
            <step.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-heading-md uppercase text-ink-primary">{step.title}</h3>
          <p className="text-body-sm text-ink-secondary">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
