export interface FinanceInputs { price: number; deposit: number; annualInterestRate: number; termMonths: number; }
export function calculateMonthlyRepayment({ price, deposit, annualInterestRate, termMonths }: FinanceInputs): number {
  const principal = Math.max(0, price - deposit); const months = Math.max(1, termMonths); const monthlyRate = Math.max(0, annualInterestRate) / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
}
