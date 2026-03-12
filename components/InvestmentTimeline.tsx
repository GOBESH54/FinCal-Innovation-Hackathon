import { memo, useMemo } from "react";
import { formatInrNumber } from "../lib/formatters";
import type { YearlyBreakdownPoint } from "../lib/sipMath";
import styles from "../styles/calculator.module.css";

interface InvestmentTimelineProps {
  breakdown: YearlyBreakdownPoint[];
}

const MILESTONE_THRESHOLDS = [100000, 500000, 1000000, 2500000, 5000000, 10000000];

function InvestmentTimeline({ breakdown }: InvestmentTimelineProps) {
  const milestoneYears = useMemo(() => {
    const crossed = new Set<number>();
    const milestoneMap = new Map<number, number>();

    for (const row of breakdown) {
      for (const threshold of MILESTONE_THRESHOLDS) {
        if (!crossed.has(threshold) && row.value >= threshold) {
          crossed.add(threshold);
          milestoneMap.set(row.year, threshold);
        }
      }
    }

    return milestoneMap;
  }, [breakdown]);

  const getMilestoneLabel = (amount: number): string => {
    if (amount >= 10000000) return "1 Cr crossed";
    if (amount >= 5000000) return "50L crossed";
    if (amount >= 2500000) return "25L crossed";
    if (amount >= 1000000) return "10L crossed";
    if (amount >= 500000) return "5L crossed";
    return "1L crossed";
  };

  return (
    <section className={styles.card} aria-labelledby="timeline-title">
      <div className={styles.cardHeader}>
        <h2 id="timeline-title" className={styles.cardTitle}>
          Year-by-Year Timeline
        </h2>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.timelineTable}>
          <caption className={styles.srOnly}>
            Annual breakdown of invested amount, projected value, and profit.
            All values are illustrative only.
          </caption>
          <thead>
            <tr>
              <th>Year</th>
              <th>Invested</th>
              <th>Value</th>
              <th>Profit</th>
              <th>Milestone</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  No timeline data yet. Increase investment amount or duration.
                </td>
              </tr>
            ) : (
              breakdown.map((row) => {
                const milestone = milestoneYears.get(row.year);
                return (
                  <tr
                    key={row.year}
                    className={milestone ? styles.milestoneRow : undefined}
                  >
                    <td>{row.year}</td>
                    <td>{formatInrNumber(row.invested)}</td>
                    <td>{formatInrNumber(row.value)}</td>
                    <td>{formatInrNumber(row.profit)}</td>
                    <td>
                      {milestone ? (
                        <span className={styles.milestoneIcon}>
                          {getMilestoneLabel(milestone)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default memo(InvestmentTimeline);
