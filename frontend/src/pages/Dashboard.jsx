import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import InlineSearch from "../components/InlineSearch";
import ActiveOrder from "../components/ActiveOrder";
import ProductsYouMayLike from "../components/ProductsYouMayLike";
import ExploreCategories from "../components/ExploreCategories";
import PastOrders from "../components/PastOrders";
import MoreForYou from "../components/MoreForYou";
import Footer from "../components/Footer";
import { MessagesCard, VerifyCard, PriceTrendsCard, StrengthenProfile } from "../components/SidePanels";
import { SIDEBAR_ITEMS } from "../data/mockData";
import { Radio, Trash2 } from "lucide-react";

export default function Dashboard() {
  const nav = useNavigate();
  const [location, setLocation] = useState("Dharamsala");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [headerQuery, setHeaderQuery] = useState("");
  const [showProfileBar, setShowProfileBar] = useState(true);
  const [showRFQBanner, setShowRFQBanner] = useState(true);

  const triggerSearch = (q) => {
    if (!q || !q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q.trim())}&loc=${encodeURIComponent(location)}`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        location={location}
        setLocation={setLocation}
        onSearch={triggerSearch}
        query={headerQuery}
        setQuery={setHeaderQuery}
      />

      <div className="flex">
        <Sidebar
          items={SIDEBAR_ITEMS}
          active={activeNav}
          onSelect={setActiveNav}
          user={{ name: "GLK Abir", location: "Greater Noida" }}
        />

        <main className="flex-1 min-w-0">
          {/* Inline search bar + content */}
          <div className="px-6 py-5 space-y-4">
            <InlineSearch location={location} setLocation={setLocation} onSearch={triggerSearch} />

            {/* RFQ notification */}
            {showRFQBanner && (
              <div
                data-testid="rfq-banner"
                className="flex items-center gap-3 bg-gradient-to-r from-teal-50 via-white to-white border border-teal-100 rounded-lg px-4 py-2.5"
              >
                <Radio size={16} className="text-teal-600" />
                <div className="text-xs text-slate-700 flex-1">
                  Requirement for <b>Wall Tiles</b> received. You'll be notified once sellers are connected
                </div>
                <button
                  onClick={() => setShowRFQBanner(false)}
                  className="text-slate-400 hover:text-rose-500"
                  data-testid="dismiss-rfq-banner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {/* Main content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
              <div className="space-y-4 min-w-0">
                <ActiveOrder />
                <ProductsYouMayLike />
                <ExploreCategories onCategoryClick={triggerSearch} />
                <PastOrders />
              </div>

              <aside className="space-y-4">
                <MessagesCard />
                <VerifyCard />
                <PriceTrendsCard />
                {showProfileBar && <StrengthenProfile onDismiss={() => setShowProfileBar(false)} />}
              </aside>
            </div>

            <MoreForYou />
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating help button */}
      <button
        data-testid="floating-help"
        className="fixed bottom-5 right-5 w-11 h-11 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg flex items-center justify-center z-30 transition-transform hover:scale-110"
        aria-label="Help"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>
    </div>
  );
}
