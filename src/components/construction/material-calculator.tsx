"use client";

import { useId, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { estimateMaterials } from "@/lib/material-estimate";
import { formatPKR } from "@/lib/format-pkr";
import type { BoundaryWallThickness, MaterialEstimateInput, MaterialQuantityLine, MaterialScope, StructureType } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { EnquiryForm } from "@/components/forms/enquiry-form";

const STRUCTURE_TYPES: StructureType[] = ["Load Bearing", "RCC Framed"];
const SCOPES: MaterialScope[] = ["Grey Structure", "Turnkey"];
const QUALITY_TIERS: MaterialEstimateInput["qualityTier"][] = ["Standard", "Premium", "Luxury"];
const BOUNDARY_THICKNESSES: BoundaryWallThickness[] = [4.5, 9];

export function MaterialCalculator() {
  const [coveredAreaSqft, setCoveredAreaSqft] = useState(2000);
  const [storeys, setStoreys] = useState(2);
  const [structureType, setStructureType] = useState<StructureType>("RCC Framed");
  const [scope, setScope] = useState<MaterialScope>("Grey Structure");
  const [qualityTier, setQualityTier] = useState<MaterialEstimateInput["qualityTier"]>("Standard");
  const [includeBoundaryWall, setIncludeBoundaryWall] = useState(false);
  const [boundaryWallLengthFt, setBoundaryWallLengthFt] = useState(200);
  const [boundaryWallHeightFt, setBoundaryWallHeightFt] = useState(6);
  const [boundaryWallThicknessIn, setBoundaryWallThicknessIn] = useState<BoundaryWallThickness>(9);

  const structureId = useId();
  const scopeId = useId();

  const validArea = coveredAreaSqft > 0;

  const result = useMemo(() => {
    if (!validArea) return null;
    return estimateMaterials({
      coveredAreaSqft,
      storeys,
      structureType,
      scope,
      qualityTier,
      includeBoundaryWall,
      boundaryWallLengthFt,
      boundaryWallHeightFt,
      boundaryWallThicknessIn,
    });
  }, [
    coveredAreaSqft,
    storeys,
    structureType,
    scope,
    qualityTier,
    includeBoundaryWall,
    boundaryWallLengthFt,
    boundaryWallHeightFt,
    boundaryWallThicknessIn,
    validArea,
  ]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
      {/* -------------------------------------------------------------- INPUTS */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border-hairline bg-surface-warm p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="material-covered-area">Covered Area (sq ft)</Label>
          <Input
            id="material-covered-area"
            type="number"
            inputMode="numeric"
            min={100}
            step={50}
            value={coveredAreaSqft}
            onChange={(e) => setCoveredAreaSqft(Math.max(0, Number(e.target.value)))}
          />
          <p className="text-body-sm text-ink-muted">
            Total covered area across every floor — e.g. a 5 marla house with two similar floors is about 2,700 sq ft.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="material-storeys">Storeys</Label>
          <Input
            id="material-storeys"
            type="number"
            inputMode="numeric"
            min={1}
            max={10}
            step={1}
            value={storeys}
            onChange={(e) => setStoreys(Math.max(1, Number(e.target.value)))}
          />
          <p className="text-body-sm text-ink-muted">Informational only — your covered area above should already total every floor.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label id={structureId}>Structure Type</Label>
          <RadioGroup
            aria-labelledby={structureId}
            value={structureType}
            onValueChange={(value) => setStructureType(value as StructureType)}
            className="grid-cols-2"
          >
            {STRUCTURE_TYPES.map((s) => (
              <label
                key={s}
                htmlFor={`structure-${s}`}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-3 py-2 text-body-sm text-ink-primary has-[[data-state=checked]]:border-navy-800 has-[[data-state=checked]]:bg-surface-raised"
              >
                <RadioGroupItem id={`structure-${s}`} value={s} />
                {s}
              </label>
            ))}
          </RadioGroup>
          <p className="text-body-sm text-ink-muted">
            RCC Framed uses columns and beams with brick infill — more steel, fewer bricks. Load Bearing walls carry
            the structure directly — more bricks, less steel.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label id={scopeId}>Scope</Label>
          <RadioGroup
            aria-labelledby={scopeId}
            value={scope}
            onValueChange={(value) => setScope(value as MaterialScope)}
            className="grid-cols-2"
          >
            {SCOPES.map((s) => (
              <label
                key={s}
                htmlFor={`material-scope-${s}`}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-3 py-2 text-body-sm text-ink-primary has-[[data-state=checked]]:border-navy-800 has-[[data-state=checked]]:bg-surface-raised"
              >
                <RadioGroupItem id={`material-scope-${s}`} value={s} />
                {s}
              </label>
            ))}
          </RadioGroup>
          <p className="text-body-sm text-ink-muted">
            Turnkey adds plaster/flooring cement and sand, plus paint and floor tile quantities.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="material-quality-tier">Quality Tier</Label>
          <Select value={qualityTier} onValueChange={(value) => setQualityTier(value as MaterialEstimateInput["qualityTier"])}>
            <SelectTrigger id="material-quality-tier">
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
          <p className="text-body-sm text-ink-muted">Used for the cost estimate context below — structural quantities don&apos;t change by tier.</p>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-hairline pt-6">
          <label htmlFor="include-boundary-wall" className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              id="include-boundary-wall"
              checked={includeBoundaryWall}
              onCheckedChange={(checked) => setIncludeBoundaryWall(checked === true)}
            />
            <span className="text-body-sm font-semibold text-ink-primary">Include boundary / compound wall</span>
          </label>

          {includeBoundaryWall && (
            <div className="flex flex-col gap-4 rounded-lg bg-surface-sunken p-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="boundary-length">Perimeter Length (ft)</Label>
                <Input
                  id="boundary-length"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={5}
                  value={boundaryWallLengthFt}
                  onChange={(e) => setBoundaryWallLengthFt(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="boundary-height">Wall Height (ft)</Label>
                <Input
                  id="boundary-height"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={0.5}
                  value={boundaryWallHeightFt}
                  onChange={(e) => setBoundaryWallHeightFt(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="boundary-thickness">Wall Thickness</Label>
                <Select
                  value={String(boundaryWallThicknessIn)}
                  onValueChange={(value) => setBoundaryWallThicknessIn(Number(value) as BoundaryWallThickness)}
                >
                  <SelectTrigger id="boundary-thickness">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOUNDARY_THICKNESSES.map((t) => (
                      <SelectItem key={t} value={String(t)}>
                        {t}&Prime; ({t === 9 ? "full brick" : "half brick"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------- RESULTS */}
      <div aria-live="polite" className="flex flex-col gap-6">
        <div className="flex items-start gap-3 rounded-xl border border-warning bg-surface-sunken p-4 text-body-sm text-ink-secondary">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <p>
            These are <strong>planning-stage estimates</strong> from standard thumb-rule quantities and placeholder
            market rates — not a Bill of Quantities. Always verify final quantities and pricing with a Buraq project
            consultant before ordering materials.
          </p>
        </div>

        {result ? (
          <>
            <div className="rounded-2xl border border-border-hairline bg-surface-raised p-6">
              <p className="text-body-sm uppercase tracking-wide text-ink-secondary">Estimated Total Material Cost</p>
              <p className="mt-1 font-tabular-nums text-display-sm text-navy-800">{formatPKR(result.totalMaterialCost).short}</p>
              <p className="mt-1 font-tabular-nums text-body-sm text-ink-muted">
                {formatPKR(result.totalMaterialCost).full} · {qualityTier} tier · {scope}
              </p>
            </div>

            <MaterialSection title="Structure Materials" lines={result.structure} />
            {result.boundaryWall.length > 0 && (
              <MaterialSection title="Boundary Wall Materials" lines={result.boundaryWall} />
            )}
            {result.finishing.length > 0 && <MaterialSection title="Finishing Materials" lines={result.finishing} />}
          </>
        ) : (
          <p role="alert" className="text-body-md text-danger">
            Enter a covered area greater than 0 to see an estimate.
          </p>
        )}

        <div className="rounded-2xl border border-border-hairline bg-surface-warm p-6">
          <h2 className="text-heading-md uppercase text-ink-primary">Want An Exact Material List?</h2>
          <p className="mt-2 text-body-sm text-ink-secondary">
            Send us these numbers and a Buraq engineer will follow up with a site-specific Bill of Quantities.
          </p>
          <div className="mt-5">
            <EnquiryForm defaultReason="Construction" showReason submitLabel="Request A Detailed Material List" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialSection({ title, lines }: { title: string; lines: MaterialQuantityLine[] }) {
  return (
    <div className="overflow-x-auto border border-border-hairline">
      <table className="w-full min-w-[480px] border-collapse text-body-sm">
        <thead>
          <tr className="bg-surface-sunken">
            <th scope="col" className="border-b border-border-hairline px-4 py-3 text-left font-semibold text-ink-primary">
              {title}
            </th>
            <th scope="col" className="border-b border-border-hairline px-4 py-3 text-right font-semibold text-ink-primary">
              Quantity
            </th>
            <th scope="col" className="border-b border-border-hairline px-4 py-3 text-right font-semibold text-ink-primary">
              Estimated Cost
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.key}>
              <th scope="row" className="border-b border-border-hairline px-4 py-3 text-left font-normal text-ink-secondary">
                {l.label}
              </th>
              <td className="border-b border-border-hairline px-4 py-3 text-right font-tabular-nums text-ink-primary">
                {l.quantity.toLocaleString("en-PK")} {l.unit}
                {l.altQuantity && <span className="block text-body-sm text-ink-muted">({l.altQuantity})</span>}
              </td>
              <td className="border-b border-border-hairline px-4 py-3 text-right font-tabular-nums text-ink-primary">
                {formatPKR(l.estimatedCost).short}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
