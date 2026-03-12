import { memo, useMemo } from "react";
import { formatYearsMonths } from "../lib/formatters";
import { calculateMilestones } from "../lib/sipMath";
import type { MilestoneResult } from "../lib/sipMath";

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
    <section className="app-card" aria-labelledby="milestone-title">
      <div className="mb-4">
        <h2 id="milestone-title" className="card-title">
          Milestone Tracker
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {milestones.map((m) => {
          const progress = m.monthReached
            ? Math.min(100, (m.monthReached / totalMonths) * 100)
            : 0;

          return (
            <article
              key={m.amount}
              className={`relative rounded-xl border p-4 text-center ${
                m.reached
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-900/30"
                  : "border-slate-200 bg-slate-50 opacity-80 dark:border-slate-700 dark:bg-slate-800/80"
              }`}
            >
              {m.reached && (
                <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden="true">
                  {"\u2713"}
                </span>
              )}
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">{m.label}</p>
              <p className="mt-1 text-xs font-medium text-slate-600 md:text-sm dark:text-slate-300">
                {m.reached && m.monthReached
                  ? `Reached in ${formatYearsMonths(m.monthReached)}`
                  : "Not reached in this plan"}
              </p>
              {m.reached && (
                <div
                  className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${m.label} reached at ${Math.round(progress)}% of investment duration`}
                >
                  <div
                    className="h-full rounded-full bg-emerald-600"
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
