import { memo, useMemo } from "react";
import { formatCompactInrNumber } from "../lib/formatters";

interface DonutChartProps {
  invested: number;
  returns: number;
}

const SIZE = 200;
const STROKE = 24;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function DonutChart({ invested, returns }: DonutChartProps) {
  const total = invested + returns;

  const investedAngle = useMemo(() => {
    if (total <= 0) return 0;
    return (invested / total) * CIRCUMFERENCE;
  }, [invested, total]);

  const returnsAngle = useMemo(() => {
    if (total <= 0) return 0;
    return (returns / total) * CIRCUMFERENCE;
  }, [returns, total]);

  const investedPercent = total > 0 ? Math.round((invested / total) * 100) : 0;
  const returnsPercent = total > 0 ? 100 - investedPercent : 0;

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        <svg
          className="h-40 w-40 -rotate-90 sm:h-48 sm:w-48"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-label={`Investment breakdown: ${investedPercent}% invested, ${returnsPercent}% returns`}
          role="img"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            className="fill-none stroke-brandBlue/15"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE - investedAngle}
            strokeLinecap="round"
            className="fill-none stroke-brandBlue transition-all duration-700"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE - returnsAngle}
            strokeLinecap="round"
            className="fill-none stroke-brandRed transition-all duration-700"
            style={{
              transform: `rotate(${(investedAngle / CIRCUMFERENCE) * 360}deg)`,
              transformOrigin: "center",
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total Value
          </span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatCompactInrNumber(total)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brandBlue" />
          <span>Invested <strong>{investedPercent}%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brandRed" />
          <span>Returns <strong>{returnsPercent}%</strong></span>
        </div>
      </div>
    </div>
  );
}

export default memo(DonutChart);
