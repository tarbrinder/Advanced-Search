import React from "react";
import { MESSAGES, PRICE_TRENDS } from "../data/mockData";
import { ShieldCheck, TrendingUp, X } from "lucide-react";

export function MessagesCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4" data-testid="messages-card">
      <h3 className="font-bold text-slate-900 text-sm mb-3">Messages</h3>
      <div className="divide-y divide-slate-100">
        {MESSAGES.map((m) => (
          <div key={m.company} className="py-3 first:pt-0" data-testid={`msg-${m.company}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="font-semibold text-slate-900 text-xs truncate">{m.company}</div>
                {m.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />}
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{m.time}</span>
            </div>
            <div className="text-[11px] text-slate-700 mt-0.5 font-medium">{m.product}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{m.message}</div>
          </div>
        ))}
      </div>
      <button
        data-testid="view-more-msg"
        className="w-full mt-2 h-8 text-xs font-semibold text-teal-600 hover:underline"
      >
        View More
      </button>
    </div>
  );
}

export function VerifyCard() {
  const items = [
    { title: "Your Connection to This Seller", desc: "Verified buyer-seller relationship" },
    { title: "TrustSEAL Verification", desc: "Authenticated business credentials" },
    { title: "Complete Seller Background", desc: "Full business history & compliance" },
  ];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4" data-testid="verify-card">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={16} className="text-teal-600" />
        <h3 className="font-bold text-slate-900 text-sm">Verify Before You Pay</h3>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">Here is what we verify for you</p>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.title}>
            <div className="text-xs font-semibold text-slate-800">{it.title}</div>
            <div className="text-[11px] text-slate-500">{it.desc}</div>
          </div>
        ))}
      </div>
      <button
        data-testid="know-your-seller-btn"
        className="mt-4 w-full h-10 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-sm font-semibold transition-colors"
      >
        Know Your Seller
      </button>
      <div className="mt-3 flex items-start gap-1.5 p-2 rounded-md bg-teal-50 border border-teal-100">
        <ShieldCheck size={13} className="text-teal-600 shrink-0 mt-0.5" />
        <div className="text-[10.5px] text-slate-700 leading-tight">
          Payment protection up to <b>₹5 Lakh</b> on verified bank account.{" "}
          <button className="text-teal-600 font-semibold hover:underline">Learn more</button>
        </div>
      </div>
    </div>
  );
}

export function PriceTrendsCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4" data-testid="price-trends-card">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-teal-600" />
        <h3 className="font-bold text-slate-900 text-sm">Price Trends</h3>
      </div>
      <div className="space-y-3">
        {PRICE_TRENDS.map((p) => (
          <div key={p.title} className="pb-3 border-b border-slate-100 last:border-0" data-testid={`trend-${p.title}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs font-semibold text-slate-800 flex-1">{p.title}</div>
              <span className="text-[10px] text-slate-400 shrink-0">as on {p.date}</span>
            </div>
            <div className="text-sm font-bold text-teal-700 mt-1">{p.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StrengthenProfile({ onDismiss }) {
  const steps = [1, 2, 3, 4];
  return (
    <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-200 p-4 relative" data-testid="strengthen-profile-card">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
        aria-label="Close"
      >
        <X size={14} />
      </button>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-teal-600 font-bold text-sm">63%</span>
        <h3 className="font-bold text-slate-900 text-sm">Strengthen your profile</h3>
      </div>
      <div className="flex items-center gap-1 mb-3 mt-2">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full ${i < 2 ? "bg-teal-500" : "bg-slate-200"}`}
          />
        ))}
      </div>
      <div className="text-xs font-semibold text-slate-800">Add your name</div>
      <div className="text-[11px] text-slate-500 mt-0.5">Sellers will address you using this name.</div>
      <div className="flex items-center gap-2 mt-3">
        <button
          data-testid="save-profile-detail"
          className="flex-1 h-9 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-xs font-semibold transition-colors"
        >
          Save detail
        </button>
        <button
          onClick={onDismiss}
          data-testid="skip-profile-detail"
          className="px-3 h-9 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
