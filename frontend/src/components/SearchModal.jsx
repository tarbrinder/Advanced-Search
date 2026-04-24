import React, { useState, useEffect, useMemo } from "react";
import { X, Star, CheckCircle2, Heart, Sparkles, Search as SearchIcon } from "lucide-react";
import { searchSellers } from "../data/mockData";
import AILoading from "./search/AILoading";
import TopPickCard from "./search/TopPickCard";
import BuyerAssistant from "./search/BuyerAssistant";
import OtherSellersScroller from "./search/OtherSellersScroller";
import { rankSellers } from "./search/rankSellers";

const UNITS = ["Meter", "kg", "Piece"];
const MATERIALS_ALL = ["Steel", "Aluminium", "Copper", "Plastic", "Brass", "Wood", "Glass", "Rubber"];
const BRANDS = ["Generic", "Branded", "OEM"];
const CERTS = ["ISO Certified", "BIS Certified", "CE Marked"];

// PRODUCT-SPECIFIC ISQ SPECS — simulate IndiaMART's spec schema per product
function getProductSpecs(q) {
  const p = (q || "").toLowerCase();
  if (p.includes("dining") || p.includes("table")) {
    return [
      { name: "Seating Capacity", options: ["2 Seater", "4 Seater", "6 Seater", "8 Seater", "10 Seater"] },
      { name: "Primary Material", options: ["Wood", "Metal", "Glass", "Marble", "MDF"] },
      { name: "Table Top Material", options: ["Wood", "Glass", "Marble", "Laminate"] },
      { name: "Shape", options: ["Rectangular", "Round", "Square", "Oval"] },
    ];
  }
  if (p.includes("generator") || p.includes("diesel")) {
    return [
      { name: "Phase", options: ["Single Phase", "Three Phase"] },
      { name: "Fuel Type", options: ["Diesel", "Petrol", "Gas"] },
      { name: "Cooling Type", options: ["Air Cooled", "Water Cooled"] },
    ];
  }
  if (p.includes("helmet") || p.includes("safety")) {
    return [
      { name: "Material", options: ["ABS Plastic", "HDPE", "Fiberglass"] },
      { name: "Color", options: ["White", "Yellow", "Red", "Blue", "Green"] },
      { name: "Certification", options: ["IS 2925", "CE", "ANSI"] },
    ];
  }
  if (p.includes("tile") || p.includes("wall") || p.includes("floor")) {
    return [
      { name: "Size", options: ["300x300 mm", "600x600 mm", "800x800 mm"] },
      { name: "Finish", options: ["Matte", "Glossy", "Satin"] },
      { name: "Application", options: ["Bathroom", "Kitchen", "Living Room", "Outdoor"] },
    ];
  }
  return [
    { name: "Material", options: ["Steel", "Aluminium", "Plastic", "Wood"] },
    { name: "Quality Grade", options: ["Premium", "Standard", "Economy"] },
  ];
}

