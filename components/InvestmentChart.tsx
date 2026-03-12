import { memo, useEffect, useMemo, useState } from "react";
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

interface InvestmentChartProps {
  breakdown: YearlyBreakdownPoint[];
}

function InvestmentChart({ breakdown }: InvestmentChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

  const axisTickColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#d7e1ee";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#dbe4f1";
  const legendColor = isDark ? "#cbd5e1" : "#475569";

  return (
    <section className="app-card h-full min-w-0" aria-labelledby="chart-title">
      <div className="mb-4">
        <h2 id="chart-title" className="card-title">
          Investment Growth
        </h2>
      </div>
      {chartData.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
          No chart data yet. Increase investment amount or duration.
        </p>
      ) : (
        <div className="h-72 w-full md:h-80 lg:h-[22rem]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 12, left: 2, bottom: 2 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#224c87" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#224c87" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: axisTickColor, fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: axisTickColor, fontSize: 12 }}
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
                  border: `1px solid ${tooltipBorder}`,
                  backgroundColor: tooltipBg,
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.20)",
                }}
                formatter={(value: number, name: string) => [
                  formatInrNumber(value),
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "13px", color: legendColor }} />

              <Area
                type="monotone"
                dataKey="total"
                name="Total Portfolio"
                stroke="#224c87"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="invested"
                name="Invested Amount"
                stroke="#919090"
                strokeWidth={2}
                fill="transparent"
                dot={false}
              />
              <Bar
                dataKey="returns"
                name="Returns Generated"
                fill="#da3832"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                fillOpacity={0.86}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default memo(InvestmentChart);
