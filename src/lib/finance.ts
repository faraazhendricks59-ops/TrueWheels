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
  /**
   * Annual interest as a decimal fraction, so 11.5% is 0.115 and not 11.5.
   * Every function in this module uses this convention; a percent passed here
   * produces an instalment that is wrong by orders of magnitude.
   */
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

export interface QuoteOptions extends FinanceOptions {
  /** Amount left owing at the end of the term, paid as a lump sum. */
  balloon?: number;
  /** Once-off fees added to the amount financed. */
  initiationFee?: number;
  /** Monthly fees added to the instalment. */
  monthlyServiceFee?: number;
}

export interface Quote {
  monthly: number;
  /** Instalment with no fees included, for showing the fee separately. */
  baseMonthly: number;
  deposit: number;
  balloon: number;
  financed: number;
  termMonths: number;
  annualRate: number;
  initiationFee: number;
  monthlyServiceFee: number;
  /** Every rand paid over the term, including the deposit and the balloon. */
  totalCost: number;
  /** totalCost less the price of the vehicle. */
  totalInterest: number;
}

/**
 * The instalment and the total cost of credit.
 *
 * The formula is the standard amortised repayment with a final lump sum, so the
 * balance reaches exactly the balloon at the end of the term:
 *
 *   M = r · (P·(1+r)^n − B) / ((1+r)^n − 1)
 *
 * where P is the amount borrowed, r the monthly rate, n the number of months and
 * B the balloon. Dropping the balloon from P (which is the easy mistake) makes
 * the instalment look up to a few hundred rand a month cheaper than it is, and
 * the total cost of credit is what the National Credit Act requires to be shown,
 * so the figure has to be right.
 */
export function quoteFor(price: number, options: QuoteOptions = {}): Quote {
  const depositRate = options.depositRate ?? DEFAULT_FINANCE.depositRate;
  const termMonths = options.termMonths ?? DEFAULT_FINANCE.termMonths;
  const annualRate = options.annualRate ?? DEFAULT_FINANCE.annualRate;
  const initiationFee = options.initiationFee ?? 0;
  const monthlyServiceFee = options.monthlyServiceFee ?? 0;

  const deposit = Math.round(price * depositRate);
  const balloon = Math.min(Math.max(0, options.balloon ?? 0), Math.max(0, price - deposit));
  const principal = Math.max(0, price - deposit) + initiationFee;
  const monthlyRate = annualRate / 12;

  const growth = Math.pow(1 + monthlyRate, termMonths);
  const baseMonthly =
    monthlyRate === 0
      ? Math.max(0, (principal - balloon) / termMonths)
      : Math.max(0, (monthlyRate * (principal * growth - balloon)) / (growth - 1));

  const monthly = Math.round(baseMonthly + monthlyServiceFee);
  const totalCost = Math.round(monthly * termMonths + deposit + balloon);

  return {
    monthly,
    baseMonthly: Math.round(baseMonthly),
    deposit,
    balloon,
    financed: Math.round(principal),
    termMonths,
    annualRate,
    initiationFee,
    monthlyServiceFee,
    totalCost,
    totalInterest: Math.round(totalCost - price),
  };
}

/** The prime rate this project illustrates against, as a decimal fraction. */
export const ILLUSTRATIVE_PRIME = 0.1025;

/** Converts a percentage figure, as shown to a user, to the decimal this module uses. */
export function asRate(percent: number): number {
  return percent / 100;
}

/** Converts the decimal this module uses back to a percentage figure for display. */
export function asPercent(rate: number): number {
  return rate * 100;
}
