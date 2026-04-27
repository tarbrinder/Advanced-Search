import React from "react";
import { Star, ShieldCheck, CheckCircle2, MapPin } from "lucide-react";

/**
 * Compact uniform seller card.
 * - 5-star visual rating (filled to the rating value)
 * - Tags: GST, TrustSEAL, Payment Protected, Spec match (X/N)
 * - No distance, no rank ribbon, no emerald border
 */

function StarRow({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={11}
          className={
            i < Math.round(rating)
              ? "fill-amber-500 text-amber-500"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
      <span className="ml-1 text-[10px] font-semibold text-slate-700">{rating}</span>
      {/* `reviews` count omitted to keep card tight; expose via title */}
    </div>
  );
}

function Tag({ active, label, icon: Icon, activeClass, inactiveClass, title }) {
  return (
    <span
      title={title || label}
      className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
        active ? activeClass : inactiveClass
      }`}
    >
      {Icon && <Icon size={8.5} />}
      {label}
    </span>
  );
}

export default function TopPickCard({ seller, totalFilters = 0 }) {
  // Spec-match: cap by totalFilters; if no filters selected fall back to seller.specMatch out of 3.
  const matchOutOf = totalFilters > 0 ? totalFilters : 3;
  const matched = Math.min(matchOutOf, Math.max(1, Math.round((seller.specMatch / 5) * matchOutOf)));

  return (
    <div
      data-testid={`top-pick-${seller.name}`}
      className="rounded-[10px] bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="relative">
        <img
          src={seller.image}
          alt={seller.name}
          className="w-full h-24 object-cover"
          onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
        />
        <div className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
          {seller.price}
        </div>
      </div>

      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <div>
          <div className="font-bold text-[12.5px] text-slate-900 truncate leading-tight">{seller.name}</div>
          <div className="text-[10px] text-slate-500 truncate flex items-center gap-0.5">
            <MapPin size={9} className="text-slate-400" />
            {seller.location}
          </div>
        </div>

        <StarRow rating={seller.rating} />

        <div className="flex items-center gap-1 flex-wrap">
          <Tag
            active={!!seller.gst}
            label="GST"
            icon={CheckCircle2}
            activeClass="text-emerald-700 bg-emerald-50"
            inactiveClass="text-slate-400 bg-slate-100 line-through"
            title={seller.gst ? "GST verified" : "GST not verified"}
          />
          <Tag
            active={!!seller.trustSeal}
            label="TrustSEAL"
            icon={ShieldCheck}
            activeClass="text-[#0f1f5c] bg-[#0f1f5c]/8"
            inactiveClass="text-slate-400 bg-slate-100 line-through"
            title={seller.trustSeal ? "TrustSEAL verified" : "Not TrustSEAL verified"}
          />
          <Tag
            active={!!seller.paymentProtected}
            label="Pay-Protected"
            icon={CheckCircle2}
            activeClass="text-[#0a6640] bg-[#0a6640]/10"
            inactiveClass="text-slate-400 bg-slate-100 line-through"
            title={seller.paymentProtected ? "Payment protected up to ₹5L" : "Payment not protected"}
          />
          <span
            title={`${matched} of your ${matchOutOf} specs matched`}
            className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#6d28d9] bg-[#6d28d9]/10 px-1.5 py-0.5 rounded"
          >
            {matched}/{matchOutOf} specs
          </span>
        </div>

        <button
          data-testid={`top-pick-enquiry-${seller.name}`}
          className="mt-auto w-full h-8 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-[11.5px] font-bold transition-colors"
        >
          Send Enquiry
        </button>
      </div>
    </div>
  );
}
