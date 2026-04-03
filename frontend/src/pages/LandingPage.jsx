import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 fade-in-up">
        <p className="text-lg">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 fade-in-up">
      <section className="glass-panel w-full max-w-5xl p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text)]">Premium Financial Workspace</p>
        <h1 className="mt-4 text-gradient">RBAC-FInProcessor</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
          A polished command center for secure finance operations with role-aware access, detailed logs,
          and fast insights built for modern teams.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link to="/login" className="btn-primary">
            Enter Workspace
          </Link>
          <Link to="/register" className="btn-secondary">
            Create Account
          </Link>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <div className="panel-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Role Control</p>
            <p className="mt-2 text-sm">Admin, Analyst, Viewer flows with route-level protection.</p>
          </div>
          <div className="panel-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Audit Confidence</p>
            <p className="mt-2 text-sm">Centralized logs and transparent activity trails.</p>
          </div>
          <div className="panel-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Fast Insights</p>
            <p className="mt-2 text-sm">Live dashboard summaries with rich range filters.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
