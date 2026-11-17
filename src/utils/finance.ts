import type { FinanceParams, FinanceResult } from '../types/aurex';

export function formatCurrency(amount: number, includeCents = false): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  }).format(safeAmount);
}

export function calculateFinanceEstimate(params: FinanceParams): FinanceResult {
  const vehiclePrice = Math.max(0, Number.isFinite(params.vehiclePrice) ? params.vehiclePrice : 0);
  const rawDown = Math.max(0, Number.isFinite(params.downPayment) ? params.downPayment : 0);
  const downPayment = Math.min(rawDown, vehiclePrice);
  const termMonths = Math.max(12, Math.round(Number.isFinite(params.termMonths) ? params.termMonths : 60));
  const aprPercent = Math.max(0, Math.min(30, Number.isFinite(params.aprPercent) ? params.aprPercent : 0));

  const downPaymentPercent = vehiclePrice > 0 ? Math.round((downPayment / vehiclePrice) * 100) : 0;

  if (params.mode === 'lease') {
    const residualRate =
      params.residualPercent !== undefined
        ? Math.max(0.25, Math.min(0.85, params.residualPercent / 100))
        : termMonths <= 24
          ? 0.66
          : termMonths <= 36
            ? 0.58
            : termMonths <= 48
              ? 0.5
              : 0.44;

    const residualValue = Math.round(vehiclePrice * residualRate);
    const capitalizedCost = Math.max(0, vehiclePrice - downPayment);
    const depreciationFee = Math.max(0, capitalizedCost - residualValue) / termMonths;
    const moneyFactor = aprPercent / 2400;
    const rentChargeMonthly = (capitalizedCost + residualValue) * moneyFactor;
    const monthlyPayment = Math.max(0, Math.round(depreciationFee + rentChargeMonthly));
    const totalRent = Math.max(0, Math.round(rentChargeMonthly * termMonths));
    const totalOutlay = Math.round(downPayment + monthlyPayment * termMonths);

    return {
      monthlyPayment,
      financedAmount: Math.max(0, capitalizedCost - residualValue),
      totalInterestOrRent: totalRent,
      totalOutlay,
      downPaymentPercent,
      residualValue,
    };
  }

  const principal = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = aprPercent / 100 / 12;

  let monthlyPayment = 0;
  if (principal > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (principal * (monthlyRate * factor)) / (factor - 1);
    }
  }

  const roundedMonthly = Math.round(monthlyPayment);
  const totalPayments = roundedMonthly * termMonths;
  const totalInterest = Math.max(0, totalPayments - principal);
  const totalOutlay = Math.round(downPayment + totalPayments);

  return {
    monthlyPayment: roundedMonthly,
    financedAmount: Math.round(principal),
    totalInterestOrRent: Math.round(totalInterest),
    totalOutlay,
    downPaymentPercent,
    residualValue: 0,
  };
}

export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Empty' | 'Weak' | 'Fair' | 'Strong' | 'Vault Grade';
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, label: 'Empty' };
  }
  let points = 0;
  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) points += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) points += 1;

  const clamped = Math.max(1, Math.min(4, points)) as 1 | 2 | 3 | 4;
  const labels: Record<1 | 2 | 3 | 4, PasswordStrengthResult['label']> = {
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Vault Grade',
  };
  return { score: clamped, label: labels[clamped] };
}
