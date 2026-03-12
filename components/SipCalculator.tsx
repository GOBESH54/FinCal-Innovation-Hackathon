import { memo, useEffect, useRef, useState } from "react";
import NumericSliderInput from "./NumericSliderInput";
import DonutChart from "./DonutChart";
import { formatInrNumber } from "../lib/formatters";
import type { SipResult } from "../lib/sipMath";
import styles from "../styles/calculator.module.css";

interface SipCalculatorProps {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  result: SipResult;
  onMonthlyInvestmentChange: (value: number) => void;
  onAnnualReturnChange: (value: number) => void;
  onYearsChange: (value: number) => void;
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
  result,
  onMonthlyInvestmentChange,
  onAnnualReturnChange,
  onYearsChange,
  onReset,
}: SipCalculatorProps) {
  const investedAnimated = useAnimatedNumber(result.totalInvested);
  const gainsAnimated = useAnimatedNumber(result.totalGains);
  const futureAnimated = useAnimatedNumber(result.futureValue);

  return (
    <section className={styles.card} aria-labelledby="sip-calculator-title">
      <div className={styles.cardHeader}>
        <div className={styles.titleWithTooltip}>
          <h2 id="sip-calculator-title" className={styles.cardTitle}>
            SIP Calculator
          </h2>
          <button
            type="button"
            className={styles.tooltipTrigger}
            aria-label="SIP info"
            aria-describedby="sip-term-tooltip"
          >
            i
            <span
              id="sip-term-tooltip"
              role="tooltip"
              className={styles.tooltipContent}
            >
              SIP (Systematic Investment Plan) is a method of investing a fixed
              amount regularly in mutual funds. It helps build wealth over time
              through the power of compounding.
            </span>
          </button>
        </div>
        <button className={styles.ghostButton} type="button" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className={styles.inputGroup}>
        <NumericSliderInput
          id="monthlyInvestment"
          label="Monthly Investment"
          min={0}
          max={500000}
          step={500}
          value={monthlyInvestment}
          onChange={onMonthlyInvestmentChange}
          prefix="₹"
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
          tooltipText="How long you plan to continue investing. Longer durations dramatically increase returns due to compounding — money earns returns on returns."
        />
      </div>

      {/* Result Cards */}
      <div
        className={styles.resultGrid}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <article className={styles.resultCard}>
          <p className={styles.resultLabel}>Total Invested</p>
          <p className={styles.resultValue}>
            {formatInrNumber(investedAnimated)}
          </p>
        </article>
        <article className={styles.resultCard}>
          <p className={styles.resultLabel}>Est. Returns</p>
          <p className={styles.resultValue}>
            {formatInrNumber(gainsAnimated)}
          </p>
        </article>
        <article className={`${styles.resultCard} ${styles.resultCardAccent}`}>
          <p className={styles.resultLabel}>Future Value</p>
          <p className={styles.resultValue}>
            {formatInrNumber(futureAnimated)}
          </p>
        </article>
      </div>

      {/* Donut Chart */}
      <DonutChart invested={result.totalInvested} returns={result.totalGains} />
    </section>
  );
}

export default memo(SipCalculator);
