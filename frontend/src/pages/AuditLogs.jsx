import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { listAuditLogs } from "../api/records";
import DataTable from "../components/DataTable";

const PAGE_SIZE = 20;
const ACTION_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "CREATE", label: "CREATE" },
  { value: "UPDATE", label: "UPDATE" },
  { value: "DELETE", label: "DELETE" },
];

const actionBadgeClass = {
  CREATE: "bg-[rgba(54,80,63,0.14)] text-[rgba(44,70,54,1)]",
  UPDATE: "bg-[rgba(183,137,63,0.16)] text-[rgba(99,69,29,1)]",
  DELETE: "bg-[rgba(125,47,47,0.14)] text-[rgba(95,35,35,1)]",
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

const formatTimestamp = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const AuditLogs = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput.trim());
  const [actionFilter, setActionFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const deferredUserFilter = useDeferredValue(userFilter.trim());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, actionFilter, deferredUserFilter]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchLogs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await listAuditLogs(
          {
            page,
            search: deferredSearch || undefined,
            action: actionFilter || undefined,
            user: deferredUserFilter || undefined,
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
        setError(requestError?.message || "Unable to fetch audit logs right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, deferredSearch, actionFilter, deferredUserFilter, reloadCounter]);

  const columns = useMemo(
    () => [
      {
        key: "timestamp",
        header: "Timestamp",
        render: (row) => formatTimestamp(row.timestamp),
      },
      {
        key: "action",
        header: "Action",
        render: (row) => {
          const badgeClass = actionBadgeClass[row.action] || "bg-[var(--surface-muted)] text-[var(--text-h)]";
          return (
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badgeClass}`}>
              {row.action}
            </span>
          );
        },
      },
      {
        key: "user_email",
        header: "User",
        render: (row) => row.user_email || "Unknown",
      },
      {
        key: "module",
        header: "Module",
        render: (row) => row.module || "-",
      },
      {
        key: "details",
        header: "Details",
      },
    ],
    []
  );

  return (
    <section className="glass-panel mx-auto max-w-6xl p-8 md:p-10 fade-in-up">
      <div className="mb-4">
        <h2 className="mb-2 text-3xl">Audit Logs</h2>
        <p className="text-sm">Read-only system activity logs for administrators.</p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Search</label>
          <input
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by details text"
            type="text"
            value={searchInput}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Action</label>
          <select onChange={(event) => setActionFilter(event.target.value)} value={actionFilter}>
            {ACTION_OPTIONS.map((option) => (
              <option key={option.value || "all-actions"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">User ID</label>
          <input
            inputMode="numeric"
            onChange={(event) => setUserFilter(event.target.value)}
            placeholder="Optional user id"
            type="text"
            value={userFilter}
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p>
          Showing <strong>{rows.length}</strong> of <strong>{totalCount}</strong> logs
        </p>
        <button
          className="btn-secondary px-3 py-2 text-sm"
          onClick={() => setReloadCounter((current) => current + 1)}
          type="button"
        >
          Refresh Logs
        </button>
      </div>

      {error ? (
        <div className="alert-error mb-4 p-3 text-sm">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={columns}
        emptyMessage="No audit logs found for the selected filters."
        loading={loading}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
        }}
        rows={rows}
      />
    </section>
  );
};

export default AuditLogs;
