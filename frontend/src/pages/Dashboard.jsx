import { useAuth } from "../context/useAuth";

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
        <article className="rounded-lg border border-[var(--border)] bg-white p-4">
          <h3 className="mb-2 text-xl">Net Balance</h3>
          <p className="text-sm">Placeholder card for summary API data.</p>
        </article>
        <article className="rounded-lg border border-[var(--border)] bg-white p-4">
          <h3 className="mb-2 text-xl">Income</h3>
          <p className="text-sm">Range-based income metrics will appear here.</p>
        </article>
        <article className="rounded-lg border border-[var(--border)] bg-white p-4">
          <h3 className="mb-2 text-xl">Expense</h3>
          <p className="text-sm">Range-based expense metrics will appear here.</p>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;
