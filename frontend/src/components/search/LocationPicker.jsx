import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { CITIES } from "../../data/mockData";

/**
 * Compact location picker designed for inline placement in the modal header.
 * Click to open a search-able city dropdown.
 */
export default function LocationPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = CITIES.filter((c) => c.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        data-testid="modal-loc-trigger"
        onClick={() => setOpen((o) => !o)}
        className="h-7 inline-flex items-center gap-1 px-2 rounded-md border border-slate-200 bg-white hover:border-teal-400 text-slate-700 text-[11px] font-semibold transition-colors"
      >
        <MapPin size={11} className="text-teal-600" />
        {value}
        <ChevronDown size={11} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          data-testid="modal-loc-dropdown"
          className="absolute left-0 top-full mt-1 w-56 bg-white rounded-md shadow-lg border border-slate-200 z-50"
        >
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search city…"
              className="w-full h-7 px-2 text-[12px] rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setOpen(false); setQ(""); }}
                className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-teal-50 ${
                  c === value ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-[11px] text-slate-400">No city found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
