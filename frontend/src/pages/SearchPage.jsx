import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Filter, ChevronDown, ChevronUp, SlidersHorizontal,
  Factory, Globe2, Package, Store, ShoppingBag, Wrench, Sparkles,
  ShieldCheck, CheckCircle2, IndianRupee, Star,
} from "lucide-react";
import Header from "../components/Header";
import LocationPicker from "../components/search/LocationPicker";
import SellerCard from "../components/search/SellerCard";
import AILoading from "../components/search/AILoading";
import BuyerAssistant from "../components/search/BuyerAssistant";
import CollapsibleSidebar from "../components/search/CollapsibleSidebar";
import Toast from "../components/search/Toast";
import { searchSellers } from "../data/mockData";
import { rankSellers } from "../components/search/rankSellers";

const UNITS = ["Meter", "kg", "Piece"];
const MATERIALS_ALL = ["Steel", "Aluminium", "Copper", "Plastic", "Brass", "Wood", "Glass", "Rubber"];
const BRANDS = ["Generic", "Branded", "OEM"];
const CERTS = ["ISO Certified", "BIS Certified", "CE Marked"];

const TRUST_FILTERS = [
  { id: "gst", label: "GST Verified", icon: CheckCircle2 },
  { id: "trustseal", label: "TrustSEAL", icon: ShieldCheck },
  { id: "premium", label: "Premium Sellers", icon: Star },
  { id: "rating", label: "4★ & above", icon: Star },
  { id: "yr1", label: "1+ Year", icon: CheckCircle2 },
  { id: "turnover", label: "₹5cr+ Turnover", icon: IndianRupee },
  { id: "gst3", label: "GST 3+ Years", icon: CheckCircle2 },
  { id: "pay", label: "Payment Protected", icon: ShieldCheck, comingSoon: true },
];

