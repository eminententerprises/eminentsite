"use client";

import { useId, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { estimateConstructionCost } from "@/lib/construction-estimate";
import { formatPKR } from "@/lib/format-pkr";
import type { ConstructionEstimateInput } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EnquiryForm } from "@/components/forms/enquiry-form";

const QUALITY_TIERS: ConstructionEstimateInput["qualityTier"][] = ["Standard", "Premium", "Luxury"];
const SCOPES: ConstructionEstimateInput["scope"][] = ["Grey Structure", "Turnkey"];

export function CostEstimator() {
  const [coveredAreaSqft, setCoveredAreaSqft] = useState(2000);
  const [storeys, setStoreys] = useState(2);
  const [qualityTier, setQualityTier] = useState<ConstructionEstimateInput["qualityTier"]>("Standard");
  const [scope, setScope] = useState<ConstructionEstimateInput["scope"]>("Turnkey");

  const scopeId = useId();

  const validArea = coveredAreaSqft > 0;

  const result = useMemo(() => {
    if (!validArea) return null;
    return estimateConstructionCost({ coveredAreaSqft, storeys, qualityTier, scope });
  }, [coveredAreaSqft, storeys, qualityTier, scope, validArea]);

  const maxLineAmount = result ? Math.max(...result.lines.map((l) => l.amount)) : 0;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
      {/* -------------------------------------------------------------- INPUTS */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border-hairline bg-surface-warm p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="covered-area">Covered Area (sq ft)</Label>
          <Input
            id="covered-area"
            type="number"
            inputMode="numeric"
            min={100}
            step={50}
            value={coveredAreaSqft}
            onChange={(e) => setCoveredAreaSqft(Math.max(0, Number(e.target.value)))}
          />
          <p className="text-body-sm text-ink-muted">
            Roughly 272 sq ft per marla — a 10 marla plot with a full covered footprint is about 2,720 sq ft.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="storeys">Storeys</Label>
          <Input
            id="storeys"
            type="number"
            inputMode="numeric"
            min={1}
            max={10}
            step={1}
            value={storeys}
            onChange={(e) => setStoreys(Math.max(1, Number(e.target.value)))}
          />
          <p className="text-body-sm text-ink-muted">
            Informational only — your covered area figure above should already total every floor combined.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quality-tier">Quality Tier</Label>
          <Select value={qualityTier} onValueChange={(value) => setQualityTier(value as ConstructionEstimateInput["qualityTier"])}>
            <SelectTrigger id="quality-tier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUALITY_TIERS.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label id={scopeId}>Scope</Label>
          <RadioGroup
            aria-labelledby={scopeId}
            value={scope}
            onValueChange={(value) => setScope(value as ConstructionEstimateInput["scope"])}
            className="grid-cols-2"
          >
            {SCOPES.map((s) => (
              <label
                key={s}
                htmlFor={`scope-${s}`}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-3 py-2 text-body-sm text-ink-primary has-[[data-state=checked]]:border-navy-800 has-[[data-state=checked]]:bg-surface-raised"
              >
                <RadioGroupItem id={`scope-${s}`} value={s} />
                {s}
              </label>
            ))}
          </RadioGroup>
          <p className="text-body-sm text-ink-muted">
            Grey structure covers foundation, frame, roofing and brickwork only. Turnkey adds complete finishing,
            fixtures and fittings.
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------------- RESULTS */}
      <div aria-live="polite" className="flex flex-col gap-6">
        <div className="flex items-start gap-3 rounded-xl border border-warning bg-surface-sunken p-4 text-body-sm text-ink-secondary">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <p>
            These figures are <strong>indicative estimates</strong> built from placeholder market rates, not a
            formal quotation. Always verify final costs with a Buraq project consultant before budgeting.
          </p>
        </div>

        {result ? (
          <>
            <div className="rounded-2xl border border-border-hairline bg-surface-raised p-6">
              <p className="text-body-sm uppercase tracking-wide text-ink-secondary">Estimated Total ({scope})</p>
              <p className="mt-1 font-tabular-nums text-display-sm text-navy-800">{formatPKR(result.total).short}</p>
              <p className="mt-1 font-tabular-nums text-body-sm text-ink-muted">
                {formatPKR(result.total).full} · {formatPKR(result.ratePerSqft).short} per sq ft
              </p>
            </div>

            <div>
              <h2 className="text-heading-md uppercase text-ink-primary">Cost Breakdown</h2>
              <div className="mt-4 flex flex-col gap-3">
                {result.lines.map((line) => {
                  const widthPercent = maxLineAmount > 0 ? Math.max(4, (line.amount / maxLineAmount) * 100) : 0;
                  return (
                    <div key={line.label} className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-body-sm text-ink-primary">{line.label}</span>
                        <span className="font-tabular-nums text-body-sm font-semibold text-ink-primary">
                          {formatPKR(line.amount).short}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-surface-sunken">
                        <div className="h-full bg-accent-strong" style={{ width: `${widthPercent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto border border-border-hairline">
              <table className="w-full min-w-[420px] border-collapse text-body-sm">
                <thead>
                  <tr className="bg-surface-sunken">
                    <th scope="col" className="border-b border-border-hairline px-4 py-3 text-left font-semibold text-ink-primary">
                      Category
                    </th>
                    <th scope="col" className="border-b border-border-hairline px-4 py-3 text-right font-semibold text-ink-primary">
                      Estimated Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.lines.map((line) => (
                    <tr key={line.label}>
                      <th scope="row" className="border-b border-border-hairline px-4 py-3 text-left font-normal text-ink-secondary">
                        {line.label}
                      </th>
                      <td className="border-b border-border-hairline px-4 py-3 text-right font-tabular-nums text-ink-primary">
                        {formatPKR(line.amount).full}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-ink-primary">
                      Total
                    </th>
                    <td className="px-4 py-3 text-right font-tabular-nums font-semibold text-navy-800">
                      {formatPKR(result.total).full}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p role="alert" className="text-body-md text-danger">
            Enter a covered area greater than 0 to see an estimate.
          </p>
        )}

        <div className="rounded-2xl border border-border-hairline bg-surface-warm p-6">
          <h2 className="text-heading-md uppercase text-ink-primary">Want This In Writing?</h2>
          <p className="mt-2 text-body-sm text-ink-secondary">
            Send us these numbers and we&apos;ll follow up with a proper site-specific quotation.
          </p>
          <div className="mt-5">
            <EnquiryForm defaultReason="Construction" showReason submitLabel="Request A Detailed Quote" />
          </div>
        </div>
      </div>
    </div>
  );
}
