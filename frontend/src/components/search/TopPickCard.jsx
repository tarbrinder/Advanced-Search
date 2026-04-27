import React from "react";
import { Star, CheckCircle2, ShieldCheck, BadgeCheck, MapPin } from "lucide-react";

const RANK_LABELS = [
  { icon: "🥇", label: "Best", bg: "bg-amber-400", text: "text-slate-900" },
  { icon: "🥈", label: "2nd", bg: "bg-slate-300", text: "text-slate-900" },
  { icon: "🥉", label: "3rd", bg: "bg-orange-300", text: "text-slate-900" },
];

/**
 * Compact top pick card optimised so 5 cards fit in the row.
 * Keeps photo + price pill + name + city + key badges + Send Enquiry.
 */
export default function TopPickCard({ seller, rank = 0, showRibbon = false }) {
  const r = showRibbon ? RANK_LABELS[rank] : null;
  return (
    <div
      data-testid={`top-pick-${rank}`}
      className={`relative rounded-[10px] bg-white overflow-hidden hover:shadow-md transition-shadow ${
        showRibbon ? "border-2 border-emerald-400" : "border border-slate-200"
      }`}
    >
      {r && (
        <div
          className={`absolute top-1.5 right-1.5 z-10 ${r.bg} ${r.text} text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5`}
        >
          <span>{r.icon}</span>
          {r.label}
        </div>
      )}

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

      <div className="p-2.5">
        <div className="font-bold text-[12.5px] text-slate-900 truncate leading-tight">{seller.name}</div>
        <div className="text-[10px] text-slate-500 truncate flex items-center gap-0.5 mt-0.5">
          <MapPin size={9} className="text-slate-400" />
          {seller.location}
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="flex items-center gap-0.5 text-amber-600 font-semibold text-[10.5px]">
            <Star size={9.5} className="fill-amber-500 text-amber-500" />
            {seller.rating}
          </span>
          <span className="text-[10px] text-slate-400">({seller.reviews})</span>
          {seller.gst && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-emerald-700">
              <CheckCircle2 size={10} /> GST
            </span>
          )}
        </div>

        {/* Badge row - compact */}
        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
          <span
            title="TrustSEAL verified"
            className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#0f1f5c] bg-[#0f1f5c]/8 px-1 py-0.5 rounded"
          >
            <ShieldCheck size={8.5} /> Trust
          </span>
          <span
            title={`${seller.specMatch}/5 specs match`}
            className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#6d28d9] bg-[#6d28d9]/10 px-1 py-0.5 rounded"
          >
            <BadgeCheck size={8.5} /> {seller.specMatch}/5
          </span>
          <span
            title="Distance"
            className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#b45309] bg-[#b45309]/10 px-1 py-0.5 rounded"
          >
            <MapPin size={8.5} /> {seller.distanceKm}km
          </span>
        </div>

        <button
          data-testid={`top-pick-enquiry-${rank}`}
          className="w-full mt-2 h-8 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-[11.5px] font-bold transition-colors"
        >
          Send Enquiry
        </button>
      </div>
    </div>
  );
}
