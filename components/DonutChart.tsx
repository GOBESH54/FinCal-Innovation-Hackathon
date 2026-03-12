import { memo, useMemo } from "react";
import { formatCompactInrNumber } from "../lib/formatters";
import styles from "../styles/calculator.module.css";

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
    <div className={styles.donutSection}>
      <div className={styles.donutWrapper}>
        <svg
          className={styles.donutSvg}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-label={`Investment breakdown: ${investedPercent}% invested, ${returnsPercent}% returns`}
          role="img"
        >
          {/* Background circle */}
          <circle
            className={styles.donutCircleBg}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
          />
          {/* Invested arc */}
          <circle
            className={styles.donutCircleInvested}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE - investedAngle}
            strokeLinecap="round"
          />
          {/* Returns arc */}
          <circle
            className={styles.donutCircleReturns}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE - returnsAngle}
            strokeLinecap="round"
            style={{
              transform: `rotate(${(investedAngle / CIRCUMFERENCE) * 360}deg)`,
              transformOrigin: "center",
            }}
          />
        </svg>
        {/* Center text */}
        <div className={styles.donutCenter}>
          <span className={styles.donutCenterLabel}>Total Value</span>
          <span className={styles.donutCenterValue}>
            {formatCompactInrNumber(total)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.donutLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotInvested}`} />
          <span>
            Invested{" "}
            <span className={styles.legendValue}>{investedPercent}%</span>
          </span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotReturns}`} />
          <span>
            Returns{" "}
            <span className={styles.legendValue}>{returnsPercent}%</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(DonutChart);
