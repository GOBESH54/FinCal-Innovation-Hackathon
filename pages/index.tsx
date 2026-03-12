import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import InvestmentChart from "../components/InvestmentChart";
import InvestmentTimeline from "../components/InvestmentTimeline";
import SipCalculator from "../components/SipCalculator";
import EducationalInsights from "../components/EducationalInsights";
import ScenarioComparison from "../components/ScenarioComparison";
import MilestoneTracker from "../components/MilestoneTracker";
import ThemeToggle from "../components/ThemeToggle";
import NumericSliderInput from "../components/NumericSliderInput";
import {
  formatCompactInrNumber,
  formatInrNumber,
} from "../lib/formatters";
import {
  calculateSIPFutureValue,
  calculateYearlyBreakdown,
} from "../lib/sipMath";

const MANDATORY_DISCLAIMER =
  "This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.";

export default function Home() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(5);
  const [taxRate, setTaxRate] = useState(12.5);
  const [scenarioExtraMonthly, setScenarioExtraMonthly] = useState(1000);
  const [scenarioExtraYears, setScenarioExtraYears] = useState(5);

  const sipResult = useMemo(
    () => calculateSIPFutureValue(monthlyInvestment, sipReturn, sipYears, inflationRate, taxRate),
    [monthlyInvestment, sipReturn, sipYears, inflationRate, taxRate]
  );

  const sipBreakdown = useMemo(
    () => calculateYearlyBreakdown(monthlyInvestment, sipReturn, sipYears),
    [monthlyInvestment, sipReturn, sipYears]
  );

  const returnBand = useMemo(() => {
    if (sipReturn < 8) return "Conservative";
    if (sipReturn < 14) return "Balanced";
    return "Growth";
  }, [sipReturn]);

  const insightText = useMemo(
    () =>
      `If you invest ${formatInrNumber(monthlyInvestment)} every month for ${sipYears} years at ${sipReturn}% annual return, your total investment of ${formatCompactInrNumber(
        sipResult.totalInvested
      )} could grow to approximately ${formatCompactInrNumber(
        sipResult.futureValue
      )}.`,
    [
      monthlyInvestment,
      sipYears,
      sipReturn,
      sipResult.totalInvested,
      sipResult.futureValue
    ]
  );

  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncement(`New estimated post-tax future value is ${formatCompactInrNumber(sipResult.postTaxFutureValue)}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [sipResult.postTaxFutureValue]);

  const handleResetSip = useCallback(() => {
    setMonthlyInvestment(5000);
    setSipReturn(12);
    setSipYears(10);
    setInflationRate(5);
    setTaxRate(12.5);
    setScenarioExtraMonthly(1000);
    setScenarioExtraYears(5);
  }, []);

  return (
    <>
      <Head>
        <title>SIP Learning Planner - Understand SIP Growth In Simple Steps</title>
        <meta
          name="description"
          content="An education-focused SIP calculator that helps you understand compounding, inflation, and long-term investment planning. Not a recommendation for any mutual fund scheme."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#224c87" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div aria-live="polite" className="sr-only" aria-atomic="true">
        {announcement}
      </div>

      <ThemeToggle />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8 space-y-6 overflow-x-hidden">
        <section className="rounded-3xl bg-gradient-to-br from-brandBlue via-brandBlue to-brandRed p-5 text-white shadow-xl md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="inline-block rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider w-fit">
              Education-First SIP Tool
            </p>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Understand SIP Growth In Simple Steps
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/90 md:text-base lg:text-lg">
            Learn how regular monthly investing, return assumptions, and time
            horizon affect long-term outcomes. All values are illustrative and
            not recommendations.
          </p>
          <p className="mt-3 text-base font-semibold text-white md:text-lg">
            No scheme ranking. No product promotion. Just compounding math
            explained clearly.
          </p>
        </section>

        <section
          className="app-card"
          aria-label="Category compliance status"
        >
          <h2 className="text-lg font-bold text-slate-900 md:text-xl dark:text-slate-100">
            Competition Category: SIP Calculator
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base dark:text-slate-300">
            This submission is intentionally locked to one category to comply
            with the rule: one team, one calculator category.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1 lg:col-span-2">
            <SipCalculator
              monthlyInvestment={monthlyInvestment}
              annualReturn={sipReturn}
              years={sipYears}
              taxRate={taxRate}
              result={sipResult}
              onMonthlyInvestmentChange={setMonthlyInvestment}
              onAnnualReturnChange={setSipReturn}
              onYearsChange={setSipYears}
              onTaxRateChange={setTaxRate}
              onReset={handleResetSip}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <InvestmentChart breakdown={sipBreakdown} />
          </div>
        </section>

        <section
          className="app-card"
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 className="card-title">Plain-English Summary</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700 md:text-base lg:text-lg dark:text-slate-200">{insightText}</p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Inflation-Adjusted Value (user-set: {inflationRate}%)
              </p>
              <p className="mt-2 text-lg font-extrabold text-slate-900 md:text-xl dark:text-slate-100">
                {formatInrNumber(sipResult.inflationAdjusted)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Return Assumption Band (illustrative)
              </p>
              <p className="mt-2 text-lg font-extrabold text-slate-900 md:text-xl dark:text-slate-100">{returnBand}</p>
            </article>
          </div>

          <div className="mt-4">
            <NumericSliderInput
              id="inflationRate"
              label="Assumed Inflation Rate"
              min={0}
              max={15}
              step={0.5}
              value={inflationRate}
              onChange={setInflationRate}
              suffix="%"
              tooltipText="The assumed annual rate of inflation. Higher inflation reduces the future purchasing power of your investment. This is user-editable for your own assumptions."
            />
          </div>
          <p className="mt-3 text-xs italic text-slate-500 md:text-sm dark:text-slate-400">
            Mandatory regulatory disclaimer shown below.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-2">
            <EducationalInsights
              result={sipResult}
              annualReturn={sipReturn}
              years={sipYears}
              inflationRate={inflationRate}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <MilestoneTracker
              monthlyInvestment={monthlyInvestment}
              annualReturn={sipReturn}
              years={sipYears}
            />
          </div>
        </section>

        <ScenarioComparison
          monthlyInvestment={monthlyInvestment}
          annualReturn={sipReturn}
          years={sipYears}
          inflationRate={inflationRate}
          taxRate={taxRate}
          extraMonthly={scenarioExtraMonthly}
          extraYears={scenarioExtraYears}
          onExtraMonthlyChange={setScenarioExtraMonthly}
          onExtraYearsChange={setScenarioExtraYears}
        />

        <section
          className="app-card"
          aria-labelledby="education-title"
        >
          <h2 id="education-title" className="card-title">
            How This Calculator Teaches SIP Basics
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-900 md:text-base dark:text-slate-100">1. Enter Assumptions</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
                Set your monthly amount, expected annual return, and number of
                years. Use the sliders or type in exact values.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-900 md:text-base dark:text-slate-100">
                2. Observe Compounding
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
                The chart and donut visualize how returns build over time, not
                in a straight line, but exponentially.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-900 md:text-base dark:text-slate-100">
                3. Explore Scenarios
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300">
                Use the scenario comparison and milestone tracker to see
                how small changes create big differences.
              </p>
            </article>
          </div>
          <p className="mt-4 rounded-lg border-l-4 border-brandBlue bg-brandBlue/5 p-3 text-sm leading-6 text-slate-700 md:text-base dark:bg-brandBlue/20 dark:text-slate-200">
            Educational note: This tool uses monthly rate = annual rate / 12
            as per the standard SIP formula and does not recommend any specific
            mutual fund or scheme.
          </p>
        </section>

        <section
          className="app-card"
          aria-labelledby="formula-disclosure-title"
        >
          <h2
            id="formula-disclosure-title"
            className="card-title"
          >
            Assumptions and Formula Disclosure
          </h2>
          <ul className="mt-4 grid list-none gap-3 p-0">
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">Monthly rate:</strong>{" "}
              <code className="rounded bg-brandBlue/10 px-1.5 py-0.5 text-brandBlue dark:bg-brandBlue/30 dark:text-blue-100">r = Annual Return Rate / 12</code> (simple division as per
              industry-standard SIP convention)
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">SIP Future Value:</strong>{" "}
              <code className="rounded bg-brandBlue/10 px-1.5 py-0.5 text-brandBlue dark:bg-brandBlue/30 dark:text-blue-100">
                FV = P x [((1 + r)^n - 1) / r] x (1 + r)
              </code>{" "}
              where P = monthly investment, r = monthly rate, n = total months
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">Contribution timing:</strong> Monthly contribution timing
              follows the displayed SIP formula convention, including the{" "}
              <code className="rounded bg-brandBlue/10 px-1.5 py-0.5 text-brandBlue dark:bg-brandBlue/30 dark:text-blue-100">x (1 + r)</code> factor.
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">User-editable inputs:</strong> Monthly investment amount,
              assumed annual return rate, investment duration, inflation rate, exit tax rate (LTCG),
              scenario comparison deltas (additional monthly amount and
              additional duration).
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">Tax Impact (LTCG):</strong>{" "}
              <code className="rounded bg-brandBlue/10 px-1.5 py-0.5 text-brandBlue dark:bg-brandBlue/30 dark:text-blue-100">
                Post-Tax Gains = Total Gains - (Total Gains * Tax Rate)
              </code>{" "}
              user-editable tax rate (default 12.5% Long Term Capital Gains tax). Evaluated simply for educational purposes.
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">Not modeled:</strong> Fund management fees, exit
              loads, market volatility path, expense ratios, or any
              scheme-specific parameters.
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 md:text-base dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-slate-100">Inflation adjustment:</strong>{" "}
              <code className="rounded bg-brandBlue/10 px-1.5 py-0.5 text-brandBlue dark:bg-brandBlue/30 dark:text-blue-100">
                Adjusted Value = FV / (1 + inflation%)^years
              </code>{" "}
              user-editable inflation rate (default 5%)
            </li>
          </ul>
          <p className="mt-4 rounded-lg border-l-4 border-brandBlue bg-brandBlue/5 p-3 text-sm leading-6 text-slate-700 md:text-base dark:bg-brandBlue/20 dark:text-slate-200">
            All outputs are illustrative and for educational purposes only. They
            do not constitute investment advice or a recommendation for any
            scheme of HDFC Mutual Fund. Actual outcomes may differ based on
            market conditions and other factors.
          </p>
        </section>

        <InvestmentTimeline breakdown={sipBreakdown} />

        <section
          className="rounded-2xl border-2 border-brandRed bg-brandRed/5 p-4 md:p-6 dark:bg-brandRed/15"
          aria-label="Mandatory disclaimer"
        >
          <h2 className="text-lg font-bold text-brandRed md:text-xl">Important Disclaimer</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700 md:text-base lg:text-lg dark:text-slate-200">{MANDATORY_DISCLAIMER}</p>
        </section>
      </main>
    </>
  );
}
