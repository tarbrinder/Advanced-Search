import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "../data/mockData";

export default function ExploreCategories({ onCategoryClick }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 260, behavior: "smooth" });

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5" data-testid="categories-section">
      <h2 className="text-base font-bold text-slate-900 mb-4">Explore More Categories</h2>
      <div className="relative">
        <div ref={ref} className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((c) => (
            <div
              key={c.name}
              data-testid={`category-${c.name}`}
              className="min-w-[220px] w-[220px] shrink-0 rounded-lg border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                <button
                  onClick={() => onCategoryClick(c.name)}
                  data-testid={`cat-quote-${c.name}`}
                  className="mt-3 w-full h-8 bg-teal-500 hover:bg-teal-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  Get Quotes
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
