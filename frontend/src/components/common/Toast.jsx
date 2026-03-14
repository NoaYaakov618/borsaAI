import { useEffect } from "react";
import "./Toast.css";

/**
 * A self-dismissing toast notification.
 * Props:
 *   toast: { title, message } | null
 *   onDismiss: () => void
 *   duration: number (ms, default 4000)
 */
export default function Toast({ toast, onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDismiss, duration);
    return () => clearTimeout(id);
  }, [toast, onDismiss, duration]);

  if (!toast) return null;

  return (
    <div className="toast" onClick={onDismiss} role="alert">
      <p className="toast-title">{toast.title}</p>
      <p className="toast-message">{toast.message}</p>
    </div>
  );
}
