import React from "react";
import { Star, CheckCircle2, MessageSquare } from "lucide-react";
import { PAST_ORDER } from "../data/mockData";

export default function PastOrders() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5" data-testid="past-orders-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">Past Orders</h2>
        <button data-testid="view-more-past" className="text-xs font-semibold text-teal-600 hover:underline">View More</button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900">{PAST_ORDER.name}</h3>
        <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
          <span><b>Type:</b> {PAST_ORDER.type}</span>
          <span><b>Coverage:</b> {PAST_ORDER.coverage}</span>
          <button className="text-teal-600 font-semibold hover:underline">More Details...</button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button data-testid="more-quotes-btn" className="h-8 px-3 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:border-teal-400">
            Get More Quotes
          </button>
          <button data-testid="share-feedback-btn" className="h-8 px-3 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:border-teal-400">
            Share Feedback
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
        {PAST_ORDER.sellers.map((s) => (
          <div
            key={s.name}
            data-testid={`past-seller-${s.name}`}
            className="relative rounded-lg border border-slate-200 bg-white p-3 hover:shadow-md transition-shadow"
          >
            {s.tag && (
              <span
                className={`absolute -top-2 left-3 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                  s.tag === "Best Price"
                    ? "bg-emerald-500 text-white"
                    : s.tag === "Top Rated"
                    ? "bg-amber-400 text-slate-900"
                    : "bg-teal-500 text-white"
                }`}
              >
                {s.tag.toUpperCase()}
              </span>
            )}
            <div className="font-semibold text-sm text-slate-900 mt-1">{s.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{s.location}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 text-[11px] font-semibold">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                {s.rating}
              </div>
              <span className="text-[11px] text-slate-500">({s.reviews})</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {s.gst && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 size={10} className="text-emerald-500" /> GST
                </span>
              )}
              {s.trustSeal && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 ml-1">
                  <CheckCircle2 size={10} className="text-amber-500" /> TrustSEAL
                </span>
              )}
            </div>
            <button className="mt-3 w-full h-8 bg-white border border-teal-400 text-teal-700 hover:bg-teal-50 rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1">
              <MessageSquare size={11} />
              Continue with Seller
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
