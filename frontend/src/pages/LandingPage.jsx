import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LandingPage = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-gradient">RBAC-FInProcessor</h1>
      <p className="max-w-2xl text-base md:text-lg">
        Secure finance platform with role-based access control for Dashboard, User Management,
        Records, and Audit Logs.
      </p>

      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm md:text-base">
            Logged in as <strong>{user?.name || user?.email}</strong> ({user?.rawRole || "User"})
          </p>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <button className="btn-secondary" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn-secondary">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

