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

## Completed (2026-04-27 · v5 — multi-question assistant)
- [x] Buyer-assistant header copy: "Answer these questions to help me serve you better"
- [x] Bottom strip now shows up to 3 questions side-by-side in a 3-column grid; no Skip option per question
- [x] Single "Next →" button advances to the next batch; on last batch the label becomes "Refine →" and triggers a re-search
- [x] Free-text questions are filtered out at the assistant level so the layout stays uniform
- [x] Selecting any chip continues to sync into the top filters bar and triggers the shimmer refresh

## Completed (2026-04-27 · v4 — uniform cards + reapply filters)
- [x] Removed all rank ribbons, emerald borders, and special highlighting on top picks — all 5 cards are visually identical
- [x] Cards now show a 5-star visual rating (filled to integer rating) instead of a single star + number
- [x] Card tag row is exactly 4 tags: GST, TrustSEAL, Pay-Protected (each active=colored / inactive=struck-through grey), Spec match X/N where N = total active filters
- [x] Distance/km tag removed
- [x] Refinement answers from the buyer assistant now show as chips in the top filters bar with × to deselect
- [x] "+ Edit filters" affordance on the right of the chips bar — sends user back to the filter screen with all state preserved, lets them re-apply removed filters or add new ones
- [x] Buyer-assistant header copy updated to "Help me find you a better match by asking these questions"

## Completed (2026-04-27 · v3 — clean conversion-focused flow)
- [x] Removed every "AI" mention from UI (kept only as backend prompt context)
- [x] Removed sparkle icon from "Find Best Match" CTA — plain dark-navy pill
- [x] Loading screen now shows ONE rotating message at a time (6 messages cycling), not cumulative stages
- [x] After Find Best Match the left filter panel collapses to a top chips bar (Quantity, Phase, Fuel, Material…) — each chip removable with ×
- [x] Top picks expanded to 5 cards in a single row (compact card variant) — full modal width available
- [x] Whole modal is fixed-height (88vh) and never scrolls — chips bar + 5 cards + 1-question assistant strip all fit
- [x] Buyer assistant now shows ONE question at a time with progress bar + Skip + auto-advance on choice; "Refine" auto-fires on the last question
- [x] Persona-aware questions: Gemini prompt extended to also return Industry/Sector, Company Size, Buyer Role, Procurement Frequency, Company Name (for high quantity / B2B queries) plus product-specific extras beyond the initial filters

## Completed (2026-04-24 · v2 — AI-powered iterative search)

### Session 2 additions
- [x] Search popup replaced "Search" CTA with dark navy **"✦ Find Best Match"** button
- [x] Phase 2 — 5.5s AI loading animation (orbiting dots + 4 sequential stages + top progress bar + "Analysing filters…" footer)
- [x] Phase 3 — AI results view:
  - Top 3 picks with rank ribbons (🥇🥈🥉), emerald border, TrustSEAL / Payment Protected / X/5 specs / km badge row, rating · responsiveness% · price meta
  - Inline **Buyer Requirement Assistant** — chip-style questions generated live by Gemini `gemini-2.5-flash-lite`
  - Horizontal scroller for "Other relevant sellers" with compact cards and "View more sellers →" end card
- [x] Two-way sync — assistant answers update left-panel spec chips; spec chip changes update assistant answers
- [x] Filter changes trigger shimmer overlay on results for 900ms
- [x] `Refine My Results` runs a shorter 2.5s loading animation and re-ranks the picks
- [x] Modal is independent of the main dashboard; X closes and resets all state
- [x] Product-specific ISQ specs (dining table, generator, helmet, tiles) shown in left panel based on keyword
- [x] Backend `/api/ai/refine-questions` (FastAPI + emergentintegrations + gemini-2.5-flash-lite)
  - Graceful fallback to deterministic keyword-based questions if LLM errors
- [x] Colour tokens: navy #0f1f5c, emerald #0a6640, purple #6d28d9, amber #b45309
- [x] Inter font, 10-16px border radius, 1px #e2e8f0 borders throughout

## Completed (2026-04-24 · v1)
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
