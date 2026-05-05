import React, { useState, useEffect, useMemo } from "react";
import { X, Star, CheckCircle2, Heart, Search as SearchIcon, Plus } from "lucide-react";
import { searchSellers } from "../data/mockData";
import AILoading from "./search/AILoading";
import TopPickCard from "./search/TopPickCard";
import BuyerAssistant from "./search/BuyerAssistant";
import { rankSellers } from "./search/rankSellers";

const UNITS = ["Meter", "kg", "Piece"];
const MATERIALS_ALL = ["Steel", "Aluminium", "Copper", "Plastic", "Brass", "Wood", "Glass", "Rubber"];
const BRANDS = ["Generic", "Branded", "OEM"];
const CERTS = ["ISO Certified", "BIS Certified", "CE Marked"];

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
  const [phase, setPhase] = useState("filters"); // filters | loading | results
  const [loadingMs, setLoadingMs] = useState(5500);

  const [unit, setUnit] = useState("Meter");
  const [qty, setQty] = useState("");
  const [showAllMaterials, setShowAllMaterials] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [productSpecs, setProductSpecs] = useState({});
  const [assistantAnswers, setAssistantAnswers] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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

  const ranked = useMemo(
    () => rankSellers(rawSellers, { ...productSpecs, ...assistantAnswers }),
    [rawSellers, productSpecs, assistantAnswers]
  );
  const topPicks = useMemo(() => ranked.slice(0, 5), [ranked]);

  const toggleArr = (list, setList, value) => {
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

  const triggerShimmer = () => {
    setShimmer(true);
    setTimeout(() => setShimmer(false), 800);
  };

  const handleAssistantAnswer = (specName, value) => {
    setAssistantAnswers((prev) => ({ ...prev, [specName]: value }));
    if (specs.some((s) => s.name === specName)) {
      setProductSpecs((prev) => ({ ...prev, [specName]: value }));
    }
    if (phase === "results") triggerShimmer();
  };

  const handleSpecChipChange = (specName, value) => {
    setProductSpecs((prev) => ({ ...prev, [specName]: value }));
    setAssistantAnswers((prev) => ({ ...prev, [specName]: value }));
    if (phase === "results") triggerShimmer();
  };

  // Build the chip filters for the top bar (results phase)
  // Includes both panel filters AND refinement answers from the assistant.
  const topChips = useMemo(() => {
    const list = [];
    if (qty) list.push({ key: "Quantity", value: `${qty} ${unit}`, onRemove: () => setQty("") });
    Object.entries(productSpecs).forEach(([k, v]) => {
      if (v) list.push({ key: k, value: v, onRemove: () => handleSpecChipChange(k, null) });
    });
    selectedMaterials.forEach((m) =>
      list.push({ key: "Material", value: m, onRemove: () => toggleArr(selectedMaterials, setSelectedMaterials, m) })
    );
    selectedBrands.forEach((b) =>
      list.push({ key: "Brand", value: b, onRemove: () => toggleArr(selectedBrands, setSelectedBrands, b) })
    );
    selectedCerts.forEach((c) =>
      list.push({ key: "Cert", value: c, onRemove: () => toggleArr(selectedCerts, setSelectedCerts, c) })
    );
    // Refinement answers (skip ones already covered by productSpecs)
    Object.entries(assistantAnswers).forEach(([k, v]) => {
      if (v && !productSpecs[k]) {
        list.push({ key: k, value: v, onRemove: () => handleAssistantAnswer(k, null) });
      }
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty, unit, productSpecs, selectedMaterials, selectedBrands, selectedCerts, assistantAnswers]);

  const totalFiltersCount = topChips.length;

  if (!open) return null;
  const materialsVisible = showAllMaterials ? MATERIALS_ALL : MATERIALS_ALL.slice(0, 5);

  // ============ MODAL CHROME ============
  return (
    <div
      data-testid="search-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}
    >
      <div
        className="bg-white w-full max-w-[1180px] h-[88vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "fadeIn 0.18s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <SearchIcon size={16} className="text-[#0f1f5c]" />
            <span data-testid="search-modal-query" className="text-[#0a6640] font-bold text-[16px] tracking-tight">
              {query}
            </span>
          </div>
          <button
            data-testid="search-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top chips bar — sits in top space of modal; visible in filters phase
            (when ≥1 chip selected) and always in results phase. Does NOT
            reduce the seller-card area beyond a slim 38px strip. */}
        {phase !== "loading" && (topChips.length > 0 || phase === "results") && (
          <div
            data-testid="top-chips-bar"
            className="flex items-center gap-2 px-5 py-2 border-b border-slate-100 bg-white shrink-0 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">Filters</span>
            {topChips.length === 0 ? (
              <span className="text-[11px] text-slate-400 shrink-0">None applied</span>
            ) : (
              topChips.map((chip, i) => (
                <button
                  key={`${chip.key}-${chip.value}-${i}`}
                  data-testid={`chip-${chip.key}-${chip.value}`}
                  onClick={chip.onRemove}
                  className="group inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-medium hover:bg-teal-100 transition-colors shrink-0"
                >
                  <span className="text-teal-600/80 text-[10px]">{chip.key}:</span>
                  <span className="font-semibold">{chip.value}</span>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 text-teal-700">
                    <X size={10} strokeWidth={2.5} />
                  </span>
                </button>
              ))
            )}
            {phase === "results" && (
              <button
                data-testid="edit-filters-btn"
                onClick={() => setPhase("filters")}
                className="ml-auto inline-flex items-center gap-1 h-7 px-2.5 rounded-full border border-dashed border-slate-300 text-slate-500 hover:text-[#0f1f5c] hover:border-[#0f1f5c] text-[11px] font-semibold transition-colors shrink-0"
                title="Go back to add or change filters"
              >
                <Plus size={11} strokeWidth={2.5} />
                Edit filters
              </button>
            )}
          </div>
        )}

        {/* Body — different layout per phase */}
        {phase !== "results" ? (
          <FiltersBody
            phase={phase}
            loadingMs={loadingMs}
            onLoaded={() => setPhase("results")}
            specs={specs}
            unit={unit} setUnit={setUnit}
            qty={qty} setQty={setQty}
            productSpecs={productSpecs}
            handleSpecChipChange={handleSpecChipChange}
            materialsVisible={materialsVisible}
            showAllMaterials={showAllMaterials}
            setShowAllMaterials={setShowAllMaterials}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedCerts={selectedCerts}
            setSelectedCerts={setSelectedCerts}
            toggleArr={toggleArr}
            sellers={rawSellers}
            query={query}
            favorites={favorites}
            toggleFav={toggleFav}
            onFindBestMatch={() => handleFindBestMatch(5500)}
          />
        ) : (
          <ResultsBody
            shimmer={shimmer}
            topPicks={topPicks}
            query={query}
            qtyVal={Number(qty) || 0}
            specs={specs}
            productSpecs={productSpecs}
            answers={assistantAnswers}
            onAnswer={handleAssistantAnswer}
            onRefine={() => handleFindBestMatch(2500)}
            otherCount={Math.max(0, ranked.length - 5)}
            totalFiltersCount={totalFiltersCount}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97);} to { opacity: 1; transform: scale(1);} }
      `}</style>
    </div>
  );
}

// ============ FILTERS BODY (Phase 1 + Phase 2) ============
function FiltersBody({
  phase, loadingMs, onLoaded,
  specs, unit, setUnit, qty, setQty,
  productSpecs, handleSpecChipChange,
  materialsVisible, showAllMaterials, setShowAllMaterials,
  selectedMaterials, setSelectedMaterials,
  selectedBrands, setSelectedBrands,
  selectedCerts, setSelectedCerts,
  toggleArr,
  sellers, query, favorites, toggleFav,
  onFindBestMatch,
}) {
  // Dedupe: hide generic Material section if a product spec is already called "Material"
  const hasMaterialSpec = specs.some((s) => s.name.toLowerCase() === "material");

  return (
    <div className="flex-1 grid grid-cols-[260px_1fr] overflow-hidden min-h-0">
      {/* LEFT FILTER PANEL */}
      <aside className="border-r border-slate-100 bg-[#f8fafc] flex flex-col overflow-hidden min-h-0" data-testid="filters-panel">
        <div
          className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-3 min-h-0 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Quantity */}
          <div>
            <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Quantity</div>
            <div className="flex items-center gap-1.5">
              <input
                data-testid="qty-input"
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
                className="w-14 h-7 px-2 text-[12px] rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1f5c]/30 focus:border-[#0f1f5c]"
              />
              <div className="flex rounded-md border border-slate-200 overflow-hidden bg-white">
                {UNITS.map((u) => (
                  <button
                    key={u}
                    data-testid={`unit-${u}`}
                    onClick={() => setUnit(u)}
                    className={`px-2 h-7 text-[10.5px] font-medium transition-colors ${
                      unit === u ? "bg-teal-500 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product-specific specs */}
          {specs.map((spec) => (
            <div key={spec.name} data-testid={`spec-filter-${spec.name}`}>
              <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">{spec.name}</div>
              <div className="flex flex-wrap gap-1">
                {spec.options.map((opt) => {
                  const selected = productSpecs[spec.name] === opt;
                  return (
                    <button
                      key={opt}
                      data-testid={`spec-chip-${spec.name}-${opt}`}
                      onClick={() => handleSpecChipChange(spec.name, selected ? null : opt)}
                      className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
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

          {/* Generic Material — only if not already shown as product spec */}
          {!hasMaterialSpec && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Material</div>
              <div className="flex flex-wrap gap-1">
                {materialsVisible.map((m) => (
                  <button
                    key={m}
                    data-testid={`material-${m}`}
                    onClick={() => toggleArr(selectedMaterials, setSelectedMaterials, m)}
                    className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
                      selectedMaterials.includes(m)
                        ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                        : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllMaterials((s) => !s)}
                  className="px-2 h-6 text-[10.5px] text-teal-600 font-semibold hover:underline"
                >
                  {showAllMaterials ? "Less ↑" : "More ↓"}
                </button>
              </div>
            </div>
          )}

          {/* Brand */}
          <div>
            <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Brand</div>
            <div className="flex flex-wrap gap-1">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  data-testid={`brand-${b}`}
                  onClick={() => toggleArr(selectedBrands, setSelectedBrands, b)}
                  className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
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
            <div className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">Certification</div>
            <div className="flex flex-wrap gap-1">
              {CERTS.map((c) => (
                <button
                  key={c}
                  data-testid={`cert-${c}`}
                  onClick={() => toggleArr(selectedCerts, setSelectedCerts, c)}
                  className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
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

        <div className="px-3 py-3 border-t border-slate-200 bg-white shrink-0">
          <button
            data-testid="find-best-match"
            onClick={onFindBestMatch}
            disabled={phase === "loading"}
            className="w-full h-10 rounded-[10px] bg-[#0f1f5c] hover:bg-[#172d80] active:bg-[#0a1748] disabled:opacity-60 text-white text-[12.5px] font-bold transition-all shadow-sm"
          >
            Find Best Match
          </button>
        </div>
      </aside>

      {/* RIGHT — sellers grid OR loading */}
      <div className="flex flex-col overflow-hidden min-h-0 relative">
        {phase === "filters" && (
          <RightDefault sellers={sellers} query={query} favorites={favorites} toggleFav={toggleFav} />
        )}
        {phase === "loading" && (
          <AILoading durationMs={loadingMs} onDone={onLoaded} />
        )}
      </div>
    </div>
  );
}

// ============ RESULTS BODY (Phase 3) ============
function ResultsBody({ shimmer, topPicks, query, qtyVal, specs, productSpecs, answers, onAnswer, onRefine, otherCount, totalFiltersCount }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
      {shimmer && (
        <div data-testid="shimmer" className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0f1f5c]">
            <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" />
            Refreshing results…
          </div>
        </div>
      )}

      {/* Top 5 sellers row */}
      <div className="flex-1 px-5 pt-4 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-[13px] font-bold text-[#0f1f5c]">Top 5 picks for you</h3>
          <button
            data-testid="view-more-link"
            className="text-[11px] font-semibold text-teal-600 hover:underline"
          >
            View {otherCount} more sellers →
          </button>
        </div>
        <div
          className="grid grid-cols-5 gap-3"
          data-testid="top-picks-grid"
        >
          {topPicks.map((s, i) => (
            <TopPickCard key={s.name + i} seller={s} totalFilters={totalFiltersCount} />
          ))}
          {topPicks.length === 0 && (
            <div className="col-span-5 text-center text-[12px] text-slate-500 py-10">
              No matches found
            </div>
          )}
        </div>
      </div>

      {/* Buyer assistant */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-[#f8fafc]">
        <BuyerAssistant
          productName={query}
          filledSpecs={productSpecs}
          isqSpecs={specs.map((s) => s.name)}
          quantity={qtyVal}
          answers={answers}
          onAnswer={onAnswer}
          onRefine={onRefine}
        />
      </div>
    </div>
  );
}

// ============ Right panel default (sellers grid in filters phase) ==========
function RightDefault({ sellers, query, favorites, toggleFav }) {
  return (
    <>
      <div className="px-6 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="text-[12.5px] font-semibold text-slate-800">
          Relevant Sellers <span className="text-slate-400 font-normal">· {sellers.length} found</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-5 min-h-0">
        {sellers.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500 py-20">
            No sellers found for "{query}"
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3" data-testid="sellers-grid">
            {sellers.map((s, i) => (
              <div
                key={s.name + i}
                data-testid={`seller-${s.name}`}
                className="bg-white border border-slate-200 rounded-[10px] overflow-hidden hover:border-teal-400 hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {s.price}
                  </div>
                  <button
                    onClick={() => toggleFav(s.name)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white"
                    data-testid={`fav-${s.name}`}
                  >
                    <Heart size={13} className={favorites.has(s.name) ? "fill-red-500 text-red-500" : "text-slate-500"} />
                  </button>
                </div>
                <div className="p-2.5">
                  <div className="font-bold text-[12.5px] text-slate-900 truncate">{s.name}</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">{s.location}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="flex items-center gap-0.5 text-amber-700 font-semibold text-[10.5px]">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      {s.rating}
                    </span>
                    <span className="text-[10.5px] text-slate-500">({s.reviews})</span>
                    {s.gst && (
                      <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
                        <CheckCircle2 size={10} className="text-emerald-500" /> GST
                      </span>
                    )}
                  </div>
                  <button
                    data-testid={`enquiry-${s.name}`}
                    className="mt-2 w-full h-8 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-[11.5px] font-bold transition-colors"
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
