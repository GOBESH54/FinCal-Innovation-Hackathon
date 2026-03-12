import { memo, useMemo } from "react";
import {
  formatCompactInrNumber,
  formatMultiplier,
  formatInrNumber,
  formatPercentage,
} from "../lib/formatters";
import { ruleOf72 } from "../lib/sipMath";
import type { SipResult } from "../lib/sipMath";

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
    <section className="app-card" aria-labelledby="edu-insights-title">
      <div className="mb-4">
        <h2 id="edu-insights-title" className="card-title">
          Learn While You Plan
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
          <h3 className="text-sm font-semibold text-slate-700 md:text-base dark:text-slate-300">
            Power of Compounding
          </h3>
          <p className="mt-2 text-xl font-extrabold text-brandBlue md:text-2xl">
            {formatCompactInrNumber(result.totalGains)}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
            Your illustrative returns alone are {compoundingPower.toFixed(0)}% of your
            invested amount. Compounding may earn you{" "}
            {formatCompactInrNumber(Math.max(0, compoundBonus))} more than
            simple interest would.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
          <h3 className="text-sm font-semibold text-slate-700 md:text-base dark:text-slate-300">
            Wealth Multiplier
          </h3>
          <p className="mt-2 text-xl font-extrabold text-brandBlue md:text-2xl">
            {formatMultiplier(result.wealthMultiplier)}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
            Every rupee you invest may become{" "}
            {formatMultiplier(result.wealthMultiplier)} over {years} years at the
            assumed return rate. The longer you stay invested, the higher this
            multiplier may grow.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
          <h3 className="text-sm font-semibold text-slate-700 md:text-base dark:text-slate-300">
            Rule of 72
          </h3>
          <p className="mt-2 text-xl font-extrabold text-brandBlue md:text-2xl">
            ~{doublingYears.toFixed(1)} years
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
            At {formatPercentage(annualReturn)} assumed annual return, your money approximately doubles
            every {doublingYears.toFixed(1)} years. This is a quick mental math
            shortcut: 72 divided by the return rate equals the approximate doubling time.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
          <h3 className="text-sm font-semibold text-slate-700 md:text-base dark:text-slate-300">
            Inflation-Adjusted Value
          </h3>
          <p className="mt-2 text-xl font-extrabold text-brandBlue md:text-2xl">
            {formatInrNumber(result.inflationAdjusted)}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
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
