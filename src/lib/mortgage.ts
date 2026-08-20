/**
 * Standard reducing-balance amortisation. Purely arithmetic — no bank data,
 * no eligibility rules. Rate presets it's typically paired with
 * (`BANK_MARKUP_PRESETS`) are explicitly marked indicative placeholders;
 * this module doesn't know or care where the rate came from.
 */

import type { AmortisationRow, MortgageInput, MortgageResult } from "@/types";

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = Math.max(input.propertyPrice * (1 - input.downPaymentPercent / 100), 0);
  const months = Math.max(Math.round(input.tenureYears * 12), 1);
  const monthlyRate = Math.max(input.markupRatePercent, 0) / 100 / 12;

  const monthlyInstalment = computeMonthlyInstalment(loanAmount, monthlyRate, months);

  const schedule: AmortisationRow[] = [];
  let balance = loanAmount;
  for (let month = 1; month <= months; month++) {
    const markup = balance * monthlyRate;
    let principal = monthlyInstalment - markup;
    if (month === months) {
      // Absorb floating-point drift so the final row always zeroes the balance.
      principal = balance;
    }
    balance = Math.max(balance - principal, 0);
    schedule.push({ month, payment: monthlyInstalment, principal, markup, balance });
  }

  const totalPaid = monthlyInstalment * months;
  const totalMarkup = totalPaid - loanAmount;

  return { loanAmount, monthlyInstalment, totalMarkup, totalPaid, schedule };
}

function computeMonthlyInstalment(loanAmount: number, monthlyRate: number, months: number): number {
  if (loanAmount <= 0) return 0;
  if (monthlyRate === 0) return loanAmount / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (loanAmount * monthlyRate * factor) / (factor - 1);
}
