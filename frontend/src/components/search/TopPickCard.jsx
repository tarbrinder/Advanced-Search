import React from "react";
import { Star, CheckCircle2, ShieldCheck, BadgeCheck, MapPin, Phone } from "lucide-react";

const RANK_LABELS = [
  { icon: "🥇", label: "Best Match", bg: "bg-amber-400", text: "text-slate-900" },
  { icon: "🥈", label: "2nd Pick", bg: "bg-slate-300", text: "text-slate-900" },
  { icon: "🥉", label: "3rd Pick", bg: "bg-orange-300", text: "text-slate-900" },
];

/**
 * AI-curated top pick card. Same base as regular seller card
 * but with rank ribbon, emerald border, badge row, and meta line.
 */
export default function TopPickCard({ seller, rank = 0 }) {
  const r = RANK_LABELS[rank] || RANK_LABELS[0];
  return (
    <div
      data-testid={`top-pick-${rank}`}
      className="relative rounded-[12px] bg-white border-2 border-emerald-400 shadow-[0_4px_14px_rgba(10,102,64,0.1)] hover:shadow-lg transition-shadow overflow-hidden group"
    >
      {/* Rank ribbon */}
      <div
        className={`absolute top-2 right-2 z-10 ${r.bg} ${r.text} text-[10.5px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1`}
      >
        <span>{r.icon}</span>
        {r.label}
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={seller.image}
          alt={seller.name}
          className="w-full h-36 object-cover"
          onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
        />
        <div className="absolute top-2 left-2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
          {seller.price}
        </div>
      </div>

      <div className="p-3">
        <div className="font-bold text-[13px] text-slate-900 truncate">{seller.name}</div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin size={11} className="text-slate-400" />
          {seller.location}
        </div>

        {/* Badge row */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-[#0f1f5c] bg-[#0f1f5c]/10 px-1.5 py-0.5 rounded">
            <ShieldCheck size={10} /> TrustSEAL
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-[#0a6640] bg-[#0a6640]/10 px-1.5 py-0.5 rounded">
            <CheckCircle2 size={10} /> Payment Protected
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-[#6d28d9] bg-[#6d28d9]/10 px-1.5 py-0.5 rounded">
            <BadgeCheck size={10} /> {seller.specMatch}/5 specs
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-[#b45309] bg-[#b45309]/10 px-1.5 py-0.5 rounded">
            <MapPin size={10} /> {seller.distanceKm} km
          </span>
        </div>

        {/* Meta line */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
          <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            {seller.rating}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Phone size={10} className="text-[#0a6640]" />
            <span className="text-[#0a6640] font-semibold">{seller.responsiveness}%</span> responsive
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-bold text-slate-900">{seller.price}</span>
        </div>

        <button
          data-testid={`top-pick-enquiry-${rank}`}
          className="w-full mt-3 h-9 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-xs font-semibold transition-colors"
        >
          Send Enquiry
        </button>
      </div>
    </div>
  );
}
