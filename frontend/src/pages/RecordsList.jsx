import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRecord, listRecords } from "../api/records";
import DataTable from "../components/DataTable";
import FeedbackToast from "../components/FeedbackToast";
import Modal from "../components/Modal";
import { useAuth } from "../context/useAuth";

const PAGE_SIZE = 20;
const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
  { value: "Investment", label: "Investment" },
];
const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "Food", label: "Food" },
  { value: "Travel", label: "Travel" },
  { value: "Rent", label: "Rent" },
  { value: "Salary", label: "Salary" },
  { value: "Utilities", label: "Utilities" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health", label: "Health" },
  { value: "Shopping", label: "Shopping" },
  { value: "Education", label: "Education" },
  { value: "Other", label: "Other" },
];

const ORDER_OPTIONS = [
  { value: "-date", label: "Newest Date" },
  { value: "date", label: "Oldest Date" },
  { value: "-amount", label: "Highest Amount" },
  { value: "amount", label: "Lowest Amount" },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatCurrency = (value) => {
  const numericValue = Number(value ?? 0);
  if (Number.isNaN(numericValue)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(numericValue);
};

const parsePaginatedResponse = (response, currentPage) => {
  if (Array.isArray(response)) {
    return {
      results: response,
      count: response.length,
      totalPages: 1,
      currentPage: 1,
    };
  }

  const results = Array.isArray(response?.results) ? response.results : [];
  const count = Number(response?.count ?? results.length);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return {
    results,
    count,
    totalPages,
    currentPage,
  };
};

const RecordsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();
  const currentUserEmail = (user?.email || "").trim().toLowerCase();
  const canCreateRecords = role === "admin" || role === "user";
  const canManageAnyRecord = role === "admin";
  const canManageOwnRecord = role === "user";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput.trim());
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [ordering, setOrdering] = useState("-date");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [reloadCounter, setReloadCounter] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, typeFilter, categoryFilter, ordering]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchRecords = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await listRecords(
          {
            page,
            search: deferredSearch || undefined,
            type: typeFilter || undefined,
            category: categoryFilter || undefined,
            ordering,
          },
          { signal: controller.signal }
        );

        if (!isMounted) {
          return;
        }

        const parsed = parsePaginatedResponse(response, page);
        setRows(parsed.results);
        setTotalCount(parsed.count);
        setTotalPages(parsed.totalPages);

        if (page > parsed.totalPages) {
          setPage(parsed.totalPages);
        }
      } catch (requestError) {
        if (!isMounted || requestError?.name === "AbortError") {
          return;
        }
        setRows([]);
        setError(requestError?.message || "Unable to fetch records right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecords();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [deferredSearch, typeFilter, categoryFilter, ordering, page, reloadCounter]);

  const closeToast = () => {
    setToast((current) => ({ ...current, isVisible: false }));
  };

  const closeDeleteModal = () => {
    setSelectedRecord(null);
  };

  const canManageRecord = (row) => {
    if (canManageAnyRecord) {
      return true;
    }
    if (!canManageOwnRecord) {
      return false;
    }

    const ownerEmail = (row?.created_by_email || "").trim().toLowerCase();
    if (!ownerEmail) {
      return true;
    }
    return ownerEmail === currentUserEmail;
  };

  const canDeleteRecordRow = (row) => canManageRecord(row);

  const confirmDelete = async () => {
    if (!selectedRecord || !canDeleteRecordRow(selectedRecord)) {
      setSelectedRecord(null);
      return;
    }

    try {
      await deleteRecord(selectedRecord.id);
      setToast({
        isVisible: true,
        title: "Record Deleted",
        message: `Record #${selectedRecord.id} deleted successfully.`,
        type: "success",
      });

      const shouldMoveToPreviousPage = rows.length === 1 && page > 1;
      if (shouldMoveToPreviousPage) {
        setPage((current) => Math.max(1, current - 1));
      } else {
        setReloadCounter((current) => current + 1);
      }
    } catch (requestError) {
      setToast({
        isVisible: true,
        title: "Delete Failed",
        message: requestError?.message || "Unable to delete this record.",
        type: "error",
      });
    } finally {
      setSelectedRecord(null);
    }
  };

  const baseColumns = [
    {
      key: "id",
      header: "ID",
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <span className="inline-flex rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-medium">
          {row.type}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => row.category === "Other" ? row.custom_category || "Other" : row.category,
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <strong>{formatCurrency(row.amount)}</strong>,
    },
    {
      key: "created_by_email",
      header: "Created By",
      render: (row) => row.created_by_email || "-",
    },
  ];

  const actionColumn = {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="flex gap-2">
        {canManageRecord(row) ? (
          <button
            className="btn-secondary px-2 py-1 text-xs"
            onClick={() => navigate(`/records/${row.id}`)}
            type="button"
          >
            Edit
          </button>
        ) : (
          <button
            className="btn-secondary px-2 py-1 text-xs"
            onClick={() => navigate(`/records/${row.id}`)}
            type="button"
          >
            View
          </button>
        )}

        {canDeleteRecordRow(row) ? (
          <button
            className="rounded-md bg-[var(--burgundy)] px-2 py-1 text-xs font-medium text-white hover:opacity-90"
            onClick={() => setSelectedRecord(row)}
            type="button"
          >
            Delete
          </button>
        ) : null}
      </div>
    ),
  };

  const columns = [...baseColumns, actionColumn];

  return (
    <section className="glass-panel mx-auto max-w-6xl w-full min-w-0 overflow-hidden p-8 md:p-10 fade-in-up">
      <div className="mb-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl">Records</h2>
          {canCreateRecords ? (
            <button className="btn-primary px-4 py-2 text-sm" onClick={() => navigate("/records/new")} type="button">
              Add Record
            </button>
          ) : null}
        </div>
        <p className="text-sm">Manage financial records with filters, sorting, and pagination.</p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Search</label>
          <input
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by description/category"
            type="text"
            value={searchInput}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Type</label>
          <select onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}>
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value || "all-types"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Category</label>
          <select onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value || "all-categories"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <p>
            Showing <strong>{rows.length}</strong> of <strong>{totalCount}</strong> records
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm">Sort</label>
            <select onChange={(event) => setOrdering(event.target.value)} value={ordering}>
              {ORDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="btn-secondary px-3 py-2 text-sm"
          onClick={() => setReloadCounter((current) => current + 1)}
          type="button"
        >
          Refresh List
        </button>
      </div>

      {error ? (
        <div className="alert-error mb-4 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={columns}
        loading={loading}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
        }}
        rows={rows}
      />

      <Modal
        confirmText="Delete Record"
        isDanger
        isOpen={Boolean(selectedRecord)}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Record?"
      >
        {selectedRecord ? (
          <p>
            Are you sure you want to delete record <strong>#{selectedRecord.id}</strong>? This action
            cannot be undone.
          </p>
        ) : null}
      </Modal>

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

export default RecordsList;
