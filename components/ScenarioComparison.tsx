import { memo, useMemo } from "react";
import { formatCompactInrNumber } from "../lib/formatters";
import { calculateScenarios } from "../lib/sipMath";
import NumericSliderInput from "./NumericSliderInput";

interface ScenarioComparisonProps {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  inflationRate: number;
  taxRate: number;
  extraMonthly: number;
  extraYears: number;
  onExtraMonthlyChange: (value: number) => void;
  onExtraYearsChange: (value: number) => void;
}

function ScenarioComparison({
  monthlyInvestment,
  annualReturn,
  years,
  inflationRate,
  taxRate,
  extraMonthly,
  extraYears,
  onExtraMonthlyChange,
  onExtraYearsChange,
}: ScenarioComparisonProps) {
  const scenarios = useMemo(
    () => calculateScenarios(monthlyInvestment, annualReturn, years, inflationRate, taxRate, extraMonthly, extraYears),
    [monthlyInvestment, annualReturn, years, inflationRate, taxRate, extraMonthly, extraYears]
  );

  const maxValue = Math.max(
    scenarios.current.postTaxFutureValue,
    scenarios.moreMonthly.postTaxFutureValue,
    scenarios.moreYears.postTaxFutureValue,
    1
  );

  const items = [
    {
      label: "Your Current Plan",
      value: scenarios.current.postTaxFutureValue,
      diff: null as string | null,
      isCurrent: true,
    },
    {
      label: scenarios.moreMonthlyLabel,
      value: scenarios.moreMonthly.postTaxFutureValue,
      diff: `+${formatCompactInrNumber(
        scenarios.moreMonthly.postTaxFutureValue - scenarios.current.postTaxFutureValue
      )}`,
      isCurrent: false,
    },
    {
      label: scenarios.moreYearsLabel,
      value: scenarios.moreYears.postTaxFutureValue,
      diff: `+${formatCompactInrNumber(
        scenarios.moreYears.postTaxFutureValue - scenarios.current.postTaxFutureValue
      )}`,
      isCurrent: false,
    },
  ];

  return (
    <section className="app-card" aria-labelledby="scenario-title">
      <div className="mb-4">
        <h2 id="scenario-title" className="card-title">
          Scenario Comparison
        </h2>
      </div>

      <div className="mb-4 space-y-4">
        <NumericSliderInput
          id="scenarioExtraMonthly"
          label="Additional Monthly Amount"
          min={0}
          max={50000}
          step={500}
          value={extraMonthly}
          onChange={onExtraMonthlyChange}
          prefix={"\u20B9"}
          tooltipText="Additional monthly investment for comparison scenario. Adjust to see the impact of increasing your SIP amount."
        />
        <NumericSliderInput
          id="scenarioExtraYears"
          label="Additional Duration"
          min={0}
          max={20}
          step={1}
          value={extraYears}
          onChange={onExtraYearsChange}
          suffix="Yrs"
          tooltipText="Additional years for comparison scenario. Adjust to see the impact of extending your investment duration."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className={`rounded-xl border p-4 text-center ${
              item.isCurrent
                ? "border-brandBlue/35 bg-brandBlue/5 dark:border-brandBlue/40 dark:bg-brandBlue/20"
                : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl dark:text-slate-100">
              {formatCompactInrNumber(item.value)}
            </p>
            {item.diff && (
              <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-300">{item.diff}</p>
            )}
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brandBlue to-brandRed"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 rounded-lg border-l-4 border-brandBlue bg-brandBlue/5 p-3 text-sm leading-6 text-slate-700 md:text-base dark:bg-brandBlue/20 dark:text-slate-200">
        <strong>Key Insight:</strong> Small increases in monthly investment or
        duration can create dramatically different illustrative outcomes over time. This
        demonstrates the nature of compound interest, and all values are illustrative only.
      </p>
    </section>
  );
}

export default memo(ScenarioComparison);
