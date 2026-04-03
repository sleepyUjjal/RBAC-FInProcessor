import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboard";
import { useAuth } from "../context/useAuth";
import StatsCard from "../components/StatsCard";

const PERIOD_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "1h", label: "1 Hour" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "1y", label: "1 Year" },
  { value: "5y", label: "5 Years" },
];

const PERIOD_LABELS = PERIOD_OPTIONS.reduce((accumulator, option) => {
  accumulator[option.value] = option.label;
  return accumulator;
}, {});

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

const DashboardCategoryPanel = ({ title, categories = [] }) => {
  return (
    <article className="panel-elevated p-4">
      <h3 className="mb-3 text-xl">{title}</h3>
      {categories.length ? (
        <ul className="space-y-2">
          {categories.slice(0, 5).map((categoryItem, index) => (
            <li className="flex items-center justify-between text-sm" key={`${categoryItem.category}-${index}`}>
              <span>{categoryItem.category}</span>
              <strong>{formatCurrency(categoryItem.amount)}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text)]">No data available for the selected range.</p>
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
  const [ranges, setRanges] = useState({
    incomeRange: "all",
    expenseRange: "all",
    investmentRange: "all",
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadSummary = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboardSummary(ranges, { signal: controller.signal });
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
  }, [ranges, refreshCounter]);

  const netBalance = Number(summary?.net_balance ?? 0);
  const incomeTotal = Number(summary?.income?.total ?? 0);
  const expenseTotal = Number(summary?.expense?.total ?? 0);
  const investmentTotal = Number(summary?.investment?.total ?? 0);

  const handleRangeChange = (field) => (event) => {
    const value = event.target.value;
    setRanges((current) => ({
      ...current,
      [field]: value,
    }));
  };

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

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span>Income Range</span>
          <select onChange={handleRangeChange("incomeRange")} value={ranges.incomeRange}>
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>Expense Range</span>
          <select onChange={handleRangeChange("expenseRange")} value={ranges.expenseRange}>
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>Investment Range</span>
          <select onChange={handleRangeChange("investmentRange")} value={ranges.investmentRange}>
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="alert-error mb-6 p-3 text-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="panel-elevated mb-8 p-6 text-sm">
          Loading dashboard summary...
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          subtitle={`Range: ${PERIOD_LABELS[summary?.income?.period] || PERIOD_LABELS[ranges.incomeRange]}`}
          title="Net Balance"
          trend={netBalance >= 0 ? "Positive Balance" : "Negative Balance"}
          trendDirection={netBalance >= 0 ? "up" : "down"}
          value={formatCurrency(netBalance)}
        />
        <StatsCard
          subtitle={`Range: ${PERIOD_LABELS[summary?.income?.period] || PERIOD_LABELS[ranges.incomeRange]}`}
          title="Income"
          trend="Tracked by selected period"
          trendDirection="up"
          value={formatCurrency(incomeTotal)}
        />
        <StatsCard
          subtitle={`Range: ${PERIOD_LABELS[summary?.expense?.period] || PERIOD_LABELS[ranges.expenseRange]}`}
          title="Expense"
          trend="Tracked by selected period"
          trendDirection="down"
          value={formatCurrency(expenseTotal)}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StatsCard
          subtitle={`Range: ${PERIOD_LABELS[summary?.investment?.period] || PERIOD_LABELS[ranges.investmentRange]}`}
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

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <DashboardCategoryPanel categories={summary?.income?.categories || []} title="Top Income Categories" />
        <DashboardCategoryPanel
          categories={summary?.expense?.categories || []}
          title="Top Expense Categories"
        />
        <DashboardCategoryPanel
          categories={summary?.investment?.categories || []}
          title="Top Investment Categories"
        />
      </div>
    </section>
  );
};

export default Dashboard;
