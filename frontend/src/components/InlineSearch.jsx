import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Search } from "lucide-react";
import { CITIES } from "../data/mockData";

export default function InlineSearch({ location, setLocation, onSearch }) {
  const [q, setQ] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [locSearch, setLocSearch] = useState("");
  const locRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (locRef.current && !locRef.current.contains(e.target)) setLocOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = CITIES.filter((c) => c.toLowerCase().includes(locSearch.toLowerCase()));

  const submit = () => {
    if (!q.trim()) return;
    onSearch(q.trim());
  };

  return (
    <div className="flex items-center gap-3" data-testid="inline-search">
      <div className="relative" ref={locRef}>
        <button
          data-testid="inline-loc-trigger"
          onClick={() => setLocOpen((o) => !o)}
          className="h-11 min-w-[180px] bg-white border border-slate-200 rounded-lg px-4 flex items-center gap-2 text-sm text-slate-800 font-medium hover:border-teal-400"
        >
          <MapPin size={16} className="text-teal-600" />
          <span className="flex-1 text-left">{location}</span>
          <ChevronDown size={15} className={`text-slate-400 transition-transform ${locOpen ? "rotate-180" : ""}`} />
        </button>
        {locOpen && (
          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-30" data-testid="inline-loc-dropdown">
            <div className="p-2 border-b border-slate-100">
              <input
                autoFocus
                value={locSearch}
                onChange={(e) => setLocSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.map((c) => (
                <button
                  key={c}
                  onClick={() => { setLocation(c); setLocOpen(false); setLocSearch(""); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-50 ${
                    c === location ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <input
          data-testid="inline-search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          type="text"
          placeholder="Enter product / service"
          className="w-full h-11 pl-4 pr-12 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
      </div>

      <button
        data-testid="inline-search-btn"
        onClick={submit}
        className="h-11 px-7 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
      >
        Search
      </button>
      <button
        data-testid="inline-post-rfq"
        className="h-11 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
      >
        Post RFQ
      </button>
    </div>
  );
}
