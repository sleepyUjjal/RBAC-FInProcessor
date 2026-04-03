import { useState } from "react";
import DataTable from "../components/DataTable";
import FeedbackToast from "../components/FeedbackToast";
import Modal from "../components/Modal";

const UserList = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      email: "admin@finance.local",
      fullName: "System Admin",
      role: "Admin",
      isActive: true,
    },
    {
      id: 2,
      email: "analyst@finance.local",
      fullName: "Primary Analyst",
      role: "Analyst",
      isActive: true,
    },
    {
      id: 3,
      email: "viewer@finance.local",
      fullName: "Audit Viewer",
      role: "Viewer",
      isActive: false,
    },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    title: "",
    type: "info",
  });

  const closeToast = () => {
    setToast((current) => ({ ...current, isVisible: false }));
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
  };

  const confirmDelete = () => {
    if (!selectedUser) {
      return;
    }

    setRows((currentRows) => currentRows.filter((row) => row.id !== selectedUser.id));
    setToast({
      isVisible: true,
      title: "User Removed",
      message: `${selectedUser.email} has been deleted from the table.`,
      type: "success",
    });
    setSelectedUser(null);
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
        <span className="inline-flex rounded-full bg-[var(--lavender)] px-2 py-1 text-xs font-medium">
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
            row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
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
          <button className="btn-secondary px-2 py-1 text-xs" type="button">
            Edit
          </button>
          <button
            className="rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700"
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
    <section className="glass-panel mx-auto max-w-5xl p-8">
      <div className="mb-4">
        <h2 className="mb-2 text-3xl">User Management</h2>
        <p className="text-sm">Reusable table, modal, and toast are now ready for API wiring in Step 8.</p>
      </div>

      <DataTable columns={columns} rows={rows} />

      <Modal
        confirmText="Delete User"
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
