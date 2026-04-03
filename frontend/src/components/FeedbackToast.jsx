import { useEffect } from "react";

const toastStyles = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  error: "border-rose-300 bg-rose-50 text-rose-800",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  info: "border-blue-300 bg-blue-50 text-blue-800",
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
      <div className={`pointer-events-auto w-[min(92vw,360px)] rounded-lg border p-4 shadow-lg ${style}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            {title ? <p className="text-sm font-semibold">{title}</p> : null}
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