export default function SearchModal({ open, query, onClose }) {
  // phase: 'filters' | 'loading' | 'results'
  const [phase, setPhase] = useState("filters");
  const [loadingMs, setLoadingMs] = useState(5500);

  const [unit, setUnit] = useState("Meter");
  const [qty, setQty] = useState("");
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [productSpecs, setProductSpecs] = useState({}); // { "Seating Capacity": "6 Seater" }
  const [assistantAnswers, setAssistantAnswers] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset state when modal opens with new query
  useEffect(() => {
    if (open) {
      setPhase("filters");
      setUnit("Meter");
      setQty("");
      setSelectedMaterials([]);
      setSelectedBrands([]);
      setSelectedCerts([]);
      setProductSpecs({});
      setAssistantAnswers({});
      setFavorites(new Set());
    }
  }, [open, query]);

  const specs = useMemo(() => getProductSpecs(query), [query]);
  const rawSellers = useMemo(() => (open ? searchSellers(query) : []), [open, query]);

  const topPicks = useMemo(() => {
    const ranked = rankSellers(rawSellers, { ...productSpecs, ...assistantAnswers });
    return ranked.slice(0, 3);
  }, [rawSellers, productSpecs, assistantAnswers]);

  const otherSellers = useMemo(() => {
    const ranked = rankSellers(rawSellers, { ...productSpecs, ...assistantAnswers });
    return ranked.slice(3);
  }, [rawSellers, productSpecs, assistantAnswers]);

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

  const handleFindBestMatch = (durationMs = 5500) => {
    setLoadingMs(durationMs);
    setPhase("loading");
  };

  // Two-way sync: assistant answer → update productSpecs so chip panel reflects
  const handleAssistantAnswer = (specName, value) => {
    setAssistantAnswers((prev) => ({ ...prev, [specName]: value }));
    // If the spec matches a product spec in the left panel, sync it
    if (specs.some((s) => s.name === specName)) {
      setProductSpecs((prev) => ({ ...prev, [specName]: value }));
    }
    // trigger shimmer refresh on results
    if (phase === "results") {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 900);
    }
  };

  const handleSpecChipChange = (specName, value) => {
    setProductSpecs((prev) => ({ ...prev, [specName]: value }));
    setAssistantAnswers((prev) => ({ ...prev, [specName]: value }));
    if (phase === "results") {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 900);
    }
  };

  if (!open) return null;

  const materialsVisible = showAllMaterials ? MATERIALS_ALL : MATERIALS_ALL.slice(0, 5);

  return (
    <div
      data-testid="search-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}
    >
      <div
        className="bg-white w-full max-w-[1160px] max-h-[92vh] h-[92vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "fadeIn 0.18s ease-out" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <SearchIcon size={16} className="text-[#0f1f5c]" />
            <span
              data-testid="search-modal-query"
              className="text-[#0a6640] font-bold text-[17px] tracking-tight"
            >
              {query}
            </span>
            {phase === "results" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6d28d9]/10 text-[#6d28d9]">
                AI Curated
              </span>
            )}
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
        <div className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
          {/* LEFT FILTER PANEL — always visible */}
          <aside
            data-testid="filters-panel"
            className="border-r border-slate-100 bg-[#f8fafc] flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-5 pb-4 space-y-5">
              {/* Quantity */}
              <div>
                <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wide">Quantity</div>
                <div className="flex items-center gap-2">
                  <input
                    data-testid="qty-input"
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="0"
                    className="w-16 h-8 px-2 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1f5c]/30 focus:border-[#0f1f5c]"
                  />
                  <div className="flex rounded-md border border-slate-200 overflow-hidden bg-white">
                    {UNITS.map((u) => (
                      <button
                        key={u}
                        data-testid={`unit-${u}`}
                        onClick={() => setUnit(u)}
                        className={`px-2.5 h-8 text-[11px] font-medium transition-colors ${
                          unit === u ? "bg-teal-500 text-white" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product-specific ISQ specs */}
              {specs.map((spec) => (
                <div key={spec.name} data-testid={`spec-filter-${spec.name}`}>
                  <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                    {spec.name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.options.map((opt) => {
                      const selected = productSpecs[spec.name] === opt;
                      return (
                        <button
                          key={opt}
                          data-testid={`spec-chip-${spec.name}-${opt}`}
                          onClick={() => handleSpecChipChange(spec.name, selected ? null : opt)}
                          className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                            selected
                              ? "bg-teal-500 border-teal-500 text-white font-semibold"
                              : "border-slate-200 text-slate-600 hover:border-teal-400 bg-white"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Material */}
              <div>
                <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wide">Material</div>
                <div className="flex flex-wrap gap-1.5">
                  {materialsVisible.map((m) => (
                    <button
                      key={m}
                      data-testid={`material-${m}`}
                      onClick={() => toggle(selectedMaterials, setSelectedMaterials, m)}
                      className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
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
                  data-testid="toggle-materials"
                  className="mt-1.5 text-[11px] text-teal-600 font-semibold hover:underline"
                >
                  {showAllMaterials ? "Show Less ↑" : "Show More ↓"}
                </button>
              </div>

              {/* Brand */}
              <div>
                <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wide">Brand</div>
                <div className="flex flex-wrap gap-1.5">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      data-testid={`brand-${b}`}
                      onClick={() => toggle(selectedBrands, setSelectedBrands, b)}
                      className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
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
                <div className="text-[11px] font-semibold text-slate-700 mb-2 uppercase tracking-wide">Certification</div>
                <div className="flex flex-wrap gap-1.5">
                  {CERTS.map((c) => (
                    <button
                      key={c}
                      data-testid={`cert-${c}`}
                      onClick={() => toggle(selectedCerts, setSelectedCerts, c)}
                      className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
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
            </div>

            {/* Find Best Match — dark navy */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                data-testid="find-best-match"
                onClick={() => handleFindBestMatch(5500)}
                disabled={phase === "loading"}
                className="w-full h-11 rounded-[10px] bg-[#0f1f5c] hover:bg-[#172d80] active:bg-[#0a1748] disabled:opacity-60 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles size={15} className="text-amber-300" />
                Find Best Match
              </button>
            </div>
          </aside>

          {/* RIGHT PANEL — switches between filters results / loading / ai results */}
          <div className="flex flex-col overflow-hidden relative">
            {phase === "filters" && (
              <RightDefault
                sellers={rawSellers}
                query={query}
                favorites={favorites}
                toggleFav={toggleFav}
              />
            )}

            {phase === "loading" && (
              <AILoading durationMs={loadingMs} onDone={() => setPhase("results")} />
            )}

            {phase === "results" && (
              <div className="flex-1 overflow-y-auto p-5 space-y-6 relative">
                {shimmer && (
                  <div
                    data-testid="shimmer"
                    className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center"
                  >
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0f1f5c]">
                      <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" />
                      Refreshing results…
                    </div>
                  </div>
                )}

                {/* Section A: Top 3 picks */}
                <div data-testid="top-picks-section">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-bold text-[#0f1f5c] flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-500" />
                      Top 3 AI Picks for you
                    </h3>
                    <span className="text-[10px] font-bold bg-[#6d28d9]/10 text-[#6d28d9] px-2 py-0.5 rounded-full">
                      AI Curated
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {topPicks.map((s, i) => (
                      <TopPickCard key={s.name + i} seller={s} rank={i} />
                    ))}
                  </div>
                </div>

                {/* Section B: Buyer Assistant */}
                <BuyerAssistant
                  productName={query}
                  filledSpecs={productSpecs}
                  isqSpecs={specs.map((s) => s.name)}
                  answers={assistantAnswers}
                  onAnswer={handleAssistantAnswer}
                  onRefine={() => handleFindBestMatch(2500)}
                />

                {/* Section C: Other sellers scroller */}
                <OtherSellersScroller sellers={otherSellers} />
              </div>
            )}
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

// --- RIGHT PANEL — default "filters" state ------------------------------

function RightDefault({ sellers, query, favorites, toggleFav }) {
  return (
    <>
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <div className="text-[13px] font-semibold text-slate-800">
          Relevant Sellers <span className="text-slate-400 font-normal">· {sellers.length} found</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
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
                className="group bg-white border border-slate-200 rounded-[10px] overflow-hidden hover:border-teal-400 hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-36 object-cover"
                    onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
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
                  <div className="font-bold text-[13px] text-slate-900 truncate">{s.name}</div>
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
    </>
  );
}
