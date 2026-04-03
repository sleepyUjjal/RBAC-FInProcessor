import { useEffect } from "react";

const toastStyles = {
  success: "border-[rgba(54,80,63,0.3)] bg-[rgba(54,80,63,0.12)] text-[rgba(44,70,54,1)]",
  error: "border-[rgba(125,47,47,0.34)] bg-[rgba(125,47,47,0.08)] text-[rgba(95,35,35,1)]",
  warning: "border-[rgba(143,104,44,0.34)] bg-[rgba(183,137,63,0.12)] text-[rgba(108,75,29,1)]",
  info: "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-h)]",
};

const FeedbackToast = ({
  isVisible,
  message,
  type = "info",
  onClose,
  duration = 3500,
  title,
}) => {
  useEffect(() => {
    if (!isVisible || !duration) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onClose?.();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, isVisible, onClose]);

  if (!isVisible || !message) {
    return null;
  }

  const style = toastStyles[type] || toastStyles.info;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50">
      <div
        className={`pointer-events-auto w-[min(92vw,370px)] rounded-xl border p-4 shadow-[var(--shadow-md)] ${style}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            {title ? <p className="text-sm font-semibold uppercase tracking-[0.06em]">{title}</p> : null}
            <p className="text-sm">{message}</p>
          </div>
          <button className="text-xs font-semibold underline" onClick={() => onClose?.()} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackToast;
