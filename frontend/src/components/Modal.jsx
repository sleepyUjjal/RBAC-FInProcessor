import { useEffect } from "react";

const Modal = ({
  isOpen,
  title = "Confirm Action",
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  onConfirm,
  onClose,
  disableConfirm = false,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const confirmClass = isDanger
    ? "rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    : "rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-medium text-white hover:opacity-90";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h3 className="mb-2 text-2xl text-[var(--text-h)]">{title}</h3>
        <div className="text-sm text-[var(--text)]">{children}</div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary px-4 py-2 text-sm" onClick={() => onClose?.()} type="button">
            {cancelText}
          </button>
          <button
            className={confirmClass}
            disabled={disableConfirm}
            onClick={() => onConfirm?.()}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

