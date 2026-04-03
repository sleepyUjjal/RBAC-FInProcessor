import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || "user";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", show: true },
    { to: "/users", label: "Users", show: role === "admin" },
    { to: "/records", label: "Records", show: role === "admin" || role === "analyst" },
    { to: "/logs", label: "Audit Logs", show: role === "admin" },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-white/70 p-4 backdrop-blur md:flex md:flex-col">
      <div className="mb-6 px-2">
        <h2 className="text-2xl text-gradient">FinProcessor</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.12em]">RBAC Console</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--gold)] text-white shadow-sm"
                    : "bg-white text-[var(--text-h)] hover:bg-[var(--lavender)]"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

