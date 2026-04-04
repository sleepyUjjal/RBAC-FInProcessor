import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboardSummary } from "../api/dashboard";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../context/useAuth";

const PERIOD_OPTIONS = [
  { value: "1d", label: "1D" },
  { value: "1h", label: "1H" },
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
  { value: "1y", label: "1Y" },
  { value: "5y", label: "5Y" },
];

const PERIOD_LABELS = {
  "1h": "1 Hour",
  "1d": "1 Day",
  "1w": "1 Week",
  "1m": "1 Month",
  "1y": "1 Year",
  "5y": "5 Years",
};

const PIE_COLORS = ["#14213D", "#FCA311", "#000000", "#415679", "#F7B84A", "#6D7380", "#9FA4AE"];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatCurrency = (value) => {
  const numericValue = Number(value ?? 0);
  if (Number.isNaN(numericValue)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(numericValue);
};

const formatAxisCurrency = (value) => {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return "₹0";
  }

  const absolute = Math.abs(numericValue);
  if (absolute >= 10000000) {
    return `₹${(numericValue / 10000000).toFixed(1)}Cr`;
  }
  if (absolute >= 100000) {
    return `₹${(numericValue / 100000).toFixed(1)}L`;
  }
  if (absolute >= 1000) {
    return `₹${(numericValue / 1000).toFixed(0)}K`;
  }
  return `₹${numericValue.toFixed(0)}`;
};

const normalizeTimeline = (points = []) =>
  points
    .map((point) => ({
      bucket: point?.bucket || point?.label || "",
      label: point?.label || point?.bucket || "-",
      amount: Number(point?.amount ?? 0),
    }))
    .filter((point) => point.bucket && Number.isFinite(point.amount))
    .sort((a, b) => String(a.bucket).localeCompare(String(b.bucket)));

const buildExpensePieData = (categories = []) =>
  categories
    .map((item) => ({
      name: item?.category || "Other",
      value: Number(item?.amount ?? 0),
    }))
    .filter((item) => Number.isFinite(item.value) && item.value > 0);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-h)]">{formatCurrency(value)}</p>
    </div>
  );
};

const PieTooltipCard = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  if (!point) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 shadow-[var(--shadow-sm)]">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text)]">{point.name}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-h)]">{formatCurrency(point.value)}</p>
    </div>
  );
};

