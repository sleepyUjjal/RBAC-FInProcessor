import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createRecord, getRecordById, patchRecord, updateRecord } from "../api/records";
import FeedbackToast from "../components/FeedbackToast";
import { useAuth } from "../context/useAuth";

const TYPE_OPTIONS = ["Income", "Expense", "Investment"];
const CATEGORY_OPTIONS = [
  "Food",
  "Travel",
  "Rent",
  "Salary",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Investment",
  "Other",
];

const DEFAULT_FORM = {
  amount: "",
  type: "Income",
  category: "Other",
  custom_category: "",
  description: "",
  date: "",
};

const buildApiErrorMessage = (error) => {
  const data = error?.data;
  if (!data) {
    return error?.message || "Unable to save record.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object") {
    const messages = Object.entries(data)
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

    if (messages.length) {
      return messages.join(" | ");
    }
  }

  return error?.message || "Unable to save record.";
};

const RecordDetail = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isCreateMode = !recordId;

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

  const showCustomCategory = form.category === "Other";

  useEffect(() => {
    if (isCreateMode) {
      setLoading(false);
      setForm(DEFAULT_FORM);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadRecord = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getRecordById(recordId, { signal: controller.signal });
        if (!isMounted) {
          return;
        }
        setForm({
          amount: response?.amount ?? "",
          type: response?.type ?? "Income",
          category: response?.category ?? "Other",
          custom_category: response?.custom_category ?? "",
          description: response?.description ?? "",
          date: response?.date ?? "",
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

    loadRecord();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isCreateMode, recordId]);

  const closeToast = () => {
    setToast((current) => ({ ...current, isVisible: false }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const buildPayload = () => {
    const payload = {
      amount: form.amount,
      type: form.type,
      category: form.category,
      description: form.description.trim() || null,
      date: form.date,
    };

    if (form.category === "Other") {
      payload.custom_category = form.custom_category.trim();
    } else {
      payload.custom_category = null;
    }

    return payload;
  };

  const actionLabel = useMemo(() => {
    if (isCreateMode) {
      return "Create Record";
    }
    return updateMode === "put" ? "Save via PUT" : "Save via PATCH";
  }, [isCreateMode, updateMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setToast({
        isVisible: true,
        title: "Read-only Access",
        message: "Only Admin can create or update records.",
        type: "warning",
      });
      return;
    }

    setSaving(true);
    setError("");

    const payload = buildPayload();

    try {
      if (isCreateMode) {
        await createRecord(payload);
        setToast({
          isVisible: true,
          title: "Record Created",
          message: "Financial record created successfully.",
          type: "success",
        });
      } else if (updateMode === "put") {
        await updateRecord(recordId, payload);
        setToast({
          isVisible: true,
          title: "Record Updated (PUT)",
          message: "Financial record saved successfully.",
          type: "success",
        });
      } else {
        await patchRecord(recordId, payload);
        setToast({
          isVisible: true,
          title: "Record Updated (PATCH)",
          message: "Financial record saved successfully.",
          type: "success",
        });
      }

      window.setTimeout(() => {
        navigate("/records", { replace: true });
      }, 600);
    } catch (requestError) {
      const message = buildApiErrorMessage(requestError);
      setError(message);
      setToast({
        isVisible: true,
        title: "Save Failed",
        message,
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
          <h2 className="mb-1 text-3xl">{isCreateMode ? "Create Record" : "Update Record"}</h2>
          <p className="text-sm">
            {isCreateMode
              ? "Add a new financial record."
              : "Edit existing record and save via PATCH or PUT."}
          </p>
        </div>
        <Link className="btn-secondary px-4 py-2 text-sm" to="/records">
          Back to Records
        </Link>
      </div>

      {!isAdmin ? (
        <div className="alert-warning mb-4 p-3 text-sm">
          You have read-only access. Only Admin can create, update, or delete records.
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-md border border-[var(--border)] bg-white p-4 text-sm">
          Loading record details...
        </div>
      ) : (
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm">Amount</label>
            <input
              min="0"
              name="amount"
              onChange={handleChange}
              required
              step="0.01"
              type="number"
              value={form.amount}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Date</label>
            <input name="date" onChange={handleChange} required type="date" value={form.date} />
          </div>

          <div>
            <label className="mb-1 block text-sm">Type</label>
            <select name="type" onChange={handleChange} value={form.type}>
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm">Category</label>
            <select name="category" onChange={handleChange} value={form.category}>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {showCustomCategory ? (
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm">Custom Category (required for Other)</label>
              <input
                name="custom_category"
                onChange={handleChange}
                required
                type="text"
                value={form.custom_category}
              />
            </div>
          ) : null}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="Optional notes"
              rows={4}
              value={form.description}
            />
          </div>

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
            <button
              className="btn-primary px-5 py-2.5"
              disabled={saving || !isAdmin}
              type="submit"
            >
              {saving ? "Saving..." : actionLabel}
            </button>
            <button className="btn-secondary px-5 py-2.5" onClick={() => navigate("/records")} type="button">
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

export default RecordDetail;
