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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-panel w-full max-w-lg p-8">
        <h2 className="mb-4 text-center text-3xl">Create Account</h2>
        <p className="mb-6 text-center text-sm">Register with allowed roles: User or Viewer.</p>

        {error ? (
          <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
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

