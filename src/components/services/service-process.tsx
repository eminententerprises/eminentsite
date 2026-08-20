import type { ServiceProcessStep } from "@/data/service-details";

export function ServiceProcess({ steps }: { steps: ServiceProcessStep[] }) {
  return (
    <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-hairline bg-border-hairline sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col gap-3 bg-surface-raised p-6">
          <span className="font-tabular-nums text-display-sm text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="text-heading-md uppercase text-ink-primary">{step.title}</h3>
          <p className="text-body-sm text-ink-secondary">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
