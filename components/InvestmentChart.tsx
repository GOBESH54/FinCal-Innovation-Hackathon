import { memo, useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatInrNumber } from "../lib/formatters";
import type { YearlyBreakdownPoint } from "../lib/sipMath";
import styles from "../styles/calculator.module.css";

interface InvestmentChartProps {
  breakdown: YearlyBreakdownPoint[];
}

function InvestmentChart({ breakdown }: InvestmentChartProps) {
  const chartData = useMemo(
    () =>
      breakdown.map((row) => ({
        year: `Y${row.year}`,
        invested: row.invested,
        returns: row.profit,
        total: row.value,
      })),
    [breakdown]
  );

  return (
    <section className={styles.card} aria-labelledby="chart-title">
      <div className={styles.cardHeader}>
        <h2 id="chart-title" className={styles.cardTitle}>
          Investment Growth
        </h2>
      </div>
      {chartData.length === 0 ? (
        <p className={styles.emptyState}>
          No chart data yet. Increase investment amount or duration.
        </p>
      ) : (
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#224c87" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#224c87" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--table-border)"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-IN", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(value)
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--card-border)",
                  backgroundColor: "var(--surface)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  color: "var(--text-body)",
                }}
                formatter={(value: number, name: string) => [
                  formatInrNumber(value),
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "13px" }} />

              <Area
                type="monotone"
                dataKey="total"
                name="Total Portfolio"
                stroke="#224c87"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={false}
                animationDuration={800}
                isAnimationActive
              />
              <Area
                type="monotone"
                dataKey="invested"
                name="Invested Amount"
                stroke="#919090"
                strokeWidth={2}
                fill="transparent"
                dot={false}
                animationDuration={900}
                isAnimationActive
              />
              <Bar
                dataKey="returns"
                name="Returns Generated"
                fill="var(--accent-red)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                animationDuration={600}
                isAnimationActive
                fillOpacity={0.8}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default memo(InvestmentChart);
