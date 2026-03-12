import { memo, useEffect, useRef, useState } from "react";
import NumericSliderInput from "./NumericSliderInput";
import DonutChart from "./DonutChart";
import { formatInrNumber } from "../lib/formatters";
import type { SipResult } from "../lib/sipMath";

interface SipCalculatorProps {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  taxRate: number;
  result: SipResult;
  onMonthlyInvestmentChange: (value: number) => void;
  onAnnualReturnChange: (value: number) => void;
  onYearsChange: (value: number) => void;
  onTaxRateChange: (value: number) => void;
  onReset: () => void;
}

function useAnimatedNumber(target: number, duration = 400): number {
  const [value, setValue] = useState(target);
  const previous = useRef(target);

  useEffect(() => {
    const start = performance.now();
    const from = previous.current;
    const delta = target - from;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + delta * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previous.current = target;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function SipCalculator({
  monthlyInvestment,
  annualReturn,
  years,
  taxRate,
  result,
  onMonthlyInvestmentChange,
  onAnnualReturnChange,
  onYearsChange,
  onTaxRateChange,
  onReset,
}: SipCalculatorProps) {
  const investedAnimated = useAnimatedNumber(result.totalInvested);
  const gainsAnimated = useAnimatedNumber(result.totalGains);
  const futureAnimated = useAnimatedNumber(result.futureValue);
  const postTaxGainsAnimated = useAnimatedNumber(result.postTaxGains);
  const postTaxFutureAnimated = useAnimatedNumber(result.postTaxFutureValue);

  return (
    <section className="app-card h-full" aria-labelledby="sip-calculator-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 id="sip-calculator-title" className="card-title">
            SIP Calculator
          </h2>
          <button
            type="button"
            className="group relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-brandBlue/40 bg-brandBlue/10 text-xs font-bold text-brandBlue dark:border-brandBlue/60 dark:bg-brandBlue/20 dark:text-blue-100"
            aria-label="What is SIP?"
            title="What is SIP?"
            aria-describedby="sip-term-tooltip"
          >
            i
            <span
              id="sip-term-tooltip"
              role="tooltip"
              className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-64 max-w-[calc(100vw-2rem)] rounded-lg bg-slate-900 p-2 text-left text-xs font-medium text-white shadow-lg group-hover:block group-focus-within:block md:left-1/2 md:right-auto md:-translate-x-1/2 dark:border dark:border-slate-700 dark:bg-slate-800"
            >
              SIP (Systematic Investment Plan) is a method of investing a fixed
              amount regularly in mutual funds. It helps build wealth over time
              through the power of compounding.
            </span>
          </button>
        </div>
        <button
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brandBlue hover:text-brandBlue focus:outline-none focus:ring-2 focus:ring-brandBlue/30 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brandRed dark:hover:text-brandRed"
          type="button"
          onClick={onReset}
          aria-label="Reset SIP calculator values"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <NumericSliderInput
          id="monthlyInvestment"
          label="Monthly Investment"
          min={0}
          max={500000}
          step={500}
          value={monthlyInvestment}
          onChange={onMonthlyInvestmentChange}
          prefix={"\u20B9"}
          tooltipText="The fixed amount you invest every month. Even small amounts, invested consistently, can grow significantly over time through compounding."
        />
        <NumericSliderInput
          id="annualReturn"
          label="Expected Annual Return"
          min={0}
          max={30}
          step={0.1}
          value={annualReturn}
          onChange={onAnnualReturnChange}
          suffix="%"
          tooltipText="The assumed yearly growth rate of your investment. Historically, equity mutual funds in India have delivered 10-15% average annual returns, but past performance does not guarantee future results."
        />
        <NumericSliderInput
          id="investmentYears"
          label="Investment Duration"
          min={0}
          max={45}
          step={1}
          value={years}
          onChange={onYearsChange}
          suffix="Yrs"
          tooltipText="How long you plan to continue investing. Longer durations dramatically increase returns due to compounding and time in market."
        />
        <NumericSliderInput
          id="taxRate"
          label="Assumed Exit Tax (LTCG)"
          min={0}
          max={30}
          step={0.5}
          value={taxRate}
          onChange={onTaxRateChange}
          suffix="%"
          tooltipText="The estimated Long Term Capital Gains (LTCG) tax rate upon exit. Usually 12.5% in India for equity mutual funds over \u20B91.25L gains. Demonstrates realistic post-tax wealth."
        />
      </div>

      <div
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total Invested
          </p>
          <p className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl dark:text-slate-100">
            {formatInrNumber(investedAnimated)}
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Est. Returns
          </p>
          <p className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl dark:text-slate-100">
            {formatInrNumber(gainsAnimated)}
          </p>
        </article>
        <article className="rounded-xl border border-brandBlue/25 bg-gradient-to-br from-brandBlue/10 to-brandRed/5 p-4 dark:border-brandBlue/40 dark:from-brandBlue/20 dark:to-brandRed/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Future Value
          </p>
          <p className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl dark:text-slate-100">
            {formatInrNumber(futureAnimated)}
          </p>
        </article>
      </div>

      <div
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 relative group dark:border-slate-700 dark:bg-slate-800/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Post-Tax Gains
          </p>
          <p className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl dark:text-slate-100">
            {formatInrNumber(postTaxGainsAnimated)}
          </p>
        </article>
        <article className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 dark:border-emerald-400/40 dark:from-emerald-900/40 dark:to-emerald-700/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
            Post-Tax Future Value
          </p>
          <p className="mt-2 text-xl font-extrabold text-emerald-900 md:text-2xl dark:text-emerald-100">
            {formatInrNumber(postTaxFutureAnimated)}
          </p>
        </article>
      </div>

      <DonutChart invested={result.totalInvested} returns={result.postTaxGains} />
    </section>
  );
}

export default memo(SipCalculator);
