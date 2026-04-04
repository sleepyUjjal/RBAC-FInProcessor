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

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
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
        <p className="mb-7 text-center text-sm">Register with allowed roles: User or Viewer.</p>

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
          <input
            className="md:col-span-2"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            type="password"
            value={formData.password}
          />
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="User">User</option>
            <option value="Viewer">Viewer</option>
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