const BUSINESS_TYPES = [
  { id: "manufacturer", label: "Manufacturer", icon: Factory },
  { id: "exporter", label: "Exporter", icon: Globe2 },
  { id: "wholesaler", label: "Wholesaler", icon: Package },
  { id: "retailer", label: "Retailer", icon: Store },
  { id: "trader", label: "Trader", icon: ShoppingBag },
  { id: "service", label: "Service Provider", icon: Wrench },
];

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

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchPage() {
  const nav = useNavigate();
  const params = useQuery();
  const query = params.get("q") || "";
  const initialLoc = params.get("loc") || "Dharamsala";

  // Phase: 'filters' | 'loading' | 'results'
  const [phase, setPhase] = useState("filters");
  const [loadingMs, setLoadingMs] = useState(5500);
  const [location, setLocation] = useState(initialLoc);
  const [localOnly, setLocalOnly] = useState(false);

  // Filters state
  const [unit, setUnit] = useState("Meter");
  const [qty, setQty] = useState("");
  const [showAllMat, setShowAllMat] = useState(false);
  const [selectedMat, setSelectedMat] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedCert, setSelectedCert] = useState([]);
  const [selectedTrust, setSelectedTrust] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState([]);
  const [productSpecs, setProductSpecs] = useState({});
  const [assistantAnswers, setAssistantAnswers] = useState({});

  // Display
  const [favorites, setFavorites] = useState(new Set());
  const [shimmer, setShimmer] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [enquiryToast, setEnquiryToast] = useState(null); // { sellerName } | null

  // Mobile filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Collapsible filter sections — order matters: Specs first, then Trust, then Business Type
  const [openSections, setOpenSections] = useState({
    specs: true, trust: true, biz: true, qty: true, mat: true, brand: true, cert: true,
  });

  const specs = useMemo(() => getProductSpecs(query), [query]);
  const allSellers = useMemo(() => searchSellers(query), [query]);
  const filteredSellers = useMemo(() => {
    if (!localOnly || !location) return allSellers;
    const c = location.toLowerCase();
    return allSellers.filter((s) => (s.location || "").toLowerCase().includes(c));
  }, [allSellers, localOnly, location]);
  const ranked = useMemo(
    () => rankSellers(filteredSellers, { ...productSpecs, ...assistantAnswers }),
    [filteredSellers, productSpecs, assistantAnswers]
  );

  // In filters phase show 8 (4×2 rows). In results phase show 4 in a single row,
  // paginated via the carousel arrows so the rest of the sellers stay reachable.
  const PAGE_SIZE_RESULTS = 4;
  const cardLimit = phase === "results" ? PAGE_SIZE_RESULTS : 8;
  const [bestMatchPage, setBestMatchPage] = useState(0);
  const totalResultPages = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE_RESULTS));
  // Reset carousel page whenever the underlying list changes
  useEffect(() => { setBestMatchPage(0); }, [ranked.length]);
  const visibleSellers = phase === "results"
    ? ranked.slice(bestMatchPage * PAGE_SIZE_RESULTS, bestMatchPage * PAGE_SIZE_RESULTS + PAGE_SIZE_RESULTS)
    : ranked.slice(0, cardLimit);

  const handleAssistantSubmit = () => {
    setToastOpen(true);
    handleFindBestMatch(2500);
  };

  const triggerShimmer = () => {
    setShimmer(true);
    setTimeout(() => setShimmer(false), 800);
  };

  const toggleArr = (list, setList, value) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else setList([...list, value]);
  };

  const handleSpecChange = (name, value) => {
    setProductSpecs((p) => ({ ...p, [name]: value }));
    setAssistantAnswers((p) => ({ ...p, [name]: value }));
    if (phase === "results") triggerShimmer();
  };

  const handleAssistantAnswer = (specName, value) => {
    setAssistantAnswers((p) => ({ ...p, [specName]: value }));
    if (specs.some((s) => s.name === specName)) {
      setProductSpecs((p) => ({ ...p, [specName]: value }));
    }
    if (phase === "results") triggerShimmer();
  };

  // Top chip list (selected filters + refinement answers)
  const topChips = useMemo(() => {
    const list = [];
    if (qty) list.push({ key: "Quantity", value: `${qty} ${unit}`, onRemove: () => setQty("") });
    Object.entries(productSpecs).forEach(([k, v]) => {
      if (v) list.push({ key: k, value: v, onRemove: () => handleSpecChange(k, null) });
    });
    selectedMat.forEach((m) => list.push({ key: "Material", value: m, onRemove: () => toggleArr(selectedMat, setSelectedMat, m) }));
    selectedBrand.forEach((b) => list.push({ key: "Brand", value: b, onRemove: () => toggleArr(selectedBrand, setSelectedBrand, b) }));
    selectedCert.forEach((c) => list.push({ key: "Cert", value: c, onRemove: () => toggleArr(selectedCert, setSelectedCert, c) }));
    selectedTrust.forEach((t) => {
      const tf = TRUST_FILTERS.find((x) => x.id === t);
      list.push({ key: "Trust", value: tf?.label || t, onRemove: () => toggleArr(selectedTrust, setSelectedTrust, t) });
    });
    selectedBiz.forEach((b) => {
      const bt = BUSINESS_TYPES.find((x) => x.id === b);
      list.push({ key: "Type", value: bt?.label || b, onRemove: () => toggleArr(selectedBiz, setSelectedBiz, b) });
    });
    Object.entries(assistantAnswers).forEach(([k, v]) => {
      if (v && !productSpecs[k]) {
        list.push({ key: k, value: v, onRemove: () => handleAssistantAnswer(k, null) });
      }
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty, unit, productSpecs, selectedMat, selectedBrand, selectedCert, selectedTrust, selectedBiz, assistantAnswers]);

  const handleFindBestMatch = (durationMs = 5500) => {
    setLoadingMs(durationMs);
    setPhase("loading");
    setMobileFiltersOpen(false);
  };

  const totalFiltersCount = topChips.length;

  // Header search-bar handler — re-route on new query
  const onHeaderSearch = (q) => { if (q) nav(`/search?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(location)}`); };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* IndiaMART top header (re-used) */}
      <Header
        location={location}
        setLocation={setLocation}
        onSearch={onHeaderSearch}
        query={query}
        setQuery={() => {}}
        hideSearch
      />

      {/* Main body — fully fixed height, no page scroll */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Slim collapsible left nav (icons only) — extends up to header */}
        <CollapsibleSidebar active="dashboard" onNavigate={(href) => nav(href)} />

        {/* Filter panel (sticky) — also extends up to header */}
        <FilterPanel
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
          openSections={openSections}
          setOpenSections={setOpenSections}
          unit={unit} setUnit={setUnit}
          qty={qty} setQty={setQty}
          specs={specs}
          productSpecs={productSpecs}
          handleSpecChange={handleSpecChange}
          showAllMat={showAllMat} setShowAllMat={setShowAllMat}
          selectedMat={selectedMat} setSelectedMat={setSelectedMat}
          selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
          selectedCert={selectedCert} setSelectedCert={setSelectedCert}
          selectedTrust={selectedTrust} setSelectedTrust={setSelectedTrust}
          selectedBiz={selectedBiz} setSelectedBiz={setSelectedBiz}
          toggleArr={toggleArr}
          onFindBestMatch={() => handleFindBestMatch(5500)}
          phase={phase}
        />

        {/* Right content — flex column, internal regions sized so no page scroll */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Sub-header — Back · query · location · Local only · count */}
          <div className="bg-white border-b border-slate-200 shrink-0">
            <div className="px-3 md:px-5 py-2 flex items-center gap-2.5 flex-wrap">
              <button
                data-testid="back-btn"
                onClick={() => nav(-1)}
                aria-label="Back"
                title="Back"
                className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-600 hover:text-[#0f1f5c] hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <h1
                data-testid="search-page-query"
                className="shrink-0 text-[16px] md:text-[17px] font-bold text-[#0a6640] tracking-tight truncate max-w-[40vw] capitalize"
              >
                {query}
              </h1>
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <LocationPicker value={location} onChange={setLocation} />
                <label
                  data-testid="local-only-toggle"
                  className="inline-flex items-center gap-1.5 cursor-pointer select-none h-7 px-2 rounded-md border border-slate-200 bg-white hover:border-teal-400 transition-colors"
                >
                  <input
                    type="checkbox"
                    data-testid="local-only-checkbox"
                    checked={localOnly}
                    onChange={(e) => { setLocalOnly(e.target.checked); triggerShimmer(); }}
                    className="w-3.5 h-3.5 accent-teal-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">Local only</span>
                </label>
                <span className="text-[11px] text-slate-500 hidden sm:block">
                  <span className="font-bold text-slate-800">{ranked.length}</span> results
                </span>
              </div>
            </div>
          </div>

          {/* Inner padded region */}
          <div className="flex-1 min-h-0 px-3 md:px-4 py-2.5 flex flex-col overflow-hidden">
          {/* Mobile filter trigger */}
          <button
            data-testid="open-mobile-filters"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden mb-2 inline-flex items-center gap-1.5 self-start px-3 h-8 rounded-md border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 hover:border-teal-400"
          >
            <SlidersHorizontal size={14} /> Filters
            {totalFiltersCount > 0 && (
              <span className="bg-teal-500 text-white text-[10px] rounded-full px-1.5 ml-1">{totalFiltersCount}</span>
            )}
          </button>

          {/* Selected chips bar */}
          {topChips.length > 0 && (
            <div data-testid="top-chips-bar" className="mb-2 flex items-center gap-1.5 flex-wrap shrink-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide shrink-0">Filters:</span>
              {topChips.map((chip, i) => (
                <button
                  key={`${chip.key}-${chip.value}-${i}`}
                  data-testid={`chip-${chip.key}-${chip.value}`}
                  onClick={chip.onRemove}
                  className="group inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10.5px] font-medium hover:bg-teal-100 transition-colors"
                >
                  <span className="text-teal-600/80 text-[9.5px]">{chip.key}:</span>
                  <span className="font-semibold">{chip.value}</span>
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-teal-100 group-hover:bg-teal-200 text-teal-700">
                    <span className="text-[10px] leading-none">×</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {phase === "loading" && (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 relative min-h-0">
              <AILoading durationMs={loadingMs} onDone={() => setPhase("results")} />
            </div>
          )}

          {/* Filters / Results: seller grid + view-more + assistant — all fit in viewport */}
          {phase !== "loading" && (
            <div className="flex-1 flex flex-col min-h-0 relative">
              {shimmer && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0f1f5c]">
                    <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" /> Refreshing results…
                  </div>
                </div>
              )}

              {phase === "results" && (
                <div className="mb-1.5 flex items-center gap-2 shrink-0">
                  <Sparkles size={14} className="text-amber-500" />
                  <h3 className="text-[12.5px] font-bold text-[#0f1f5c]">Top picks for you</h3>
                </div>
              )}

              {/* Sellers grid — 4 cols.
                  - In FILTERS phase: 4 × 2 = 8 cards (grid-auto rows).
                  - In RESULTS phase: a SINGLE row of 4 with prev/next arrows
                    that page through the remaining sellers (no clutter, but
                    nothing is hidden either). */}
              {phase === "results" ? (
                <div className="relative shrink-0">
                  <div
                    data-testid="sellers-grid"
                    className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 min-h-0 overflow-hidden"
                  >
                    {visibleSellers.map((s, i) => (
                      <SellerCard
                        key={s.name + i + bestMatchPage}
                        seller={s}
                        totalFilters={totalFiltersCount}
                        showSpecMatch={true}
                        onFavToggle={(n) => {
                          const nx = new Set(favorites);
                          nx.has(n) ? nx.delete(n) : nx.add(n);
                          setFavorites(nx);
                        }}
                        isFav={favorites.has(s.name)}
                        onEnquiry={(sel) => {
                          setEnquiryToast({ sellerName: sel.name, at: Date.now() });
                          setTimeout(() => setEnquiryToast(null), 2400);
                        }}
                      />
                    ))}
                    {ranked.length === 0 && (
                      <div className="col-span-full text-center py-10 text-[13px] text-slate-500">
                        No sellers found. Try removing a filter or expanding location.
                      </div>
                    )}
                  </div>

                  {/* Carousel controls — show only when more than one page */}
                  {totalResultPages > 1 && (
                    <>
                      <button
                        data-testid="results-prev"
                        onClick={() => setBestMatchPage((p) => Math.max(0, p - 1))}
                        disabled={bestMatchPage === 0}
                        aria-label="Previous sellers"
                        className="absolute -left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#0f1f5c] hover:border-[#0f1f5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10"
                      >
                        <ArrowLeft size={14} />
                      </button>
                      <button
                        data-testid="results-next"
                        onClick={() => setBestMatchPage((p) => Math.min(totalResultPages - 1, p + 1))}
                        disabled={bestMatchPage >= totalResultPages - 1}
                        aria-label="Next sellers"
                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#0f1f5c] hover:border-[#0f1f5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10"
                      >
                        <ArrowRight size={14} />
                      </button>
                      <div
                        data-testid="results-pagination"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1"
                      >
                        {Array.from({ length: totalResultPages }).map((_, p) => (
                          <button
                            key={p}
                            onClick={() => setBestMatchPage(p)}
                            aria-label={`Page ${p + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                              p === bestMatchPage ? "w-4 bg-[#0f1f5c]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div
                  data-testid="sellers-grid"
                  className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 min-h-0 overflow-hidden shrink-0"
                  style={{ gridTemplateRows: "min-content min-content" }}
                >
                  {visibleSellers.map((s, i) => (
                    <SellerCard
                      key={s.name + i}
                      seller={s}
                      totalFilters={totalFiltersCount}
                      showSpecMatch={false}
                      onFavToggle={(n) => {
                        const nx = new Set(favorites);
                        nx.has(n) ? nx.delete(n) : nx.add(n);
                        setFavorites(nx);
                      }}
                      isFav={favorites.has(s.name)}
                      onEnquiry={(sel) => {
                        setEnquiryToast({ sellerName: sel.name, at: Date.now() });
                        setTimeout(() => setEnquiryToast(null), 2400);
                      }}
                    />
                  ))}
                  {ranked.length === 0 && (
                    <div className="col-span-full text-center py-10 text-[13px] text-slate-500">
                      No sellers found. Try removing a filter or expanding location.
                    </div>
                  )}
                </div>
              )}

              {/* Buyer assistant — appears in results phase */}
              {phase === "results" && (
                <div className="mt-2 shrink-0">
                  <BuyerAssistant
                    productName={query}
                    filledSpecs={productSpecs}
                    isqSpecs={specs.map((s) => s.name)}
                    quantity={Number(qty) || 0}
                    answers={assistantAnswers}
                    onAnswer={handleAssistantAnswer}
                    onSubmit={handleAssistantSubmit}
                  />
                </div>
              )}
            </div>
          )}
          </div>
        </main>
      </div>
      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Requirement captured"
        sub="More sellers will connect with you over SMS & Email."
      />

      {/* Enquiry sent toast */}
      {enquiryToast && (
        <div
          data-testid="enquiry-sent-toast"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-[12.5px] font-semibold flex items-center gap-2 animate-phone-chip"
        >
          <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          Enquiry sent to <span className="font-bold">{enquiryToast.sellerName}</span>
        </div>
      )}
    </div>
  );
}

/* ============= Filter panel ============= */

function Section({ title, icon: Icon, openKey, openSections, setOpenSections, children, count }) {
  const open = openSections[openKey];
  return (
    <div className="border-t border-slate-100 first:border-t-0 -mx-3 px-3">
      <button
        onClick={() => setOpenSections((s) => ({ ...s, [openKey]: !s[openKey] }))}
        className="w-full flex items-center gap-2 py-2.5"
      >
        {Icon && <Icon size={13} className="text-[#0f1f5c]" />}
        <span className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider flex-1 text-left">{title}</span>
        {count > 0 && (
          <span className="bg-teal-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{count}</span>
        )}
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function FilterPanel(props) {
  const {
    mobileOpen, onMobileClose, openSections, setOpenSections,
    unit, setUnit, qty, setQty,
    specs, productSpecs, handleSpecChange,
    showAllMat, setShowAllMat,
    selectedMat, setSelectedMat,
    selectedBrand, setSelectedBrand,
    selectedCert, setSelectedCert,
    selectedTrust, setSelectedTrust,
    selectedBiz, setSelectedBiz,
    toggleArr, onFindBestMatch, phase,
  } = props;
  const matVisible = showAllMat ? MATERIALS_ALL : MATERIALS_ALL.slice(0, 5);
  const hasMaterialSpec = specs.some((s) => s.name.toLowerCase() === "material");

  // Mobile-only close affordance (desktop has no header bar — declutters the panel)
  const MobileClose = (
    <div className="lg:hidden flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-white shrink-0">
      <span className="text-[12px] font-bold text-slate-800 inline-flex items-center gap-1.5">
        <Filter size={14} className="text-[#0f1f5c]" /> Filters
      </span>
      <button onClick={onMobileClose} className="text-slate-500 text-[14px] leading-none">✕</button>
    </div>
  );

  const Inner = (
    <>
      {MobileClose}
      <div className="flex-1 overflow-y-auto px-3 pt-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {/* Quantity — first, no wrapper section */}
        <div className="py-3 border-b border-slate-100">
          <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Quantity</div>
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

        {/* Product-specific specs — flat layout, no nested box */}
        {specs.length > 0 && specs.map((spec) => (
          <div
            key={spec.name}
            data-testid={`spec-${spec.name}`}
            className="py-3 border-b border-slate-100"
          >
            <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{spec.name}</div>
            <div className="flex flex-wrap gap-1">
              {spec.options.map((opt) => {
                const sel = productSpecs[spec.name] === opt;
                return (
                  <button
                    key={opt}
                    data-testid={`spec-chip-${spec.name}-${opt}`}
                    onClick={() => handleSpecChange(spec.name, sel ? null : opt)}
                    className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
                      sel
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

        {/* Material — only when not already covered by product specs */}
        {!hasMaterialSpec && (
          <div className="py-3 border-b border-slate-100">
            <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Material</div>
            <div className="flex flex-wrap gap-1">
              {matVisible.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleArr(selectedMat, setSelectedMat, m)}
                  className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
                    selectedMat.includes(m)
                      ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                  }`}
                >
                  {m}
                </button>
              ))}
              <button
                onClick={() => setShowAllMat((s) => !s)}
                className="px-2 h-6 text-[10.5px] text-teal-600 font-semibold hover:underline"
              >
                {showAllMat ? "Less ↑" : "More ↓"}
              </button>
            </div>
          </div>
        )}

        {/* Brand */}
        <div className="py-3 border-b border-slate-100">
          <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Brand</div>
          <div className="flex flex-wrap gap-1">
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => toggleArr(selectedBrand, setSelectedBrand, b)}
                className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
                  selectedBrand.includes(b)
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
        <div className="py-3 border-b border-slate-100">
          <div className="text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Certification</div>
          <div className="flex flex-wrap gap-1">
            {CERTS.map((c) => (
              <button
                key={c}
                onClick={() => toggleArr(selectedCert, setSelectedCert, c)}
                className={`px-2 h-6 text-[10.5px] rounded-md border transition-colors ${
                  selectedCert.includes(c)
                    ? "bg-teal-50 border-teal-400 text-teal-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:border-teal-300 bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Filters — collapsible */}
        <Section title="Trust Filters" icon={ShieldCheck} openKey="trust" openSections={openSections} setOpenSections={setOpenSections} count={selectedTrust.length}>
          <div className="flex flex-wrap gap-1">
            {TRUST_FILTERS.map((t) => {
              const Icon = t.icon;
              const sel = selectedTrust.includes(t.id);
              const disabled = !!t.comingSoon;
              return (
                <button
                  key={t.id}
                  data-testid={`trust-${t.id}`}
                  disabled={disabled}
                  onClick={() => !disabled && toggleArr(selectedTrust, setSelectedTrust, t.id)}
                  className={`relative inline-flex items-center gap-1 px-2 h-6 text-[10.5px] rounded-full border transition-colors whitespace-nowrap ${
                    disabled
                      ? "border-amber-200 bg-amber-50/70 text-amber-800 cursor-not-allowed"
                      : sel
                      ? "bg-[#0f1f5c] border-[#0f1f5c] text-white font-semibold"
                      : "border-slate-200 text-slate-600 hover:border-[#0f1f5c] bg-white"
                  }`}
                  title={disabled ? "Payment Protected — coming soon" : t.label}
                >
                  <Icon size={9.5} />
                  <span className="font-semibold">{t.label}</span>
                  {disabled && (
                    <span className="ml-0.5 text-[8.5px] font-bold bg-amber-200/70 text-amber-900 px-1.5 py-[1px] rounded-full leading-none">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Business Type — collapsible */}
        <Section title="Business Type" icon={Factory} openKey="biz" openSections={openSections} setOpenSections={setOpenSections} count={selectedBiz.length}>
          <div className="space-y-1.5">
            {BUSINESS_TYPES.map((b) => {
              const Icon = b.icon;
              const checked = selectedBiz.includes(b.id);
              return (
                <label
                  key={b.id}
                  data-testid={`biz-${b.id}`}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded px-1 py-1"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArr(selectedBiz, setSelectedBiz, b.id)}
                    className="w-3.5 h-3.5 accent-teal-500 cursor-pointer"
                  />
                  <Icon size={13} className="text-slate-500" />
                  <span className="text-[12px] text-slate-700">{b.label}</span>
                </label>
              );
            })}
          </div>
        </Section>
      </div>
      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        <button
          data-testid="find-best-match"
          onClick={onFindBestMatch}
          disabled={phase === "loading"}
          className="w-full h-10 rounded-[10px] bg-[#0f1f5c] hover:bg-[#172d80] disabled:opacity-60 text-white text-[12.5px] font-bold transition-all shadow-sm"
        >
          Find Best Match
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sticky panel — height comes from parent flex container */}
      <aside className="hidden lg:flex w-[240px] shrink-0 border-r border-slate-200 bg-white flex-col h-full">
        {Inner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/50" onClick={onMobileClose} />
          <div className="relative ml-auto w-[300px] max-w-[85vw] h-full bg-white flex flex-col shadow-2xl">
            {Inner}
          </div>
        </div>
      )}
    </>
  );
}
