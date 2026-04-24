# IndiaMART B2B Buyer Dashboard — UI Clone

## Original Problem Statement
User shared the reference URL `https://new-buyer-my-duplica-vzmj.bolt.host` and asked to create the **exact same UI** and **search functionality** as on the shared link.

## Scope (frozen)
- Pixel-close React clone of the IndiaMART buyer dashboard
- Fully-working client-side search (header search bar + inline search bar + category "Get Quotes")
- Search opens a modal showing filtered seller results with left filter panel
- No backend / auth / third-party integrations required

## Tech Stack
- React 19 + React Router
- Tailwind CSS for styling
- lucide-react icons

## Architecture
- `src/App.js` — routing
- `src/pages/Dashboard.jsx` — page assembly
- `src/components/Header.jsx` — top navy bar with logo, location picker, search + suggestions, Post RFQ, right icons
- `src/components/Sidebar.jsx` — user card + nav + Become TrustSEAL + Help
- `src/components/InlineSearch.jsx` — big in-page search row
- `src/components/ActiveOrder.jsx` — active RFQ with diesel generator + horizontally-scrolling seller cards
- `src/components/ProductsYouMayLike.jsx` — horizontal product row
- `src/components/ExploreCategories.jsx` — categories row (click → search)
- `src/components/PastOrders.jsx` — past order + 5 sellers grid
- `src/components/SidePanels.jsx` — Messages, VerifyCard, PriceTrends, StrengthenProfile
- `src/components/MoreForYou.jsx` — 6-item promotional grid
- `src/components/Footer.jsx` — 4-column footer
- `src/components/SearchModal.jsx` — full-screen-ish modal with filters + sellers grid + "Find Best Match"
- `src/data/mockData.js` — static dataset + client-side `searchSellers()`

## Completed (2026-04-24)
- [x] Full dashboard layout matching reference design
- [x] Header with indiamart logo, 23-city location picker, search + typeahead suggestions
- [x] Search modal with Quantity / Material / Brand / Certification filters and Show More toggle
- [x] Keyword-based seller search across 12+ categories (diesel, helmet, tiles, conveyor, steel, compressor, pump, fruits, medical, kids, gloves, safety)
- [x] Horizontal scrollers with left/right chevrons for sellers, products, categories
- [x] Profile progress bar, RFQ banner, dismissible cards
- [x] Floating help button, hover states, focus rings, shadows

## Backlog / P1
- [ ] Post RFQ flow (modal with form)
- [ ] "Continue with Seller" / "Send Enquiry" chat UI
- [ ] Compare Quotes side-by-side view
- [ ] Real backend (FastAPI + MongoDB) for RFQs, messages, orders
- [ ] Mobile responsive polish (<768px)
- [ ] Keyboard navigation for search suggestions

## Business Enhancement Idea
Auto-surface the user's *most-searched* category on the home dashboard (or persist recent searches in localStorage with a "Recently searched" strip under the search bar) — that raises repeat-RFQ conversion significantly on B2B marketplaces.
