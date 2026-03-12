import { memo, useMemo } from "react";
import { formatYearsMonths } from "../lib/formatters";
import { calculateMilestones } from "../lib/sipMath";
import type { MilestoneResult } from "../lib/sipMath";
import styles from "../styles/calculator.module.css";

interface MilestoneTrackerProps {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
}

function MilestoneTracker({
  monthlyInvestment,
  annualReturn,
  years,
}: MilestoneTrackerProps) {
  const milestones: MilestoneResult[] = useMemo(
    () => calculateMilestones(monthlyInvestment, annualReturn, years),
    [monthlyInvestment, annualReturn, years]
  );

  const totalMonths = Math.round(years * 12);

  return (
    <section className={styles.card} aria-labelledby="milestone-title">
      <div className={styles.cardHeader}>
        <h2 id="milestone-title" className={styles.cardTitle}>
          Milestone Tracker
        </h2>
      </div>

      <div className={styles.milestoneGrid}>
        {milestones.map((m) => {
          const progress = m.monthReached
            ? Math.min(100, (m.monthReached / totalMonths) * 100)
            : 0;

          return (
            <article
              key={m.amount}
              className={`${styles.milestoneCard} ${
                m.reached
                  ? styles.milestoneReached
                  : styles.milestoneUnreached
              }`}
            >
              {m.reached && (
                <span className={styles.milestoneCheck} aria-hidden="true">
                  ✓
                </span>
              )}
              <p className={styles.milestoneAmount}>{m.label}</p>
              <p className={styles.milestoneTime}>
                {m.reached && m.monthReached
                  ? `Reached in ${formatYearsMonths(m.monthReached)}`
                  : "Not reached in this plan"}
              </p>
              {m.reached && (
                <div
                  className={styles.milestoneProgress}
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${m.label} reached at ${Math.round(progress)}% of investment duration`}
                >
                  <div
                    className={styles.milestoneProgressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default memo(MilestoneTracker);
