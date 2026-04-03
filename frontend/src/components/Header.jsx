import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileName = useMemo(() => {
    if (!user) {
      return "Guest";
    }
    return user.name || user.email || "User";
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-[rgba(252,247,240,0.9)] px-5 py-4 backdrop-blur">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text)]">Financial Operations</p>
        <h1 className="mt-1 text-2xl md:text-3xl">Control Center</h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Signed in as <strong>{profileName}</strong>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
          {user?.rawRole || "User"}
        </span>
        <button className="btn-secondary" onClick={handleLogout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
