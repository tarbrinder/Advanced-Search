import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, Store, MessageCircle, HelpCircle, Globe, User } from "lucide-react";
import { CITIES } from "../data/mockData";

export default function Header({ location, setLocation, onSearch, query, setQuery, unreadMessages = 3 }) {
  const [locOpen, setLocOpen] = useState(false);
  const [locSearch, setLocSearch] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const locRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (locRef.current && !locRef.current.contains(e.target)) setLocOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(locSearch.toLowerCase())
  );

  const suggestions = query
    ? [
        "Diesel Generator", "Industrial Safety Helmet", "Heavy Duty Work Gloves",
        "Conveyor Belt", "Air Compressor", "Hydraulic Pump", "Wall Tiles",
        "Floor Tiles", "Medical Supplies", "Fresh Fruits", "Kids Wear", "Safety Goggles",
      ].filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const submit = (q) => {
    if (!q || !q.trim()) return;
    onSearch(q.trim());
    setSuggestOpen(false);
  };

  return (
    <header className="bg-[#1e2746] text-white sticky top-0 z-40 shadow-sm" data-testid="top-header">
      <div className="flex items-center justify-between gap-3 md:gap-6 px-4 md:px-6 h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0" data-testid="logo">
          <div className="w-9 h-9 rounded-lg bg-white text-[#1e2746] flex items-center justify-center font-black text-xl shadow-sm">
            m
          </div>
          <span className="font-semibold text-[17px] tracking-tight">indiamart</span>
        </div>

        {/* Location + Search + Actions */}
        <div className="flex-1 flex items-center gap-2 max-w-[900px]">
          {/* Location Dropdown */}
          <div className="relative" ref={locRef}>
            <button
              data-testid="location-trigger"
              onClick={() => setLocOpen((o) => !o)}
              className="h-9 min-w-[160px] bg-white text-slate-800 rounded-md px-3 flex items-center gap-2 text-sm font-medium hover:bg-slate-50"
            >
              <MapPin size={15} className="text-teal-600" />
              <span className="flex-1 text-left truncate">{location}</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${locOpen ? "rotate-180" : ""}`} />
            </button>
            {locOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-slate-200 z-50" data-testid="location-dropdown">
                <div className="p-2 border-b border-slate-100">
                  <input
                    data-testid="location-search-input"
                    autoFocus
                    value={locSearch}
                    onChange={(e) => setLocSearch(e.target.value)}
                    placeholder="Type to search..."
                    className="w-full px-3 py-1.5 text-sm rounded border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      data-testid={`loc-option-${c}`}
                      onClick={() => { setLocation(c); setLocOpen(false); setLocSearch(""); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-50 ${
                        c === location ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="px-4 py-3 text-xs text-slate-500">No city found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search input */}
          <div className="relative flex-1" ref={searchRef}>
            <input
              data-testid="header-search-input"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSuggestOpen(true); }}
              onFocus={() => setSuggestOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && submit(query)}
              type="text"
              placeholder="Enter product / service to search"
              className="w-full h-9 pl-3 pr-10 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            {suggestOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 z-50 overflow-hidden" data-testid="search-suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    data-testid={`suggest-${s}`}
                    onMouseDown={(e) => { e.preventDefault(); submit(s); setQuery(s); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 flex items-center gap-2"
                  >
                    <Search size={13} className="text-slate-400" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            data-testid="header-search-btn"
            onClick={() => submit(query)}
            className="h-9 px-5 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Search size={15} />
            Search
          </button>

          <button
            data-testid="header-post-rfq"
            className="h-9 px-4 bg-transparent border border-white/30 hover:bg-white/10 text-white rounded-md font-medium text-sm transition-colors"
          >
            Post RFQ
          </button>
        </div>

        {/* Right icons */}
        <div className="hidden lg:flex items-center gap-5 text-[11px]" data-testid="header-right-icons">
          <button className="flex flex-col items-center gap-0.5 hover:text-teal-300">
            <Store size={18} />
            <span>Seller Tools</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-teal-300 relative">
            <div className="relative">
              <MessageCircle size={18} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </div>
            <span>Messages</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-teal-300">
            <HelpCircle size={18} />
            <span>Help</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-teal-300">
            <Globe size={18} />
            <span>Exporters</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 hover:text-teal-300">
            <User size={18} />
            <span>Hi GLK</span>
          </button>
        </div>
      </div>
    </header>
  );
}
