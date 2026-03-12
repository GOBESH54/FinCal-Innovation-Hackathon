import { memo, useMemo } from "react";
import { formatCompactInrNumber } from "../lib/formatters";
import { calculateScenarios } from "../lib/sipMath";
import NumericSliderInput from "./NumericSliderInput";
import styles from "../styles/calculator.module.css";

interface ScenarioComparisonProps {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  inflationRate: number;
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
  extraMonthly,
  extraYears,
  onExtraMonthlyChange,
  onExtraYearsChange,
}: ScenarioComparisonProps) {
  const scenarios = useMemo(
    () => calculateScenarios(monthlyInvestment, annualReturn, years, inflationRate, extraMonthly, extraYears),
    [monthlyInvestment, annualReturn, years, inflationRate, extraMonthly, extraYears]
  );

  const maxValue = Math.max(
    scenarios.current.futureValue,
    scenarios.moreMonthly.futureValue,
    scenarios.moreYears.futureValue,
    1
  );

  const items = [
    {
      label: "Your Current Plan",
      value: scenarios.current.futureValue,
      diff: null as string | null,
      isCurrent: true,
    },
    {
      label: scenarios.moreMonthlyLabel,
      value: scenarios.moreMonthly.futureValue,
      diff: `+${formatCompactInrNumber(
        scenarios.moreMonthly.futureValue - scenarios.current.futureValue
      )}`,
      isCurrent: false,
    },
    {
      label: scenarios.moreYearsLabel,
      value: scenarios.moreYears.futureValue,
      diff: `+${formatCompactInrNumber(
        scenarios.moreYears.futureValue - scenarios.current.futureValue
      )}`,
      isCurrent: false,
    },
  ];

  return (
    <section className={styles.card} aria-labelledby="scenario-title">
      <div className={styles.cardHeader}>
        <h2 id="scenario-title" className={styles.cardTitle}>
          Scenario Comparison
        </h2>
      </div>

      {/* Editable scenario assumptions */}
      <div className={styles.inputGroup} style={{ marginBottom: "12px" }}>
        <NumericSliderInput
          id="scenarioExtraMonthly"
          label="Additional Monthly Amount"
          min={0}
          max={50000}
          step={500}
          value={extraMonthly}
          onChange={onExtraMonthlyChange}
          prefix="₹"
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

      <div className={styles.scenarioGrid}>
        {items.map((item) => (
          <article
            key={item.label}
            className={`${styles.scenarioCard} ${
              item.isCurrent ? styles.scenarioCurrent : ""
            }`}
          >
            <p className={styles.scenarioLabel}>{item.label}</p>
            <p className={styles.scenarioValue}>
              {formatCompactInrNumber(item.value)}
            </p>
            {item.diff && (
              <p className={styles.scenarioDiff}>{item.diff}</p>
            )}
            <div className={styles.scenarioBar}>
              <div
                className={styles.scenarioBarFill}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      <p className={styles.scenarioExplainer}>
        <strong>Key Insight:</strong> Small increases in monthly investment or
        duration can create dramatically different illustrative outcomes over time. This
        demonstrates the nature of compound interest — even modest
        changes today may mean significantly more in the future. All values are illustrative only.
      </p>
    </section>
  );
}

export default memo(ScenarioComparison);
