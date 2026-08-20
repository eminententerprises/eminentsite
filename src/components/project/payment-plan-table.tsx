"use client";

import { useState } from "react";
import type { PaymentMilestone, UnitType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPKR } from "@/lib/format-pkr";

export function PaymentPlanTable({
  paymentPlan,
  unitTypes,
}: {
  paymentPlan: PaymentMilestone[];
  unitTypes: UnitType[];
}) {
  const [unitName, setUnitName] = useState<string | undefined>(unitTypes[0]?.name);
  const selectedUnit = unitTypes.find((u) => u.name === unitName) ?? unitTypes[0];
  const totalPercentage = paymentPlan.reduce((sum, m) => sum + m.percentage, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-display-sm">Payment Plan</h2>
          <p className="mt-1 text-body-sm text-ink-secondary">
            Percentage-based schedule across {paymentPlan.length} milestones.
          </p>
        </div>

        {unitTypes.length > 0 && (
          <div className="w-full sm:w-64">
            <label htmlFor="payment-plan-unit" className="mb-1.5 block text-label uppercase tracking-widest text-ink-muted">
              Calculate for unit type
            </label>
            <Select value={selectedUnit?.name} onValueChange={setUnitName}>
              <SelectTrigger id="payment-plan-unit">
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((u) => (
                  <SelectItem key={u.name} value={u.name}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-hairline">
              <th scope="col" className="py-2.5 pr-4 text-label uppercase tracking-widest text-ink-muted">
                Milestone
              </th>
              <th scope="col" className="py-2.5 pr-4 text-label uppercase tracking-widest text-ink-muted">
                Share
              </th>
              <th scope="col" className="py-2.5 text-label uppercase tracking-widest text-ink-muted">
                {selectedUnit ? `Amount — ${selectedUnit.name}` : "Amount"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-hairline">
            {paymentPlan.map((m) => (
              <tr key={m.label}>
                <td className="py-3 pr-4 align-top text-body-sm text-ink-primary">
                  {m.label}
                  {m.amountNote && <span className="mt-0.5 block text-body-sm text-ink-muted">{m.amountNote}</span>}
                </td>
                <td className="py-3 pr-4 align-top font-tabular-nums text-body-sm font-semibold text-ink-primary">
                  {m.percentage}%
                </td>
                <td className="py-3 align-top font-tabular-nums text-body-sm font-semibold text-navy-800">
                  {selectedUnit ? formatPKR((selectedUnit.startingPrice * m.percentage) / 100).short : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border-hairline">
              <td className="py-2.5 pr-4 text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">Total</td>
              <td className="py-2.5 pr-4 font-tabular-nums text-body-sm font-semibold text-ink-primary">{totalPercentage}%</td>
              <td className="py-2.5 font-tabular-nums text-body-sm font-semibold text-navy-800">
                {selectedUnit ? formatPKR(selectedUnit.startingPrice).short : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
