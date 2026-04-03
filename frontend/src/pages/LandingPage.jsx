import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-lg">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-gradient">RBAC-FInProcessor</h1>
      <p className="max-w-2xl text-base md:text-lg">
        Secure finance platform with role-based access control for Dashboard, User Management,
        Records, and Audit Logs.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn-secondary">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
