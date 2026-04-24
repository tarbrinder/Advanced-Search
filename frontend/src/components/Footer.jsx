import React from "react";

const COLUMNS = [
  {
    title: "Customer Care",
    links: ["Contact Us", "Success Stories", "Press Section", "Jobs & Careers", "Desktop Site"],
  },
  {
    title: "Suppliers Tool Kit",
    links: ["Sell on IndiaMART", "Latest BuyLead", "Learning Centre", "Ship With IndiaMART"],
    extra: { title: "Buyers Tool Kit", links: ["Post RFQ", "Search Product or Service"] },
  },
  {
    title: "Accounting Solutions",
    links: ["Accounting Software", "Tally on Mobile", "GST e-Invoice"],
  },
  {
    title: "Home",
    links: ["About Us", "IndiaMART Export", "Terms Of Use", "Privacy Policy", "Shipping & Delivery Policy", "Returns & Cancellation Policy", "Help"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-6 px-6 py-8" data-testid="footer">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-slate-900 text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <button className="text-xs text-slate-600 hover:text-teal-600 text-left">{link}</button>
                </li>
              ))}
            </ul>
            {col.extra && (
              <>
                <h4 className="font-bold text-slate-900 text-sm mt-5 mb-3">{col.extra.title}</h4>
                <ul className="space-y-2">
                  {col.extra.links.map((link) => (
                    <li key={link}>
                      <button className="text-xs text-slate-600 hover:text-teal-600 text-left">{link}</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        © 2026 IndiaMART Clone — UI Demo. For design reference only.
      </div>
    </footer>
  );
}
