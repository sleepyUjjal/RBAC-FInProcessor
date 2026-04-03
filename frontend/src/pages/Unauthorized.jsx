import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-panel w-full max-w-xl p-8 text-center">
        <h2 className="mb-3 text-3xl">Unauthorized</h2>
        <p className="mb-6">
          You do not have permission to access this page with your current role.
        </p>
        <div className="flex justify-center gap-3">
          <Link className="btn-primary" to="/dashboard">
            Back to Dashboard
          </Link>
          <Link className="btn-secondary" to="/">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

