import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || "user";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", show: true },
    { to: "/users", label: "Users", show: role === "admin" },
    { to: "/records", label: "Records", show: role === "admin" || role === "analyst" || role === "user" },
    { to: "/logs", label: "Audit Logs", show: role === "admin" },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[rgba(255,251,244,0.78)] p-5 backdrop-blur md:flex md:flex-col">
      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text)]">Premium Suite</p>
        <h2 className="mt-2 text-2xl text-gradient">FinProcessor</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.13em] text-[var(--text)]">RBAC Console</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--gold)] to-[var(--gold-deep)] text-white shadow-lg shadow-[rgba(143,104,44,0.25)]"
                    : "bg-[var(--surface-strong)] text-[var(--text-h)] hover:bg-[var(--surface-muted)]"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--text)]">Signed in role</p>
        <p className="mt-2 text-sm font-semibold text-[var(--text-h)]">{user?.rawRole || "User"}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
