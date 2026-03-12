const IN_NUMBER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatInrNumber(value: number): string {
  const rounded = Number.isFinite(value) ? Math.round(value) : 0;
  return `₹${IN_NUMBER_FORMATTER.format(rounded)}`;
}

export function formatCompactInrNumber(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const absValue = Math.abs(safeValue);
  const sign = safeValue < 0 ? "-" : "";
  const compact = (num: number) => num.toFixed(1).replace(/\.0$/, "");

  if (absValue >= 10000000) {
    return `${sign}₹${compact(absValue / 10000000)} Cr`;
  }

  if (absValue >= 100000) {
    return `${sign}₹${compact(absValue / 100000)} L`;
  }

  if (absValue >= 1000) {
    return `${sign}₹${compact(absValue / 1000)}K`;
  }

  return formatInrNumber(safeValue);
}

export function formatPercentage(value: number, decimals = 1): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(decimals)}%`;
}

export function formatMultiplier(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(1)}×`;
}

export function formatYearsMonths(totalMonths: number): string {
  const safe = Number.isFinite(totalMonths) ? Math.max(0, Math.round(totalMonths)) : 0;
  const years = Math.floor(safe / 12);
  const months = safe % 12;

  if (years === 0 && months === 0) return "0 months";
  if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
  if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years}y ${months}m`;
}
