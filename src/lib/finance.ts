/**
 * Instalment maths, shared so the concierge and the detail page cannot drift
 * apart. The rate is a representative figure for illustration, not a quote.
 */
export const DEFAULT_FINANCE = {
  depositRate: 0.1,
  termMonths: 60,
  annualRate: 0.115,
} as const;

export interface FinanceOptions {
  depositRate?: number;
  termMonths?: number;
  annualRate?: number;
}

export interface InstalmentResult {
  monthly: number;
  deposit: number;
  financed: number;
  termMonths: number;
  annualRate: number;
  totalRepaid: number;
}

/** Standard amortised repayment: P·r / (1 − (1+r)^−n). */
export function instalmentFor(price: number, options: FinanceOptions = {}): InstalmentResult {
  const depositRate = options.depositRate ?? DEFAULT_FINANCE.depositRate;
  const termMonths = options.termMonths ?? DEFAULT_FINANCE.termMonths;
  const annualRate = options.annualRate ?? DEFAULT_FINANCE.annualRate;

  const deposit = Math.round(price * depositRate);
  const financed = Math.max(0, price - deposit);
  const monthlyRate = annualRate / 12;
  const monthly =
    monthlyRate === 0
      ? financed / termMonths
      : (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  return {
    monthly: Math.round(monthly),
    deposit,
    financed,
    termMonths,
    annualRate,
    totalRepaid: Math.round(monthly * termMonths + deposit),
  };
}
