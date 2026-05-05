import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

/**
 * Lightweight toast that auto-dismisses after `durationMs`.
 * Shown bottom-right with a soft slide-in.
 */
export default function Toast({ message, sub, open, onClose, durationMs = 4500 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div
      data-testid="toast"
      className="fixed bottom-5 right-5 z-[80] animate-[slideIn_0.25s_ease-out]"
      style={{ animation: "slideIn 0.25s ease-out" }}
    >
      <div className="flex items-start gap-2.5 max-w-[360px] bg-white border border-emerald-200 shadow-xl rounded-xl pl-3 pr-2 py-2.5">
        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-slate-900">{message}</div>
          {sub && <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{sub}</div>}
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 shrink-0">
          <X size={14} />
        </button>
      </div>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </div>
  );
}
