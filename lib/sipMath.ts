const EPSILON = 1e-10;

export interface SipResult {
  futureValue: number;
  totalInvested: number;
  totalGains: number;
  wealthMultiplier: number;
  inflationAdjusted: number;
}

export interface YearlyBreakdownPoint {
  year: number;
  invested: number;
  value: number;
  profit: number;
}

export interface MilestoneResult {
  amount: number;
  label: string;
  yearReached: number | null;
  monthReached: number | null;
  reached: boolean;
}

function sanitizeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function toMonthCount(years: number): number {
  return Math.max(0, Math.round(sanitizeNumber(years) * 12));
}

/**
 * Monthly rate: r = Annual rate ÷ 12
 * Per hackathon rules (simple division, not effective monthly conversion).
 */
export function toMonthlyRate(annualReturnPercent: number): number {
  const annualRate = sanitizeNumber(annualReturnPercent) / 100;
  return annualRate / 12;
}

export function calculateSIPFutureValue(
  monthlyInvestment: number,
  annualReturnPercent: number,
  years: number,
  inflationPercent: number
): SipResult {
  const contribution = Math.max(0, sanitizeNumber(monthlyInvestment));
  const months = toMonthCount(years);
  const monthlyRate = toMonthlyRate(annualReturnPercent);
  const totalInvested = contribution * months;

  if (months === 0 || contribution === 0) {
    return {
      futureValue: 0,
      totalInvested,
      totalGains: 0,
      wealthMultiplier: 0,
      inflationAdjusted: 0,
    };
  }

  let futureValue = 0;

  if (Math.abs(monthlyRate) < EPSILON) {
    futureValue = contribution * months;
  } else {
    // Standard SIP FV: P * [((1+r)^n - 1) / r] * (1+r)
    const growth = Math.pow(1 + monthlyRate, months);
    futureValue = contribution * ((growth - 1) / monthlyRate) * (1 + monthlyRate);
  }

  const safeInflation = sanitizeNumber(inflationPercent);
  const safeYears = sanitizeNumber(years);
  const inflationAdjusted =
    safeInflation > 0 && safeYears > 0
      ? futureValue / Math.pow(1 + safeInflation / 100, safeYears)
      : futureValue;

  return {
    futureValue,
    totalInvested,
    totalGains: futureValue - totalInvested,
    wealthMultiplier:
      totalInvested > 0 ? futureValue / totalInvested : 0,
    inflationAdjusted,
  };
}

export function calculateYearlyBreakdown(
  monthlyInvestment: number,
  annualReturnPercent: number,
  years: number
): YearlyBreakdownPoint[] {
  const contribution = Math.max(0, sanitizeNumber(monthlyInvestment));
  const months = toMonthCount(years);
  const monthlyRate = toMonthlyRate(annualReturnPercent);

  if (months === 0 || contribution === 0) {
    return [];
  }

  const rows: YearlyBreakdownPoint[] = [];
  let value = 0;
  let invested = 0;

  for (let month = 1; month <= months; month += 1) {
    value = (value + contribution) * (1 + monthlyRate);
    invested += contribution;

    if (month % 12 === 0 || month === months) {
      const year = Math.ceil(month / 12);
      rows.push({
        year,
        invested,
        value,
        profit: value - invested,
      });
    }
  }

  return rows;
}

const DEFAULT_MILESTONES = [
  { amount: 100000, label: "₹1 Lakh" },
  { amount: 500000, label: "₹5 Lakh" },
  { amount: 1000000, label: "₹10 Lakh" },
  { amount: 2500000, label: "₹25 Lakh" },
  { amount: 5000000, label: "₹50 Lakh" },
  { amount: 10000000, label: "₹1 Crore" },
];

export function calculateMilestones(
  monthlyInvestment: number,
  annualReturnPercent: number,
  years: number,
  milestones: { amount: number; label: string }[] = DEFAULT_MILESTONES
): MilestoneResult[] {
  const contribution = Math.max(0, sanitizeNumber(monthlyInvestment));
  const months = toMonthCount(years);
  const monthlyRate = toMonthlyRate(annualReturnPercent);

  const results: MilestoneResult[] = milestones.map((m) => ({
    ...m,
    yearReached: null,
    monthReached: null,
    reached: false,
  }));

  if (months === 0 || contribution === 0) {
    return results;
  }

  let value = 0;
  const pending = new Set(milestones.map((_, i) => i));

  for (let month = 1; month <= months && pending.size > 0; month += 1) {
    value = (value + contribution) * (1 + monthlyRate);

    for (const idx of Array.from(pending)) {
      if (value >= milestones[idx].amount) {
        results[idx].yearReached = Math.ceil(month / 12);
        results[idx].monthReached = month;
        results[idx].reached = true;
        pending.delete(idx);
      }
    }
  }

  return results;
}

/** Rule of 72: approximate years to double money at given annual return */
export function ruleOf72(annualReturnPercent: number): number {
  const rate = sanitizeNumber(annualReturnPercent);
  if (rate <= 0) return Infinity;
  return 72 / rate;
}

/** Calculate scenario comparison: current vs +extra amount vs +extra years */
export function calculateScenarios(
  monthlyInvestment: number,
  annualReturnPercent: number,
  years: number,
  inflationPercent: number,
  extraMonthly: number = 1000,
  extraYears: number = 5
): {
  current: SipResult;
  moreMonthly: SipResult;
  moreYears: SipResult;
  moreMonthlyLabel: string;
  moreYearsLabel: string;
} {
  return {
    current: calculateSIPFutureValue(monthlyInvestment, annualReturnPercent, years, inflationPercent),
    moreMonthly: calculateSIPFutureValue(
      monthlyInvestment + extraMonthly,
      annualReturnPercent,
      years,
      inflationPercent
    ),
    moreYears: calculateSIPFutureValue(
      monthlyInvestment,
      annualReturnPercent,
      years + extraYears,
      inflationPercent
    ),
    moreMonthlyLabel: `+₹${extraMonthly.toLocaleString("en-IN")}/mo`,
    moreYearsLabel: `+${extraYears} years`,
  };
}
