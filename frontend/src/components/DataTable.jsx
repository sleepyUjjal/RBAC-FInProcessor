const DataTable = ({
  columns = [],
  rows = [],
  keyField = "id",
  loading = false,
  emptyMessage = "No records available.",
  pagination,
}) => {
  const hasRows = rows.length > 0;
  const hasPagination = Boolean(pagination) && pagination.totalPages > 1;

  return (
    <div className="panel-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th className="bg-[var(--surface-muted)]" key={column.key}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-10 text-center text-sm" colSpan={Math.max(columns.length, 1)}>
                  Loading data...
                </td>
              </tr>
            ) : null}

            {!loading && !hasRows ? (
              <tr>
                <td className="py-10 text-center text-sm" colSpan={Math.max(columns.length, 1)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : null}

            {!loading && hasRows
              ? rows.map((row, rowIndex) => (
                  <tr key={row[keyField] ?? `${rowIndex}-${row.email ?? "row"}`}>
                    {columns.map((column) => {
                      const cellValue = column.render ? column.render(row) : row[column.key];
                      return <td key={column.key}>{cellValue ?? "-"}</td>;
                    })}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {hasPagination ? (
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <p className="text-sm">
            Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
          </p>
          <div className="flex gap-2">
            <button
              className="btn-secondary px-3 py-1 text-sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange?.(pagination.currentPage - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="btn-secondary px-3 py-1 text-sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange?.(pagination.currentPage + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DataTable;
