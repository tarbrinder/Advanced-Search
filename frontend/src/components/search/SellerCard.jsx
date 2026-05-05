import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Heart,
  Phone,
  Briefcase,
  Zap,
  Send,
  Check,
} from "lucide-react";

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

function Tag({ active, label, icon: Icon, activeClass, inactiveClass, extra }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[9.5px] font-semibold px-1.5 py-0.5 rounded ${
        active ? activeClass : inactiveClass
      }`}
      title={extra ? `${label} · ${extra}` : label}
    >
      {Icon && <Icon size={9} />}
      {label}
      {extra && <span className="ml-0.5 text-[8px] font-bold opacity-80">· {extra}</span>}
    </span>
  );
}

/**
 * Uniform compact seller card for the SearchPage grid.
 *
 * CTA row (inside card, no floating popovers — never clipped):
 *   [ Send (icon-only, ~36px) ]  [ Call  (flex-1, flips in-place to phone number) ]
 *   - Send icon-flips to green tick + tooltip "Enquiry sent" after click.
 *   - Call button text swaps between "Call" and the phone number IN PLACE
 *     (button width is constant flex-1 → no layout shift).
 */
export default function SellerCard({ seller, totalFilters = 0, onFavToggle, isFav, onEnquiry }) {
  const matchOutOf = totalFilters > 0 ? totalFilters : 3;
  const matched = Math.min(matchOutOf, Math.max(1, Math.round(((seller.specMatch || 4) / 5) * matchOutOf)));
  const [showPhone, setShowPhone] = useState(false);
  const [sent, setSent] = useState(false);

  const phoneNumber = seller.phone || "+91 98765 43210";
  const yearsExp = seller.yearsExp ?? 5;
  const responseRate = seller.responsiveness ?? 85;

  const handleEnquiry = (e) => {
    e.stopPropagation();
    if (sent) return;
    setSent(true);
    if (typeof onEnquiry === "function") onEnquiry(seller);
  };

  return (
    <div
      data-testid={`seller-card-${seller.name}`}
      className="rounded-[10px] bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col min-h-0 h-full"
    >
      <div className="relative shrink-0 basis-[22%] min-h-[48px] max-h-[88px]">
        <img
          src={seller.image}
          alt={seller.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400"; }}
        />
        <div className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
          {seller.price}
        </div>
        {onFavToggle && (
          <button
            onClick={() => onFavToggle(seller.name)}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white"
          >
            <Heart size={10} className={isFav ? "fill-red-500 text-red-500" : "text-slate-500"} />
          </button>
        )}
      </div>

      <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1 flex-1 min-h-0 overflow-hidden">
        <div>
          <div className="font-bold text-[11.5px] text-slate-900 truncate leading-tight">{seller.name}</div>
          <div className="text-[10px] text-slate-500 truncate flex items-center gap-0.5 leading-tight">
            <MapPin size={9} className="text-slate-400" />
            {seller.location}
          </div>
        </div>

        <StarRow rating={seller.rating} />

        {/* Years experience · Response rate */}
        <div className="flex items-center gap-1.5 text-[9.5px] font-semibold text-slate-600 leading-none">
          <span
            className="inline-flex items-center gap-0.5"
            title={`${yearsExp} years of business experience`}
          >
            <Briefcase size={9} className="text-slate-500" />
            {yearsExp} yrs
          </span>
          <span className="w-px h-2.5 bg-slate-300" aria-hidden="true" />
          <span
            className="inline-flex items-center gap-0.5"
            title={`Average seller response rate: ${responseRate}%`}
          >
            <Zap size={9} className="text-amber-500" />
            {responseRate}% reply
          </span>
        </div>

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

        {/* CTA row — proportions SWAP when phone is revealed
            Default   :  [ Send Enquiry (flex-1) ]  [ 📞 (icon) ]
            Revealed  :  [ 📤 (icon) ]              [ 📞 +91 XX XXX XXXXX (flex-1) ]
            Sent      :  Send Enquiry icon → green ✓  */}
        <div className="flex gap-1 mt-auto pt-1">
          {/* Send Enquiry — width animates between flex-1 and w-9 */}
          <button
            data-testid={`seller-enquiry-${seller.name}`}
            onClick={handleEnquiry}
            aria-label={sent ? "Enquiry sent" : "Send enquiry"}
            title={sent ? "Enquiry sent" : "Send enquiry"}
            disabled={sent}
            className={`relative h-7 shrink-0 rounded-md flex items-center justify-center gap-1 overflow-hidden transition-all duration-300 ease-out ${
              showPhone ? "w-9" : "flex-1 px-2"
            } ${
              sent
                ? "bg-emerald-500 text-white cursor-default"
                : "bg-teal-500 hover:bg-teal-600 text-white"
            }`}
          >
            <span className="inline-flex items-center justify-center shrink-0">
              {sent ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <Send size={showPhone ? 12 : 11} strokeWidth={2.5} />
              )}
            </span>
            {/* Label only shows when not in minimized (phone-revealed) mode */}
            {!showPhone && (
              <span
                key={sent ? "sent-label" : "enquiry-label"}
                className="text-[11px] font-bold whitespace-nowrap animate-call-flip"
              >
                {sent ? "Sent" : "Send Enquiry"}
              </span>
            )}
          </button>

          {/* Call — width animates between w-9 (icon only) and flex-1 (full number) */}
          <button
            data-testid={`seller-call-${seller.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowPhone((s) => !s);
            }}
            aria-expanded={showPhone}
            aria-label={showPhone ? `Hide number ${phoneNumber}` : "Reveal phone number"}
            title={showPhone ? "Click to hide" : "Click to reveal number"}
            className={`h-7 shrink-0 rounded-md border font-bold transition-all duration-300 ease-out flex items-center justify-center gap-1 overflow-hidden ${
              showPhone ? "flex-1 px-2 min-w-0" : "w-9"
            } ${
              showPhone
                ? "bg-[#0f1f5c] border-[#0f1f5c] text-white"
                : "bg-white border-[#0f1f5c] text-[#0f1f5c] hover:bg-[#0f1f5c] hover:text-white"
            }`}
          >
            <Phone size={showPhone ? 11 : 12} className="shrink-0" />
            {showPhone && (
              <span
                key="phone-number"
                className="tabular-nums tracking-tight text-[10.5px] truncate animate-call-flip"
              >
                {phoneNumber}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
