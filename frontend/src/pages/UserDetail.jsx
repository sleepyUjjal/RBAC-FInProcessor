import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createUser, getUserById, patchUser, updateUser } from "../api/users";
import FeedbackToast from "../components/FeedbackToast";

const DEFAULT_FORM = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  role: "User",
  is_active: true,
};

const ROLE_OPTIONS = ["Admin", "Analyst", "User"];

const buildApiErrorMessage = (error) => {
  const data = error?.data;

  if (!data) {
    return error?.message || "Unable to save user.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object") {
    const fieldMessages = Object.entries(data)
      .map(([field, value]) => {
        if (Array.isArray(value)) {
          return `${field}: ${value.join(", ")}`;
        }
        if (typeof value === "string") {
          return `${field}: ${value}`;
        }
        return null;
      })
      .filter(Boolean);

    if (fieldMessages.length) {
      return fieldMessages.join(" | ");
    }
  }

  return error?.message || "Unable to save user.";
};

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isCreateMode = userId === "new";

  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [updateMode, setUpdateMode] = useState("patch");
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (isCreateMode) {
      setLoading(false);
      setForm(DEFAULT_FORM);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadUser = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getUserById(userId, { signal: controller.signal });
        if (!isMounted) {
          return;
        }
        setForm({
          email: response?.email || "",
          first_name: response?.first_name || "",
          last_name: response?.last_name || "",
          password: "",
          role: response?.role || "User",
          is_active: Boolean(response?.is_active ?? true),
        });
      } catch (requestError) {
        if (!isMounted || requestError?.name === "AbortError") {
          return;
        }
        setError(buildApiErrorMessage(requestError));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isCreateMode, userId]);

  const closeToast = () => {
    setToast((current) => ({ ...current, isVisible: false }));
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayload = () => {
    const payload = {
      email: form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      role: form.role,
      is_active: form.is_active,
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = buildPayload();

    try {
      if (isCreateMode) {
        await createUser(payload);
        setToast({
          isVisible: true,
          title: "User Created",
          message: `${payload.email} created successfully.`,
          type: "success",
        });
      } else if (updateMode === "put") {
        await updateUser(userId, payload);
        setToast({
          isVisible: true,
          title: "User Updated (PUT)",
          message: `${payload.email || "User"} saved successfully.`,
          type: "success",
        });
      } else {
        await patchUser(userId, payload);
        setToast({
          isVisible: true,
          title: "User Updated (PATCH)",
          message: `${payload.email || "User"} saved successfully.`,
          type: "success",
        });
      }

      window.setTimeout(() => {
        navigate("/users", { replace: true });
      }, 600);
    } catch (requestError) {
      setError(buildApiErrorMessage(requestError));
      setToast({
        isVisible: true,
        title: "Save Failed",
        message: buildApiErrorMessage(requestError),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="glass-panel mx-auto max-w-4xl p-8 md:p-10 fade-in-up">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="mb-1 text-3xl">{isCreateMode ? "Create User" : "Update User"}</h2>
          <p className="text-sm">
            {isCreateMode
              ? "Create a new user account."
              : "Edit user fields and save via PATCH or PUT."}
          </p>
        </div>
        <Link className="btn-secondary px-4 py-2 text-sm" to="/users">
          Back to Users
        </Link>
      </div>

      {loading ? (
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm">
          Loading user details...
        </div>
      ) : (
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Email</label>
            <input
              name="email"
              onChange={handleChange}
              placeholder="user@example.com"
              required={isCreateMode}
              type="email"
              value={form.email}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">First Name</label>
            <input
              name="first_name"
              onChange={handleChange}
              placeholder="First name"
              type="text"
              value={form.first_name}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Last Name</label>
            <input
              name="last_name"
              onChange={handleChange}
              placeholder="Last name"
              type="text"
              value={form.last_name}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Password {isCreateMode ? "(required)" : "(optional)"}
            </label>
            <input
              name="password"
              onChange={handleChange}
              placeholder={isCreateMode ? "Set password" : "Leave blank to keep unchanged"}
              required={isCreateMode}
              type="password"
              value={form.password}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Role</label>
            <select name="role" onChange={handleChange} value={form.role}>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <label className="md:col-span-2 flex items-center gap-2 text-sm">
            <input
              checked={form.is_active}
              name="is_active"
              onChange={handleChange}
              type="checkbox"
            />
            Mark user as active
          </label>

          {!isCreateMode ? (
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm">Update Method</label>
              <select onChange={(event) => setUpdateMode(event.target.value)} value={updateMode}>
                <option value="patch">PATCH (partial update)</option>
                <option value="put">PUT (full update)</option>
              </select>
            </div>
          ) : null}

          {error ? (
            <div className="alert-error md:col-span-2 p-3 text-sm">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2 flex items-center gap-3">
            <button className="btn-primary px-5 py-2.5" disabled={saving} type="submit">
              {saving ? "Saving..." : isCreateMode ? "Create User" : "Save Changes"}
            </button>
            <button
              className="btn-secondary px-5 py-2.5"
              onClick={() => navigate("/users")}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <FeedbackToast
        isVisible={toast.isVisible}
        message={toast.message}
        onClose={closeToast}
        title={toast.title}
        type={toast.type}
      />
    </section>
  );
};

export default UserDetail;
