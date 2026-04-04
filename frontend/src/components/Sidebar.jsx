import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || "user";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", show: true },
    { to: "/users", label: "Users", show: role === "admin" },
    { to: "/records", label: "Records", show: role === "admin" || role === "analyst" || role === "user" },
    { to: "/logs", label: "Audit Logs", show: role === "admin" },
  ];

  const visibleNavItems = navItems.filter((item) => item.show);

  return (
    <>
      <aside className="hidden shrink-0 flex-col border-r border-[var(--border)] bg-[rgba(255,251,244,0.78)] backdrop-blur transition-all duration-300 min-[900px]:flex min-[900px]:w-56 min-[900px]:p-4 min-[1200px]:w-72 min-[1200px]:p-5">
        <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 min-[1200px]:mb-8 min-[1200px]:p-4">
          <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text)] min-[1200px]:text-[0.68rem]">Premium Suite</p>
          <h2 className="mt-1 text-lg tracking-tight font-bold text-gradient min-[1200px]:mt-2 min-[1200px]:tracking-normal min-[1200px]:text-2xl whitespace-nowrap">FinProcessor</h2>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.13em] text-[var(--text)] min-[1200px]:text-xs">RBAC Console</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 min-[1200px]:gap-2">
          {visibleNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-xl px-3 py-2.5 text-sm font-medium transition min-[1200px]:px-4 min-[1200px]:py-3 ${
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

        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 min-[1200px]:mt-6 min-[1200px]:p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text)] min-[1200px]:text-xs">Signed in role</p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-h)] min-[1200px]:mt-2">{user?.rawRole || "User"}</p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity min-[900px]:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-2xl transition-transform duration-300 ease-in-out min-[900px]:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text)]">Premium Suite</p>
            <h2 className="mt-1 text-xl font-bold text-gradient">FinProcessor</h2>
          </div>
          <button
            className="-mr-2 rounded-lg p-2 text-[var(--text)] hover:bg-[var(--surface-muted)]"
            onClick={onClose}
            type="button"
          >
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {visibleNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--gold)] to-[var(--gold-deep)] text-white shadow-lg shadow-[rgba(143,104,44,0.25)]"
                    : "bg-[var(--surface-strong)] text-[var(--text-h)] hover:bg-[var(--surface-muted)]"
                }`
              }
              key={`mobile-${item.to}`}
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
    </>
  );
};

export default Sidebar;