const StockTrendCard = ({ title, data, lineColor, fillStart, fillEnd, loading, rangeLabel }) => {
  return (
    <article className="panel-elevated p-4">
      <div className="mb-3">
        <h3 className="text-lg">{title}</h3>
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--text)]">Range: {rangeLabel}</p>
      </div>

      {loading ? (
        <div className="h-[250px] rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm">
          Loading chart...
        </div>
      ) : data.length ? (
        <div className="h-[250px] rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data} margin={{ top: 10, right: 14, left: 6, bottom: 8 }}>
              <defs>
                <linearGradient id={`fill-${title}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={fillStart} stopOpacity={0.32} />
                  <stop offset="95%" stopColor={fillEnd} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(20,33,61,0.14)" strokeDasharray="3 3" />
              <XAxis
                axisLine={false}
                dataKey="label"
                minTickGap={18}
                tick={{ fill: "#4F596A", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#4F596A", fontSize: 11 }}
                tickFormatter={formatAxisCurrency}
                tickLine={false}
                width={58}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                dataKey="amount"
                fill={`url(#fill-${title})`}
                name={title}
                stroke={lineColor}
                strokeWidth={2.2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[250px] rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm">
          No trend data available.
        </div>
      )}
    </article>
  );
};

const ExpensePieCard = ({ data, loading }) => {
  return (
    <article className="panel-elevated p-4">
      <div className="mb-3">
        <h3 className="text-lg">Expense Breakdown</h3>
        <p className="text-xs uppercase tracking-[0.08em] text-[var(--text)]">By Category</p>
      </div>

      {loading ? (
        <div className="h-[250px] rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm">
          Loading pie chart...
        </div>
      ) : data.length ? (
        <div className="h-[250px] rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius={54}
                nameKey="name"
                outerRadius={84}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell fill={PIE_COLORS[index % PIE_COLORS.length]} key={`${entry.name}-${index}`} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltipCard />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[250px] rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm">
          No expense category data available.
        </div>
      )}
    </article>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedRange, setSelectedRange] = useState("1d");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadSummary = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboardSummary(
          {
            incomeRange: selectedRange,
            expenseRange: selectedRange,
            investmentRange: selectedRange,
          },
          { signal: controller.signal }
        );

        if (isMounted) {
          setSummary(response);
        }
      } catch (requestError) {
        if (!isMounted || requestError?.name === "AbortError") {
          return;
        }
        setError(requestError?.message || "Unable to load dashboard summary.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedRange, refreshCounter]);

  const netBalance = Number(summary?.net_balance ?? 0);
  const incomeTotal = Number(summary?.income?.total ?? 0);
  const expenseTotal = Number(summary?.expense?.total ?? 0);
  const investmentTotal = Number(summary?.investment?.total ?? 0);
  const selectedRangeLabel = PERIOD_LABELS[selectedRange] || selectedRange.toUpperCase();

  const incomeTimeline = useMemo(() => normalizeTimeline(summary?.income?.timeline), [summary]);
  const expenseTimeline = useMemo(() => normalizeTimeline(summary?.expense?.timeline), [summary]);
  const investmentTimeline = useMemo(() => normalizeTimeline(summary?.investment?.timeline), [summary]);
  const expensePieData = useMemo(() => buildExpensePieData(summary?.expense?.categories), [summary]);

  return (
    <section className="glass-panel mx-auto max-w-6xl p-8 md:p-10 fade-in-up">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="mb-2 text-3xl">Dashboard</h2>
          <p className="text-sm">
            Welcome back, <strong>{user?.name || user?.email}</strong>.
          </p>
          {summary?.server_time ? (
            <p className="mt-1 text-xs text-[var(--text)]">
              Server time: {new Date(summary.server_time).toLocaleString()}
            </p>
          ) : null}
        </div>

        <button
          className="btn-secondary px-4 py-2 text-sm"
          onClick={() => setRefreshCounter((current) => current + 1)}
          type="button"
        >
          Refresh
        </button>
      </div>

      <article className="panel-elevated mb-6 p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl">Graphs</h3>
            <p className="text-sm text-[var(--text)]">
              Stock-style trend charts for Income, Expense, Investment + expense category pie chart.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const active = selectedRange === option.value;
              return (
                <button
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                    active
                      ? "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-white shadow-[var(--shadow-sm)]"
                      : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-h)] hover:bg-[var(--surface-muted)]"
                  }`}
                  key={option.value}
                  onClick={() => setSelectedRange(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StockTrendCard
            data={incomeTimeline}
            fillEnd="#14213D"
            fillStart="#14213D"
            lineColor="#14213D"
            loading={loading}
            rangeLabel={selectedRangeLabel}
            title="Income"
          />
          <StockTrendCard
            data={expenseTimeline}
            fillEnd="#000000"
            fillStart="#000000"
            lineColor="#000000"
            loading={loading}
            rangeLabel={selectedRangeLabel}
            title="Expense"
          />
          <StockTrendCard
            data={investmentTimeline}
            fillEnd="#FCA311"
            fillStart="#FCA311"
            lineColor="#FCA311"
            loading={loading}
            rangeLabel={selectedRangeLabel}
            title="Investment"
          />
          <ExpensePieCard data={expensePieData} loading={loading} />
        </div>
      </article>

      {error ? (
        <div className="alert-error mb-6 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          subtitle={`Range: ${selectedRangeLabel}`}
          title="Net Balance"
          trend={netBalance >= 0 ? "Positive Balance" : "Negative Balance"}
          trendDirection={netBalance >= 0 ? "up" : "down"}
          value={formatCurrency(netBalance)}
        />
        <StatsCard
          subtitle={`Range: ${selectedRangeLabel}`}
          title="Income"
          trend="Tracked by selected period"
          trendDirection="up"
          value={formatCurrency(incomeTotal)}
        />
        <StatsCard
          subtitle={`Range: ${selectedRangeLabel}`}
          title="Expense"
          trend="Tracked by selected period"
          trendDirection="down"
          value={formatCurrency(expenseTotal)}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StatsCard
          subtitle={`Range: ${selectedRangeLabel}`}
          title="Investment"
          trend="Tracked by selected period"
          trendDirection="neutral"
          value={formatCurrency(investmentTotal)}
        />
        <article className="panel-elevated p-4">
          <h3 className="mb-2 text-xl">Summary</h3>
          <p className="text-sm">
            Income {formatCurrency(incomeTotal)} - Expense {formatCurrency(expenseTotal)} = Net{" "}
            {formatCurrency(netBalance)}
          </p>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
