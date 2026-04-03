import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="glass-panel mx-auto max-w-5xl p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="mb-2 text-3xl">Dashboard</h2>
            <p className="text-sm">
              Signed in as <strong>{user?.email}</strong> ({user?.rawRole || "User"})
            </p>
          </div>
          <button className="btn-secondary" onClick={logout} type="button">
            Logout
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Link className="btn-secondary text-center" to="/dashboard">
            Dashboard
          </Link>
          <Link className="btn-secondary text-center" to="/users">
            Users
          </Link>
          <Link className="btn-secondary text-center" to="/records">
            Records
          </Link>
          <Link className="btn-secondary text-center" to="/logs">
            Audit Logs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

