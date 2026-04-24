import React, { useRef } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Trash2, FileBox } from "lucide-react";
import { ACTIVE_ORDER } from "../data/mockData";

function SellerCard({ seller }) {
  return (
    <div
      className={`min-w-[220px] w-[220px] shrink-0 rounded-lg border ${
        seller.tag === "Top Rated" ? "border-amber-300" : "border-slate-200"
      } bg-white p-3 relative hover:shadow-md transition-shadow`}
      data-testid={`active-seller-${seller.name}`}
    >
      {seller.tag && (
        <span
          className={`absolute -top-2 left-3 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
            seller.tag === "Top Rated"
              ? "bg-amber-400 text-slate-900"
              : seller.tag === "Lowest Price"
              ? "bg-emerald-500 text-white"
              : "bg-teal-500 text-white"
          }`}
        >
          {seller.tag.toUpperCase()}
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-slate-900 truncate">{seller.name}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{seller.location}</div>
        </div>
        {seller.newCount > 0 && (
          <span className="shrink-0 bg-rose-50 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
            {seller.newCount} new
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 text-[11px] font-semibold">
          <Star size={10} className="fill-amber-500 text-amber-500" />
          {seller.rating}
        </div>
        <span className="text-[11px] text-slate-500">({seller.reviews})</span>
      </div>

      <div className="mt-2 text-slate-900 font-bold text-base">{seller.price}</div>

      <div className="flex items-center gap-1 mt-1 flex-wrap">
        {seller.gst && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 size={11} className="text-emerald-500" /> GST
          </span>
        )}
        {seller.trustSeal && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 ml-1">
            <CheckCircle2 size={11} className="text-amber-500" /> TrustSEAL
          </span>
        )}
      </div>

      <div className="text-[10px] text-slate-500 mt-1">Member since {seller.memberSince}</div>

      <button
        data-testid={`continue-seller-${seller.name}`}
        className="w-full mt-3 h-9 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-xs font-semibold transition-colors"
      >
        Continue with Seller
      </button>
    </div>
  );
}

export default function ActiveOrder() {
  const scroller = useRef(null);
  const scroll = (dir) => {
    if (!scroller.current) return;
    scroller.current.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5" data-testid="active-order-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileBox size={15} className="text-teal-600" />
          <h2 className="text-xs font-bold tracking-[0.14em] text-teal-700">ACTIVE ORDER</h2>
        </div>
        <div className="flex items-center gap-3">
          <button data-testid="view-more-active" className="text-xs font-semibold text-teal-600 hover:underline">View More</button>
          <button className="text-slate-400 hover:text-rose-500" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        <img
          src={ACTIVE_ORDER.image}
          alt="Diesel Generator"
          className="w-32 h-32 rounded-lg border border-slate-200 object-contain bg-slate-50 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{ACTIVE_ORDER.name}</h3>
              <div className="text-xs text-slate-500 mt-0.5">Posted {ACTIVE_ORDER.posted}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {ACTIVE_ORDER.specs.map((s) => (
              <div key={s.label} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="text-slate-500">{s.label}:</span> <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button data-testid="compare-quotes-btn" className="h-9 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-xs font-semibold transition-colors">
              Compare Quotes
            </button>
            <button data-testid="procurement-btn" className="h-9 px-4 bg-white border border-slate-300 hover:border-teal-400 text-slate-800 rounded-md text-xs font-semibold transition-colors">
              Get Procurement Manager
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-5">
        <div
          ref={scroller}
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide pt-3"
          style={{ scrollbarWidth: "none" }}
          data-testid="sellers-scroller"
        >
          {ACTIVE_ORDER.sellers.map((s) => (
            <SellerCard key={s.name} seller={s} />
          ))}
        </div>
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
          data-testid="scroll-left-sellers"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
          data-testid="scroll-right-sellers"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
