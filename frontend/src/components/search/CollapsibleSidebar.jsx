import React, { useState } from "react";
import {
  LayoutGrid, User, MessageSquare, ShieldCheck, CreditCard,
  BadgeCheck, IndianRupee, Truck, TrendingUp, HelpCircle,
} from "lucide-react";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/" },
  { id: "profile", label: "My Profile", icon: User },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "knowseller", label: "Know Your Seller", icon: ShieldCheck, badge: "NEW" },
  { id: "payment", label: "Payment Protection", icon: CreditCard },
  { id: "trustseal", label: "TrustSEAL Buyer", icon: BadgeCheck },
  { id: "loans", label: "Loans", icon: IndianRupee },
  { id: "ship", label: "Ship with IM", icon: Truck },
  { id: "credit", label: "Credit Score", icon: TrendingUp },
];

/**
 * Slim icon-only left nav for the SearchPage.
 * Hover any icon → label slides out (peek) without expanding the nav width.
 */
export default function CollapsibleSidebar({ active = "dashboard", onSelect, onNavigate }) {
  const [hover, setHover] = useState(null);
  return (
    <aside
      data-testid="search-sidebar"
      className="hidden md:flex w-[56px] shrink-0 border-r border-slate-200 bg-white flex-col items-center py-3 gap-1 sticky top-[64px] h-[calc(100vh-64px)]"
    >
      {/* User avatar */}
      <div
        className="w-9 h-9 rounded-full bg-[#0f1f5c] text-white flex items-center justify-center font-bold text-[13px] mb-1.5 shrink-0"
        title="GLK Abir"
      >
        A
      </div>

      <div className="flex flex-col gap-0.5 flex-1 w-full">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div key={item.id} className="relative w-full" onMouseEnter={() => setHover(item.id)} onMouseLeave={() => setHover(null)}>
              <button
                data-testid={`nav-${item.id}`}
                onClick={() => {
                  if (item.href && onNavigate) onNavigate(item.href);
                  onSelect?.(item.id);
                }}
                className={`w-full h-10 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? "bg-teal-50 text-teal-700" : "text-slate-500 hover:bg-slate-50 hover:text-[#0f1f5c]"
                }`}
              >
                <div className="relative">
                  <Icon size={17} strokeWidth={isActive ? 2.25 : 1.75} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 bg-orange-500 text-white text-[7.5px] font-bold rounded px-1 leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
              {hover === item.id && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-1 z-50 whitespace-nowrap bg-slate-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg pointer-events-none">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        data-testid="nav-help"
        onClick={() => onSelect?.("help")}
        title="Help and support"
        className="w-full h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-[#0f1f5c] mt-auto"
      >
        <HelpCircle size={17} />
      </button>
    </aside>
  );
}
