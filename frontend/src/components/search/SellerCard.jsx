import React, { useEffect, useRef, useState } from "react";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Heart,
  Phone,
  Briefcase,
  Zap,
  X,
  Copy,
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
 * Sized to fit a 5×2 grid in a 720px viewport without clipping.
 * The revealed phone number renders as a floating chip (absolute positioned
 * with high z-index) so the card layout stays stable on click.
 */
export default function SellerCard({ seller, totalFilters = 0, onFavToggle, isFav }) {
  const matchOutOf = totalFilters > 0 ? totalFilters : 3;
  const matched = Math.min(matchOutOf, Math.max(1, Math.round(((seller.specMatch || 4) / 5) * matchOutOf)));
  const [showPhone, setShowPhone] = useState(false);
  const [copied, setCopied] = useState(false);
  const chipRef = useRef(null);
  const btnRef = useRef(null);

  const phoneNumber = seller.phone || "+91 98765 43210";
  const yearsExp = seller.yearsExp ?? 5;
  const responseRate = seller.responsiveness ?? 85;

  // Close floating chip on outside click / Escape
  useEffect(() => {
    if (!showPhone) return;
    const handleClick = (e) => {
      if (
        chipRef.current &&
        !chipRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setShowPhone(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setShowPhone(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showPhone]);

  const copyNumber = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(phoneNumber.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div
      data-testid={`seller-card-${seller.name}`}
      className="relative rounded-[10px] bg-white border border-slate-200 hover:shadow-md transition-shadow flex flex-col self-start"
    >
      <div className="relative shrink-0">
        <img
          src={seller.image}
          alt={seller.name}
          className="w-full h-20 object-cover rounded-t-[10px]"
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

      <div className="px-2 pt-1.5 pb-2 flex flex-col gap-1">
        <div>
          <div className="font-bold text-[11.5px] text-slate-900 truncate leading-tight">{seller.name}</div>
          <div className="text-[10px] text-slate-500 truncate flex items-center gap-0.5 leading-tight">
            <MapPin size={9} className="text-slate-400" />
            {seller.location}
          </div>
        </div>

        <StarRow rating={seller.rating} />

        {/* NEW: Years experience · Response rate */}
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

        <div className="relative flex gap-1.5 mt-1">
          <button
            data-testid={`seller-enquiry-${seller.name}`}
            className="flex-1 h-7 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-[11px] font-bold transition-colors"
          >
            Send Enquiry
          </button>
          <button
            ref={btnRef}
            data-testid={`seller-call-${seller.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowPhone((s) => !s);
            }}
            aria-expanded={showPhone}
            aria-label={showPhone ? "Hide phone number" : "Reveal phone number"}
            title={showPhone ? "Hide number" : "Reveal number"}
            className={`h-7 px-2.5 rounded-md text-[11px] font-bold border transition-colors flex items-center gap-1 shrink-0 ${
              showPhone
                ? "bg-[#0f1f5c] border-[#0f1f5c] text-white"
                : "bg-white border-[#0f1f5c] text-[#0f1f5c] hover:bg-[#0f1f5c] hover:text-white"
            }`}
          >
            <Phone size={11} />
            Call
          </button>

          {/* Floating phone chip — absolute so card layout never shifts */}
          {showPhone && (
            <div
              ref={chipRef}
              data-testid={`seller-phone-chip-${seller.name}`}
              role="dialog"
              className="absolute bottom-full right-0 mb-2 z-40 bg-white border border-[#0f1f5c] rounded-lg shadow-xl px-2.5 py-1.5 flex items-center gap-1.5 whitespace-nowrap animate-phone-chip"
              style={{ minWidth: "max-content" }}
            >
              <Phone size={11} className="text-[#0f1f5c] shrink-0" />
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="text-[11.5px] font-bold text-[#0f1f5c] tracking-tight tabular-nums hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {phoneNumber}
              </a>
              <button
                onClick={copyNumber}
                title={copied ? "Copied" : "Copy number"}
                className="ml-0.5 w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-[#0f1f5c] hover:bg-slate-100 transition-colors"
              >
                {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPhone(false);
                }}
                title="Hide"
                className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={11} />
              </button>
              {/* Arrow pointing down to the Call button */}
              <span
                aria-hidden="true"
                className="absolute -bottom-[5px] right-4 w-2 h-2 bg-white border-r border-b border-[#0f1f5c] rotate-45"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
