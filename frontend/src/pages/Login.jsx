import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError?.message || "Unable to login. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 fade-in-up">
      <div className="glass-panel w-full max-w-md p-8 md:p-10">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--text)]">Welcome Back</p>
        <h2 className="mb-2 mt-3 text-center text-3xl">Login</h2>
        <p className="mb-7 text-center text-sm">Use your RBAC-FInProcessor account credentials.</p>

        {error ? (
          <div className="alert-error mb-4 p-3 text-sm">
            {error}
          </div>
        ) : null}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
          <button className="btn-primary mt-1" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm">
          New user?{" "}
          <Link className="text-gradient" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
