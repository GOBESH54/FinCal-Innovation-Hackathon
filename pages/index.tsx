import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
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
import styles from "../styles/calculator.module.css";

const MANDATORY_DISCLAIMER =
  "This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.";

export default function Home() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(5);
  const [scenarioExtraMonthly, setScenarioExtraMonthly] = useState(1000);
  const [scenarioExtraYears, setScenarioExtraYears] = useState(5);

  const sipResult = useMemo(
    () => calculateSIPFutureValue(monthlyInvestment, sipReturn, sipYears, inflationRate),
    [monthlyInvestment, sipReturn, sipYears, inflationRate]
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
      sipResult.futureValue,
    ]
  );

  const handleResetSip = useCallback(() => {
    setMonthlyInvestment(5000);
    setSipReturn(12);
    setSipYears(10);
    setInflationRate(5);
    setScenarioExtraMonthly(1000);
    setScenarioExtraYears(5);
  }, []);

  return (
    <>
      <Head>
        <title>SIP Learning Planner — Understand SIP Growth In Simple Steps</title>
        <meta
          name="description"
          content="An education-focused SIP calculator that helps you understand compounding, inflation, and long-term investment planning. Not a recommendation for any mutual fund scheme."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#224c87" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeToggle />

      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.badge}>Education-First SIP Tool</p>
          <h1 className={styles.heroTitle}>
            Understand SIP Growth In Simple Steps
          </h1>
          <p className={styles.heroSubtitle}>
            Learn how regular monthly investing, return assumptions, and time
            horizon affect long-term outcomes. All values are illustrative and
            not recommendations.
          </p>
          <p className={styles.heroAssist}>
            No scheme ranking. No product promotion. Just compounding math
            explained clearly.
          </p>
        </section>

        {/* Category Lock */}
        <section
          className={styles.categoryLock}
          aria-label="Category compliance status"
        >
          <h2 className={styles.categoryLockTitle}>
            Competition Category: SIP Calculator
          </h2>
          <p className={styles.categoryLockText}>
            This submission is intentionally locked to one category to comply
            with the rule: one team, one calculator category.
          </p>
        </section>

        {/* Calculator + Chart */}
        <section className={styles.dashboard}>
          <SipCalculator
            monthlyInvestment={monthlyInvestment}
            annualReturn={sipReturn}
            years={sipYears}
            result={sipResult}
            onMonthlyInvestmentChange={setMonthlyInvestment}
            onAnnualReturnChange={setSipReturn}
            onYearsChange={setSipYears}
            onReset={handleResetSip}
          />
          <InvestmentChart breakdown={sipBreakdown} />
        </section>

        {/* Plain-English Summary */}
        <section
          className={styles.insightCard}
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 className={styles.insightTitle}>Plain-English Summary</h2>
          <p className={styles.insightText}>{insightText}</p>

          <div className={styles.enhancementGrid}>
            <article className={styles.enhancementItem}>
              <p className={styles.enhancementLabel}>
                Inflation-Adjusted Value (user-set: {inflationRate}%)
              </p>
              <p className={styles.enhancementValue}>
                {formatInrNumber(sipResult.inflationAdjusted)}
              </p>
            </article>
            <article className={styles.enhancementItem}>
              <p className={styles.enhancementLabel}>
                Return Assumption Band (illustrative)
              </p>
              <p className={styles.enhancementValue}>{returnBand}</p>
            </article>
          </div>

          {/* Editable Inflation Slider */}
          <div style={{ marginTop: "16px" }}>
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

          <p className={styles.disclaimerHint}>
            Mandatory regulatory disclaimer shown below.
          </p>
        </section>

        {/* Educational Insights */}
        <EducationalInsights
          result={sipResult}
          annualReturn={sipReturn}
          years={sipYears}
          inflationRate={inflationRate}
        />

        {/* Scenario Comparison with editable assumptions */}
        <ScenarioComparison
          monthlyInvestment={monthlyInvestment}
          annualReturn={sipReturn}
          years={sipYears}
          inflationRate={inflationRate}
          extraMonthly={scenarioExtraMonthly}
          extraYears={scenarioExtraYears}
          onExtraMonthlyChange={setScenarioExtraMonthly}
          onExtraYearsChange={setScenarioExtraYears}
        />

        {/* Milestone Tracker */}
        <MilestoneTracker
          monthlyInvestment={monthlyInvestment}
          annualReturn={sipReturn}
          years={sipYears}
        />

        {/* How It Works */}
        <section
          className={styles.educationPanel}
          aria-labelledby="education-title"
        >
          <h2 id="education-title" className={styles.educationTitle}>
            How This Calculator Teaches SIP Basics
          </h2>
          <div className={styles.educationGrid}>
            <article className={styles.educationCard}>
              <h3 className={styles.educationCardTitle}>1. Enter Assumptions</h3>
              <p className={styles.educationCardText}>
                Set your monthly amount, expected annual return, and number of
                years. Use the sliders or type in exact values.
              </p>
            </article>
            <article className={styles.educationCard}>
              <h3 className={styles.educationCardTitle}>
                2. Observe Compounding
              </h3>
              <p className={styles.educationCardText}>
                The chart and donut visualize how returns build over time — not
                in a straight line, but exponentially.
              </p>
            </article>
            <article className={styles.educationCard}>
              <h3 className={styles.educationCardTitle}>
                3. Explore Scenarios
              </h3>
              <p className={styles.educationCardText}>
                Use the scenario comparison and milestone tracker to see
                how small changes create big differences.
              </p>
            </article>
          </div>
          <p className={styles.educationNote}>
            Educational note: This tool uses monthly rate = annual rate / 12
            as per the standard SIP formula and does not recommend any specific
            mutual fund or scheme.
          </p>
        </section>

        {/* Assumptions & Formula Disclosure */}
        <section
          className={styles.formulaDisclosure}
          aria-labelledby="formula-disclosure-title"
        >
          <h2
            id="formula-disclosure-title"
            className={styles.formulaDisclosureTitle}
          >
            Assumptions and Formula Disclosure
          </h2>
          <ul className={styles.formulaList}>
            <li className={styles.formulaItem}>
              <strong>Monthly rate:</strong>{" "}
              <code>r = Annual Return Rate / 12</code> (simple division as per
              industry-standard SIP convention)
            </li>
            <li className={styles.formulaItem}>
              <strong>SIP Future Value:</strong>{" "}
              <code>
                FV = P &times; [((1 + r)^n &minus; 1) / r] &times; (1 + r)
              </code>{" "}
              where P = monthly investment, r = monthly rate, n = total months
            </li>
            <li className={styles.formulaItem}>
              <strong>Contribution timing:</strong> Monthly contribution timing
              follows the displayed SIP formula convention, including the{" "}
              <code>&times; (1 + r)</code> factor.
            </li>
            <li className={styles.formulaItem}>
              <strong>User-editable inputs:</strong> Monthly investment amount,
              assumed annual return rate, investment duration, inflation rate,
              scenario comparison deltas (additional monthly amount and
              additional duration)
            </li>
            <li className={styles.formulaItem}>
              <strong>Not modeled:</strong> Taxes, fund management fees, exit
              loads, market volatility path, expense ratios, or any
              scheme-specific parameters
            </li>
            <li className={styles.formulaItem}>
              <strong>Inflation adjustment:</strong>{" "}
              <code>
                Adjusted Value = FV / (1 + inflation%)^years
              </code>{" "}
              — user-editable inflation rate (default 5%)
            </li>
          </ul>
          <p className={styles.formulaNote}>
            All outputs are illustrative and for educational purposes only. They
            do not constitute investment advice or a recommendation for any
            scheme of HDFC Mutual Fund. Actual outcomes may differ based on
            market conditions and other factors.
          </p>
        </section>

        {/* Timeline */}
        <InvestmentTimeline breakdown={sipBreakdown} />

        {/* Mandatory Disclaimer */}
        <section
          className={styles.complianceBanner}
          aria-label="Mandatory disclaimer"
        >
          <h2 className={styles.complianceTitle}>Important Disclaimer</h2>
          <p className={styles.complianceText}>{MANDATORY_DISCLAIMER}</p>
        </section>
      </main>
    </>
  );
}
