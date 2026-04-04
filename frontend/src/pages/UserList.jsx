import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, listUsers } from "../api/users";
import DataTable from "../components/DataTable";
import FeedbackToast from "../components/FeedbackToast";
import Modal from "../components/Modal";

const PAGE_SIZE = 20;

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "Admin", label: "Admin" },
  { value: "Analyst", label: "Analyst" },
  { value: "User", label: "User" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const normalizeUser = (user) => {
  const firstName = user.first_name ?? user.firstName ?? "";
  const lastName = user.last_name ?? user.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  return {
    ...user,
    fullName: fullName || "-",
    role: user.role || "User",
    isActive: Boolean(user.is_active ?? user.isActive),
  };
};

const parsePaginatedResponse = (response, currentPage) => {
  if (Array.isArray(response)) {
    return {
      results: response.map(normalizeUser),
      count: response.length,
      totalPages: 1,
      currentPage: 1,
    };
  }

  const results = Array.isArray(response?.results) ? response.results.map(normalizeUser) : [];
  const count = Number(response?.count ?? results.length);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return {
    results,
    count,
    totalPages,
    currentPage,
  };
};

const UserList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput.trim());
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    title: "",
    type: "info",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, roleFilter, statusFilter]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await listUsers(
          {
            page,
            search: deferredSearch,
            role: roleFilter || undefined,
            isActive: statusFilter || undefined,
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
        setError(requestError?.message || "Unable to fetch users right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [deferredSearch, page, reloadCounter, roleFilter, statusFilter]);

  const closeToast = () => {
    setToast((current) => ({ ...current, isVisible: false }));
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await deleteUser(selectedUser.id);

      setToast({
        isVisible: true,
        title: "User Deleted",
        message: `${selectedUser.email} was removed successfully.`,
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
        message: requestError?.message || "Unable to delete this user.",
        type: "error",
      });
    } finally {
      setSelectedUser(null);
    }
  };

  const columns = [
    {
      key: "email",
      header: "Email",
    },
    {
      key: "fullName",
      header: "Name",
    },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <span className="inline-flex rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-medium">
          {row.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            row.isActive
              ? "bg-[rgba(54,80,63,0.14)] text-[rgba(44,70,54,1)]"
              : "bg-[var(--surface-muted)] text-[var(--text-h)]"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="btn-secondary px-2 py-1 text-xs"
            onClick={() => navigate(`/users/${row.id}`)}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded-md bg-[var(--burgundy)] px-2 py-1 text-xs font-medium text-white hover:opacity-90"
            onClick={() => openDeleteModal(row)}
            type="button"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="glass-panel mx-auto max-w-6xl p-8 md:p-10 fade-in-up">
      <div className="mb-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl">User Management</h2>
          <button className="btn-primary px-4 py-2 text-sm" onClick={() => navigate("/users/new")} type="button">
            Add User
          </button>
        </div>
        <p className="text-sm">Admin-only directory with search, filters, pagination, and delete workflow.</p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Search</label>
          <input
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by email or name"
            type="text"
            value={searchInput}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Role</label>
          <select onChange={(event) => setRoleFilter(event.target.value)} value={roleFilter}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value || "all-roles"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || "all-status"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p>
          Showing <strong>{rows.length}</strong> of <strong>{totalCount}</strong> users
        </p>
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
        confirmText="Delete User"
        disableConfirm={false}
        isDanger
        isOpen={Boolean(selectedUser)}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete User?"
      >
        {selectedUser ? (
          <p>
            Are you sure you want to delete <strong>{selectedUser.email}</strong>? This action cannot
            be undone.
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

export default UserList;
