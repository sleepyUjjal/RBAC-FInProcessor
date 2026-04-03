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
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-white/80 px-5 py-4 backdrop-blur">
      <div>
        <h1 className="text-2xl md:text-3xl">Finance Control Center</h1>
        <p className="text-sm">
          Signed in as <strong>{profileName}</strong> ({user?.rawRole || "User"})
        </p>
      </div>

      <button className="btn-secondary" onClick={handleLogout} type="button">
        Logout
      </button>
    </header>
  );
};

export default Header;

