import { memo, useMemo } from "react";
import {
  formatCompactInrNumber,
  formatMultiplier,
  formatInrNumber,
  formatPercentage,
} from "../lib/formatters";
import { ruleOf72 } from "../lib/sipMath";
import type { SipResult } from "../lib/sipMath";
import styles from "../styles/calculator.module.css";

interface EducationalInsightsProps {
  result: SipResult;
  annualReturn: number;
  years: number;
  inflationRate: number;
}

function EducationalInsights({
  result,
  annualReturn,
  years,
  inflationRate,
}: EducationalInsightsProps) {
  const doublingYears = useMemo(
    () => ruleOf72(annualReturn),
    [annualReturn]
  );

  const compoundingPower = useMemo(() => {
    if (result.totalInvested <= 0) return 0;
    return (result.totalGains / result.totalInvested) * 100;
  }, [result.totalGains, result.totalInvested]);

  const linearGrowth = useMemo(
    () => result.totalInvested * (1 + (annualReturn / 100) * years),
    [result.totalInvested, annualReturn, years]
  );

  const compoundBonus = useMemo(
    () => result.futureValue - linearGrowth,
    [result.futureValue, linearGrowth]
  );

  return (
    <section
      className={styles.card}
      aria-labelledby="edu-insights-title"
    >
      <div className={styles.cardHeader}>
        <h2 id="edu-insights-title" className={styles.cardTitle}>
          Learn While You Plan
        </h2>
      </div>

      <div className={styles.insightsGrid}>
        {/* Power of Compounding */}
        <article className={styles.insightItem}>
          <h3 className={styles.insightItemTitle}>Power of Compounding</h3>
          <p className={styles.insightItemValue}>
            {formatCompactInrNumber(result.totalGains)}
          </p>
          <p className={styles.insightItemDesc}>
            Your illustrative returns alone are {compoundingPower.toFixed(0)}% of your
            invested amount. Compounding may earn you{" "}
            {formatCompactInrNumber(Math.max(0, compoundBonus))} more than
            simple interest would.
          </p>
        </article>

        {/* Wealth Multiplier */}
        <article className={styles.insightItem}>
          <h3 className={styles.insightItemTitle}>Wealth Multiplier</h3>
          <p className={styles.insightItemValue}>
            {formatMultiplier(result.wealthMultiplier)}
          </p>
          <p className={styles.insightItemDesc}>
            Every rupee you invest may become{" "}
            {formatMultiplier(result.wealthMultiplier)} over {years} years at the
            assumed return rate. The longer you stay invested, the higher this
            multiplier may grow.
          </p>
        </article>

        {/* Rule of 72 */}
        <article className={styles.insightItem}>
          <h3 className={styles.insightItemTitle}>Rule of 72</h3>
          <p className={styles.insightItemValue}>
            ~{doublingYears.toFixed(1)} years
          </p>
          <p className={styles.insightItemDesc}>
            At {formatPercentage(annualReturn)} assumed annual return, your money approximately doubles
            every {doublingYears.toFixed(1)} years. This is a quick mental math
            shortcut: 72 divided by the return rate equals the approximate doubling time.
          </p>
        </article>

        {/* Inflation Impact */}
        <article className={styles.insightItem}>
          <h3 className={styles.insightItemTitle}>Inflation-Adjusted Value</h3>
          <p className={styles.insightItemValue}>
            {formatInrNumber(result.inflationAdjusted)}
          </p>
          <p className={styles.insightItemDesc}>
            Assuming {formatPercentage(inflationRate)} annual inflation (user-set), your{" "}
            {formatCompactInrNumber(result.futureValue)} would have the
            illustrative purchasing power of{" "}
            {formatCompactInrNumber(result.inflationAdjusted)} in
            today&apos;s terms.
          </p>
        </article>
      </div>
    </section>
  );
}

export default memo(EducationalInsights);
