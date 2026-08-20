"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BANK_MARKUP_PRESETS } from "@/data/bank-presets";
import { calculateMortgage } from "@/lib/mortgage";
import { formatPKR } from "@/lib/format-pkr";
import type { AmortisationRow, MortgageInput } from "@/types";

const TENURE_PRESETS = [5, 10, 15, 20, 25];

interface YearlyRow {
  year: number;
  principal: number;
  markup: number;
  endingBalance: number;
}

function summarizeByYear(schedule: AmortisationRow[]): YearlyRow[] {
  const years: YearlyRow[] = [];
  for (let i = 0; i < schedule.length; i += 12) {
    const chunk = schedule.slice(i, i + 12);
    const principal = chunk.reduce((sum, row) => sum + row.principal, 0);
    const markup = chunk.reduce((sum, row) => sum + row.markup, 0);
    years.push({ year: years.length + 1, principal, markup, endingBalance: chunk[chunk.length - 1].balance });
  }
  return years;
}

export function MortgageCalculatorForm() {
  const [propertyPrice, setPropertyPrice] = useState("15000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState("15");
  const [markupRatePercent, setMarkupRatePercent] = useState(String(BANK_MARKUP_PRESETS[0].markupRatePercent));

  // Derived purely from current field state, recomputed on every render —
  // no effect + setState sync needed for a value this cheap to calculate.
  const price = Math.max(Number(propertyPrice) || 0, 0);
  const clampedDownPayment = Math.min(Math.max(downPaymentPercent, 0), 90);
  const clampedTenure = Math.min(Math.max(Number(tenureYears) || 0, 1), 30);
  const rate = Math.max(Number(markupRatePercent) || 0, 0);

  const input: MortgageInput = {
    propertyPrice: price,
    downPaymentPercent: clampedDownPayment,
    tenureYears: clampedTenure,
    markupRatePercent: rate,
  };
  const result = calculateMortgage(input);
  const yearlyRows = summarizeByYear(result.schedule);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="property-price">Property price (PKR)</Label>
          <Input
            id="property-price"
            type="number"
            min={0}
            step={100000}
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(e.target.value)}
            className="mt-1.5 font-tabular-nums"
          />
        </div>

        <div>
          <Label htmlFor="tenure-years">Tenure (years)</Label>
          <div className="mt-1.5 flex gap-2">
            <Select onValueChange={(v) => setTenureYears(v)}>
              <SelectTrigger className="w-28" aria-label="Tenure preset">
                <SelectValue placeholder="Preset" />
              </SelectTrigger>
              <SelectContent>
                {TENURE_PRESETS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y} yrs
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="tenure-years"
              type="number"
              min={1}
              max={25}
              value={tenureYears}
              onChange={(e) => setTenureYears(e.target.value)}
              className="font-tabular-nums"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="down-payment">Down payment</Label>
            <span className="font-tabular-nums text-body-sm font-semibold text-ink-primary">{clampedDownPayment}%</span>
          </div>
          <Input
            id="down-payment"
            type="number"
            min={0}
            max={90}
            step={1}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value) || 0)}
            className="mt-1.5 max-w-[10rem] font-tabular-nums"
          />
          <div className="mt-2 h-1.5 w-full bg-border-hairline" aria-hidden="true">
            <div className="h-full bg-accent-strong transition-[width]" style={{ width: `${(clampedDownPayment / 90) * 100}%` }} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="markup-rate">Markup rate (% per annum)</Label>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
            <Select onValueChange={(v) => setMarkupRatePercent(v)}>
              <SelectTrigger className="sm:w-72" aria-label="Bank markup rate preset">
                <SelectValue placeholder="Choose an indicative bank preset" />
              </SelectTrigger>
              <SelectContent>
                {BANK_MARKUP_PRESETS.map((preset) => (
                  <SelectItem key={preset.bankLabel} value={String(preset.markupRatePercent)}>
                    {preset.bankLabel} — {preset.markupRatePercent}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="markup-rate"
              type="number"
              min={0}
              step={0.1}
              value={markupRatePercent}
              onChange={(e) => setMarkupRatePercent(e.target.value)}
              className="w-full font-tabular-nums sm:w-32"
            />
          </div>
          <p className="mt-1.5 text-body-sm text-ink-muted">
            Bank presets are indicative placeholders, not real institution names or offers. Enter your bank&apos;s
            actual quoted rate for a more accurate estimate.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border-strong bg-surface-sunken p-4">
        <p className="text-body-sm font-semibold uppercase tracking-wide text-ink-primary">
          Indicative figures — not a loan offer
        </p>
        <p className="mt-1.5 text-body-sm text-ink-secondary">
          This calculator uses a standard reducing-balance amortisation formula against the markup rate you enter
          or select. It doesn&apos;t account for processing fees, insurance, or eligibility checks. Actual bank
          offers depend on your eligibility and the lender&apos;s current published rates — verify with your bank
          or Islamic finance provider before making a decision.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Monthly Instalment" value={formatPKR(result.monthlyInstalment, { perMonth: true }).short} />
        <SummaryCard label="Total Markup Paid" value={formatPKR(result.totalMarkup).short} />
        <SummaryCard label="Total Amount Paid" value={formatPKR(result.totalPaid).short} />
      </div>

      <div>
        <h2 className="mb-1 text-heading-lg uppercase text-ink-primary">Principal vs Markup, by Year</h2>
        <p className="mb-4 text-body-sm text-ink-secondary">
          Each bar is one year of instalments. Early years lean markup-heavy; later years lean principal-heavy —
          typical of reducing-balance amortisation.
        </p>
        <MortgageChart years={yearlyRows} />
      </div>

      <div>
        <h2 className="mb-4 text-heading-lg uppercase text-ink-primary">Amortisation Schedule</h2>
        <Tabs defaultValue="yearly">
          <TabsList>
            <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Detail</TabsTrigger>
          </TabsList>
          <TabsContent value="yearly">
            <ScheduleTable>
              <thead className="sticky top-0 z-10 bg-surface-raised">
                <tr className="border-b border-border-hairline text-left text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2">Principal Paid</th>
                  <th className="px-3 py-2">Markup Paid</th>
                  <th className="px-3 py-2">Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlyRows.map((y) => (
                  <tr key={y.year} className="border-b border-border-hairline last:border-0">
                    <td className="px-3 py-2 font-tabular-nums">{y.year}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(y.principal).short}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(y.markup).short}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(Math.max(y.endingBalance, 0)).short}</td>
                  </tr>
                ))}
              </tbody>
            </ScheduleTable>
          </TabsContent>
          <TabsContent value="monthly">
            <ScheduleTable>
              <thead className="sticky top-0 z-10 bg-surface-raised">
                <tr className="border-b border-border-hairline text-left text-body-sm font-semibold uppercase tracking-wide text-ink-secondary">
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Instalment</th>
                  <th className="px-3 py-2">Principal</th>
                  <th className="px-3 py-2">Markup</th>
                  <th className="px-3 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((r) => (
                  <tr key={r.month} className="border-b border-border-hairline last:border-0">
                    <td className="px-3 py-2 font-tabular-nums">{r.month}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(r.payment).short}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(r.principal).short}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(r.markup).short}</td>
                    <td className="px-3 py-2 font-tabular-nums">{formatPKR(Math.max(r.balance, 0)).short}</td>
                  </tr>
                ))}
              </tbody>
            </ScheduleTable>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-sunken p-5">
      <p className="text-label uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="mt-2 font-tabular-nums text-2xl font-semibold text-navy-800">{value}</p>
    </div>
  );
}

