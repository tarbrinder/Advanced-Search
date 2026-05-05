import React from "react";
import { Star, ShieldCheck, CheckCircle2, MapPin, Heart } from "lucide-react";

function StarRow({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={11}
          className={i < Math.round(rating) ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200"}
        />
      ))}
      <span className="ml-1 text-[10.5px] font-semibold text-slate-700">{rating}</span>
    </div>
  );
}

function Tag({ active, label, icon: Icon, activeClass, inactiveClass }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[9.5px] font-semibold px-1.5 py-0.5 rounded ${
        active ? activeClass : inactiveClass
      }`}
      title={label}
    >
      {Icon && <Icon size={9} />}
      {label}
    </span>
  );
}

/**
 * Uniform compact seller card for the SearchPage grid.
 * Shows photo + price pill + name + city + 5-star rating + tag row + Send Enquiry.
 */
export default function SellerCard({ seller, totalFilters = 0, onFavToggle, isFav }) {
  const matchOutOf = totalFilters > 0 ? totalFilters : 3;
  const matched = Math.min(matchOutOf, Math.max(1, Math.round(((seller.specMatch || 4) / 5) * matchOutOf)));

  return (
    <div
      data-testid={`seller-card-${seller.name}`}
      className="rounded-[10px] bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="relative">
        <img
          src={seller.image}
          alt={seller.name}
          className="w-full h-28 object-cover"
          onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
        />
        <div className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
          {seller.price}
        </div>
        {onFavToggle && (
          <button
            onClick={() => onFavToggle(seller.name)}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white"
          >
            <Heart size={12} className={isFav ? "fill-red-500 text-red-500" : "text-slate-500"} />
          </button>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <div>
          <div className="font-bold text-[12px] text-slate-900 truncate leading-tight">{seller.name}</div>
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
          />
          <Tag
            active={!!seller.trustSeal}
            label="TrustSEAL"
            icon={ShieldCheck}
            activeClass="text-[#0f1f5c] bg-[#0f1f5c]/8"
            inactiveClass="text-slate-400 bg-slate-100 line-through"
          />
          <Tag
            active={!!seller.paymentProtected}
            label="Pay-Protected"
            icon={CheckCircle2}
            activeClass="text-[#0a6640] bg-[#0a6640]/10"
            inactiveClass="text-slate-400 bg-slate-100 line-through"
          />
          <span
            title={`${matched} of your ${matchOutOf} specs matched`}
            className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-[#6d28d9] bg-[#6d28d9]/10 px-1.5 py-0.5 rounded"
          >
            {matched}/{matchOutOf} specs
          </span>
        </div>

        <button
          data-testid={`seller-enquiry-${seller.name}`}
          className="mt-auto w-full h-8 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-[11.5px] font-bold transition-colors"
        >
          Send Enquiry
        </button>
      </div>
    </div>
  );
}
