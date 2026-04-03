import { useAuth } from "../context/useAuth";
import StatsCard from "../components/StatsCard";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <section className="glass-panel mx-auto max-w-5xl p-8">
      <h2 className="mb-2 text-3xl">Dashboard</h2>
      <p className="mb-8 text-sm">
        Welcome back, <strong>{user?.name || user?.email}</strong>. Dashboard API integration
        comes in Step 7.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          subtitle="Placeholder card for summary API data."
          title="Net Balance"
          trend="+12.4%"
          trendDirection="up"
          value="₹0.00"
        />
        <StatsCard
          subtitle="Range-based income metrics will appear here."
          title="Income"
          trend="+8.1%"
          trendDirection="up"
          value="₹0.00"
        />
        <StatsCard
          subtitle="Range-based expense metrics will appear here."
          title="Expense"
          trend="-2.7%"
          trendDirection="down"
          value="₹0.00"
        />
      </div>
    </section>
  );
};

export default Dashboard;