function ScheduleTable({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 max-h-96 overflow-y-auto border border-border-hairline">
      <table className="w-full min-w-[480px] border-collapse text-body-sm text-ink-primary">{children}</table>
    </div>
  );
}

function MortgageChart({ years }: { years: YearlyRow[] }) {
  if (years.length === 0) return null;
  const maxTotal = Math.max(...years.map((y) => y.principal + y.markup), 1);
  const chartHeight = 200;

  return (
    <div className="rounded-2xl border border-border-hairline p-5">
      <div className="flex items-end gap-1 overflow-x-auto" style={{ height: chartHeight }} aria-hidden="true">
        {years.map((y) => {
          const total = y.principal + y.markup;
          const totalHeight = Math.round((total / maxTotal) * chartHeight);
          const principalHeight = total > 0 ? Math.round((y.principal / total) * totalHeight) : 0;
          const markupHeight = totalHeight - principalHeight;
          return (
            <div key={y.year} className="flex min-w-[18px] flex-1 flex-col items-center justify-end">
              <div className="flex w-full flex-col justify-end" style={{ height: totalHeight }}>
                <div className="w-full bg-accent" style={{ height: markupHeight }} />
                <div className="w-full bg-navy-800" style={{ height: principalHeight }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1 overflow-x-auto" aria-hidden="true">
        {years.map((y) => (
          <div key={y.year} className="min-w-[18px] flex-1 text-center font-tabular-nums text-[0.6875rem] text-ink-muted">
            {y.year}
          </div>
        ))}
      </div>
      <p className="sr-only">
        Chart shows yearly principal and markup composition of your instalments. Exact figures are in the schedule
        table below.
      </p>
      <div className="mt-4 flex items-center gap-5 border-t border-border-hairline pt-3 text-body-sm text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-navy-800" aria-hidden="true" /> Principal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 bg-accent" aria-hidden="true" /> Markup
        </span>
      </div>
    </div>
  );
}
