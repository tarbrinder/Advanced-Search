import React from "react";
import { Tag, UserCheck, ShieldCheck, Store, Download, Calculator } from "lucide-react";
import { MORE_FOR_YOU } from "../data/mockData";

const ICONS = {
  tag: Tag,
  "user-check": UserCheck,
  "shield-check": ShieldCheck,
  store: Store,
  download: Download,
  calculator: Calculator,
};

export default function MoreForYou() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5" data-testid="more-for-you-section">
      <h2 className="text-base font-bold text-slate-900 mb-4">More for you</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {MORE_FOR_YOU.map((m) => {
          const Icon = ICONS[m.icon];
          return (
            <div
              key={m.title}
              data-testid={`more-${m.title}`}
              className="rounded-lg border border-slate-200 p-4 hover:border-teal-400 hover:shadow-sm transition-all group cursor-pointer"
            >
              {Icon && (
                <div className="w-9 h-9 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:bg-teal-100 transition-colors">
                  <Icon size={17} />
                </div>
              )}
              <div className="font-semibold text-sm text-slate-900">{m.title}</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-snug">{m.desc}</div>
              <div className="mt-3 text-xs font-semibold text-teal-600">{m.cta}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
