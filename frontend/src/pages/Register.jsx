import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "User",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.");
      return;
    }

    setSubmitting(true);

    try {
      await register(formData);
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError?.message || "Unable to register right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 fade-in-up">
      <div className="glass-panel w-full max-w-lg p-8 md:p-10">
        <div className="mb-4 flex justify-end">
          <Link className="btn-secondary px-4 py-2 text-sm" to="/">
            Back to Home
          </Link>
        </div>
        <p className="text-center text-xs uppercase tracking-[0.18em] text-[var(--text)]">Onboard Securely</p>
        <h2 className="mb-2 mt-3 text-center text-3xl">Create Account</h2>
        <p className="mb-7 text-center text-sm">Register as a User.</p>

        {error ? (
          <div className="alert-error mb-4 p-3 text-sm">
            {error}
          </div>
        ) : null}

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            name="first_name"
            onChange={handleChange}
            placeholder="First name"
            type="text"
            value={formData.first_name}
          />
          <input
            name="last_name"
            onChange={handleChange}
            placeholder="Last name"
            type="text"
            value={formData.last_name}
          />
          <input
            className="md:col-span-2"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
            type="email"
            value={formData.email}
          />
          <div className="relative md:col-span-2">
            <input
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              type={showPassword ? "text" : "password"}
              value={formData.password}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-[var(--text-h)] focus:outline-none transition-colors"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="User">User</option>
          </select>
          <button className="btn-primary" disabled={submitting} type="submit">
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link className="text-gradient" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
