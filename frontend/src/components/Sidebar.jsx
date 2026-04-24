import React from "react";
import {
  LayoutGrid, User, MessageSquare, ShieldCheck, CreditCard,
  BadgeCheck, IndianRupee, Truck, TrendingUp, HelpCircle, ShoppingCart, Pencil,
} from "lucide-react";

const ICONS = {
  grid: LayoutGrid,
  user: User,
  chat: MessageSquare,
  shield: ShieldCheck,
  credit: CreditCard,
  seal: BadgeCheck,
  rupee: IndianRupee,
  truck: Truck,
  trend: TrendingUp,
};

export default function Sidebar({ items, active, onSelect, user }) {
  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-[calc(100vh-64px)]">
      {/* User Profile */}
      <div className="px-4 py-5 border-b border-slate-200" data-testid="sidebar-user-card">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wide shrink-0">
            QS
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="font-semibold text-slate-900 text-sm truncate">{user.name}</div>
              <button
                data-testid="edit-profile-btn"
                className="p-1 rounded hover:bg-slate-100 text-teal-600"
                aria-label="Edit profile"
              >
                <Pencil size={13} />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {user.location}
            </div>
          </div>
        </div>
        <button
          data-testid="become-trustseal-btn"
          className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold py-2 hover:bg-orange-100 transition-colors"
        >
          <ShoppingCart size={14} />
          Become TrustSEAL Buyer
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-2">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              data-testid={`sidebar-${item.id}`}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative ${
                isActive
                  ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {Icon && <Icon size={17} strokeWidth={isActive ? 2.25 : 1.75} />}
              <span className="flex-1 text-left">{item.label}</span>
              {item.progress && (
                <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 rounded-full px-1.5 py-0.5">
                  {item.progress}%
                </span>
              )}
              {item.badge && (
                <span className="text-[9px] font-bold text-orange-600 bg-orange-50 rounded px-1.5 py-0.5">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 p-4">
        <button
          data-testid="help-support-btn"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700"
        >
          <HelpCircle size={16} />
          Help and support
        </button>
      </div>
    </aside>
  );
}
