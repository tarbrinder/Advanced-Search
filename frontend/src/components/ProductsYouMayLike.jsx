import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { SUGGESTED_PRODUCTS } from "../data/mockData";

export default function ProductsYouMayLike() {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 260, behavior: "smooth" });

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5" data-testid="products-section">
      <h2 className="text-base font-bold text-slate-900 mb-4">Products You May Like</h2>
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {SUGGESTED_PRODUCTS.map((p) => (
            <div
              key={p.name}
              data-testid={`product-${p.name}`}
              className="min-w-[215px] w-[215px] shrink-0 rounded-lg border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover" />
                <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded text-sm font-bold text-slate-900 shadow-sm">
                  {p.price}
                </div>
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm text-slate-900 truncate">{p.name}</div>
                <div className="text-[11px] text-slate-600 mt-1 truncate">{p.company}</div>
                <div className="text-[11px] text-slate-500">{p.location}</div>
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  {p.gst && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
                      <CheckCircle2 size={10} className="text-emerald-500" /> GST
                    </span>
                  )}
                  {p.trustSeal && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700">
                      <CheckCircle2 size={10} className="text-amber-500" /> TrustSEAL
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Member since {p.memberSince}</div>
                <button
                  data-testid={`get-best-price-${p.name}`}
                  className="mt-3 w-full h-8 bg-teal-500 hover:bg-teal-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  Get Best Price
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
