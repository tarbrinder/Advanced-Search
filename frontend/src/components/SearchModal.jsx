import React, { useState, useEffect, useMemo } from "react";
import { X, Star, BadgeCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { searchSellers } from "../data/mockData";

const UNITS = ["Meter", "kg", "Piece"];
const MATERIALS_ALL = ["Steel", "Aluminium", "Copper", "Plastic", "Brass", "Wood", "Glass", "Rubber"];
const BRANDS = ["Generic", "Branded", "OEM"];
const CERTS = ["ISO Certified", "BIS Certified", "CE Marked"];

export default function SearchModal({ open, query, onClose }) {
  const [unit, setUnit] = useState("Meter");
  const [qty, setQty] = useState("");
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const sellers = useMemo(() => (open ? searchSellers(query) : []), [open, query]);

  const toggle = (list, setList, value) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else setList([...list, value]);
  };

  const toggleFav = (name) => {
    const n = new Set(favorites);
    if (n.has(name)) n.delete(name);
    else n.add(name);
    setFavorites(n);
  };

  if (!open) return null;

  const materialsVisible = showAllMaterials ? MATERIALS_ALL : MATERIALS_ALL.slice(0, 5);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" data-testid="search-modal">
      <div
        className="bg-white w-full max-w-[1120px] max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.18s_ease-out]"
        style={{ animation: "fadeIn 0.18s ease-out" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-teal-600 font-bold text-lg tracking-tight" data-testid="search-modal-query">
              {query}
            </span>
            <span className="text-xs text-slate-400">· {sellers.length} sellers found</span>
          </div>
          <button
            data-testid="search-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-[260px_1fr] overflow-hidden">
          {/* Filters */}
          <aside className="border-r border-slate-100 p-5 overflow-y-auto bg-slate-50/50" data-testid="filters-panel">
            {/* Quantity */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-700 mb-2">Quantity</div>
              <div className="flex items-center gap-2">
                <input
                  data-testid="qty-input"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                  className="w-14 h-8 px-2 text-sm rounded border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex rounded-md border border-slate-200 overflow-hidden bg-white">
                  {UNITS.map((u) => (
                    <button
                      key={u}
                      data-testid={`unit-${u}`}
                      onClick={() => setUnit(u)}
                      className={`px-2.5 h-8 text-xs font-medium transition-colors ${
                        unit === u ? "bg-teal-500 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Material */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-700 mb-2">Material</div>
              <div className="flex flex-wrap gap-2">
                {materialsVisible.map((m) => (
                  <button
                    key={m}
                    data-testid={`material-${m}`}
                    onClick={() => toggle(selectedMaterials, setSelectedMaterials, m)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                      selectedMaterials.includes(m)
                        ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                        : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAllMaterials((s) => !s)}
                className="mt-2 text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1"
                data-testid="toggle-materials"
              >
                {showAllMaterials ? "Show Less ↑" : "Show More ↓"}
              </button>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-700 mb-2">Brand</div>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    data-testid={`brand-${b}`}
                    onClick={() => toggle(selectedBrands, setSelectedBrands, b)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                      selectedBrands.includes(b)
                        ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                        : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Certification */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">Certification</div>
              <div className="flex flex-wrap gap-2">
                {CERTS.map((c) => (
                  <button
                    key={c}
                    data-testid={`cert-${c}`}
                    onClick={() => toggle(selectedCerts, setSelectedCerts, c)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                      selectedCerts.includes(c)
                        ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                        : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">Relevant Sellers</div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-24">
              {sellers.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500 py-20">
                  No sellers found for "{query}"
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4" data-testid="sellers-grid">
                  {sellers.map((s, i) => (
                    <div
                      key={s.name + i}
                      data-testid={`seller-${s.name}`}
                      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-teal-400 hover:shadow-md transition-all"
                    >
                      <div className="relative">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-36 object-cover"
                          onError={(e) => { e.target.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
                        />
                        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-800 shadow-sm">
                          {s.price}
                        </div>
                        <button
                          onClick={() => toggleFav(s.name)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white"
                          data-testid={`fav-${s.name}`}
                        >
                          <Heart
                            size={13}
                            className={favorites.has(s.name) ? "fill-red-500 text-red-500" : "text-slate-500"}
                          />
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-slate-900 text-sm truncate">{s.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{s.location}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 text-[11px] font-semibold">
                            <Star size={10} className="fill-amber-500 text-amber-500" />
                            {s.rating}
                          </div>
                          <span className="text-[11px] text-slate-500">({s.reviews})</span>
                          {s.gst && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 ml-auto">
                              <CheckCircle2 size={11} className="text-emerald-500" /> GST
                            </span>
                          )}
                        </div>
                        <button
                          data-testid={`enquiry-${s.name}`}
                          className="mt-3 w-full h-9 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-xs font-semibold transition-colors"
                        >
                          Send Enquiry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Floating find best match */}
            <div className="absolute left-[260px] bottom-0 right-0 px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
              <button
                data-testid="find-best-match"
                className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Sparkles size={16} className="text-yellow-400" />
                Find Best Match
              </button>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <BadgeCheck size={13} className="text-teal-600" />
                Verified sellers only
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
