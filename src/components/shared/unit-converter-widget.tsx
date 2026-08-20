"use client";

import { useMemo, useState } from "react";
import { AREA_UNIT_LABEL, fromSqFt, toSqFt, type AreaUnit } from "@/lib/area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const UNITS: AreaUnit[] = ["marla", "kanal", "sqft", "sqyd"];

/** Live area unit converter — used on listing detail and the standalone /tools/area-converter page. */
export function UnitConverterWidget({ initialSqft = 225 }: { initialSqft?: number }) {
  const [unit, setUnit] = useState<AreaUnit>("marla");
  const [value, setValue] = useState(fromSqFt(initialSqft, "marla").toString());
  const [marlaStandard, setMarlaStandard] = useState<"standard" | "old">("standard");

  const sqft = useMemo(() => {
    const n = Number(value);
    return Number.isFinite(n) ? toSqFt(n, unit, marlaStandard) : 0;
  }, [value, unit, marlaStandard]);

  return (
    <div className="rounded-2xl border border-border-hairline p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="converter-value">Area</Label>
          <Input id="converter-value" type="number" min={0} value={value} onChange={(e) => setValue(e.target.value)} className="mt-1.5 font-tabular-nums" />
        </div>
        <div className="w-full sm:w-40">
          <Label htmlFor="converter-unit">Unit</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as AreaUnit)}>
            <SelectTrigger id="converter-unit" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {AREA_UNIT_LABEL[u]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-hairline pt-4 sm:grid-cols-4">
        {UNITS.map((u) => (
          <div key={u} className="text-center">
            <p className="font-tabular-nums text-lg font-semibold text-navy-800">{fromSqFt(sqft, u, marlaStandard).toFixed(2)}</p>
            <p className="text-label uppercase tracking-widest text-ink-muted">{AREA_UNIT_LABEL[u]}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border-hairline pt-3 text-body-sm text-ink-secondary">
        <span>Marla standard:</span>
        <label className="flex items-center gap-1.5">
          <input type="radio" name="marla-standard" checked={marlaStandard === "standard"} onChange={() => setMarlaStandard("standard")} />
          225 sq ft (standard)
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" name="marla-standard" checked={marlaStandard === "old"} onChange={() => setMarlaStandard("old")} />
          272.25 sq ft (old)
        </label>
      </div>
    </div>
  );
}
