import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Header = ({ onMenuToggle }) => {
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
    <header className="fixed left-0 right-0 top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-[rgba(252,247,240,0.9)] px-5 py-4 shadow-[var(--shadow-sm)] backdrop-blur transition-all duration-300 min-[900px]:left-56 min-[1200px]:left-72">
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle menu"
          className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-[var(--surface-muted)] min-[900px]:hidden"
          onClick={onMenuToggle}
          type="button"
        >
          <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" w="24">
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </button>
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text)]">Financial Operations</p>
          <h1 className="mt-1 text-2xl md:text-3xl">Control Center</h1>
          <p className="mt-1 hidden text-sm text-[var(--text)] sm:block">
            Signed in as <strong>{profileName}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 md:flex">
          <Link
            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-h)] hover:bg-[var(--surface-muted)]"
            to="/#mission"
          >
            Mission
          </Link>
          <Link
            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-h)] hover:bg-[var(--surface-muted)]"
            to="/contact"
          >
            Contact
          </Link>
          <Link
            className="rounded-full border border-[var(--gold)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--gold)] transition-colors hover:bg-[var(--surface-muted)]"
            to="/docs"
          >
            API Docs
          </Link>
        </div>
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
