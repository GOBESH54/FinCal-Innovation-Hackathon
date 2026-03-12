import { memo, useMemo } from "react";
import { formatInrNumber } from "../lib/formatters";
import type { YearlyBreakdownPoint } from "../lib/sipMath";

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
    <section className="app-card" aria-labelledby="timeline-title">
      <div className="mb-4">
        <h2 id="timeline-title" className="card-title">
          Year-by-Year Timeline
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[620px] w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">
            Annual breakdown of invested amount, projected value, and profit.
            All values are illustrative only.
          </caption>
          <thead>
            <tr>
              <th className="rounded-tl-lg bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Year</th>
              <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Invested</th>
              <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Value</th>
              <th className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Profit</th>
              <th className="rounded-tr-lg bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Milestone</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.length === 0 ? (
              <tr>
                <td colSpan={5} className="border-b border-slate-200 px-3 py-3 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  No timeline data yet. Increase investment amount or duration.
                </td>
              </tr>
            ) : (
              breakdown.map((row) => {
                const milestone = milestoneYears.get(row.year);
                return (
                  <tr key={row.year} className={milestone ? "bg-brandBlue/5 dark:bg-brandBlue/20" : "odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/70"}>
                    <td className="border-b border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">{row.year}</td>
                    <td className="border-b border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">{formatInrNumber(row.invested)}</td>
                    <td className="border-b border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">{formatInrNumber(row.value)}</td>
                    <td className="border-b border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">{formatInrNumber(row.profit)}</td>
                    <td className="border-b border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      {milestone ? (
                        <span className="font-semibold text-brandBlue dark:text-blue-300">{getMilestoneLabel(milestone)}</span>
                      ) : (
                        "-"
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
