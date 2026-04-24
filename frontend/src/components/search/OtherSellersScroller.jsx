import React, { useRef } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Compact version of the seller card, used in the horizontal scroller
 * for "Other relevant sellers".
 */
function CompactCard({ seller }) {
  return (
    <div
      data-testid={`other-seller-${seller.name}`}
      className="min-w-[180px] w-[180px] shrink-0 rounded-[10px] bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          src={seller.image}
          alt={seller.name}
          className="w-full h-28 object-cover"
          onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
        />
        <div className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {seller.price}
        </div>
      </div>
      <div className="p-2.5">
        <div className="font-semibold text-[12px] text-slate-900 truncate">{seller.name}</div>
        <div className="text-[10px] text-slate-500 truncate">{seller.location}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="flex items-center gap-0.5 text-amber-600 font-semibold text-[10px]">
            <Star size={9} className="fill-amber-500 text-amber-500" />
            {seller.rating}
          </span>
          <span className="text-[10px] text-slate-400">({seller.reviews})</span>
          {seller.gst && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700">
              <CheckCircle2 size={9} /> GST
            </span>
          )}
        </div>
        <button className="w-full mt-2 h-7 bg-teal-500 hover:bg-teal-600 text-white rounded text-[11px] font-semibold transition-colors">
          Send Enquiry
        </button>
      </div>
    </div>
  );
}

export default function OtherSellersScroller({ sellers = [] }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 220, behavior: "smooth" });

  return (
    <div data-testid="other-sellers-section">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h4 className="text-[13px] font-semibold text-slate-900">Other relevant sellers</h4>
          <p className="text-[11px] text-slate-400">Scroll to explore more options →</p>
        </div>
      </div>

      <div className="relative">
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {sellers.map((s, i) => (
            <CompactCard key={s.name + i} seller={s} />
          ))}
          {sellers.length > 0 && (
            <button
              data-testid="view-more-sellers-end"
              className="min-w-[180px] w-[180px] shrink-0 rounded-[10px] border-2 border-dashed border-teal-300 bg-teal-50/30 text-teal-600 text-xs font-semibold hover:bg-teal-50 transition-colors"
            >
              Click here to view<br />more sellers →
            </button>
          )}
        </div>

        {sellers.length > 3 && (
          <>
            <button
              onClick={() => scroll(-1)}
              data-testid="other-sellers-prev"
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll(1)}
              data-testid="other-sellers-next"
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
              aria-label="Next"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
