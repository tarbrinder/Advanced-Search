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
## Completed (2026-05-06 · v12 — bigger product image, adaptive row heights)
- [x] **Image height +27%**: 88 px → **112 px** by reclaiming space from CTAs, padding, gaps and a merged metadata row.
- [x] **Adaptive row heights** via `gridTemplateRows: min-content`: a row of all single-line names (e.g. row 2 of search) is **195 px**, while a row containing a 2-line wrap (e.g. "Bharat Heavy Electricals & Industrial Diesel Solutions Ltd") is **208 px**. CSS Grid still equalizes cards within a row — no card-height drift.
- [x] **Merged metadata row** (`📍 location · 💼 14y · ⚡ 92%`): saves ~12 px vs. previous 2-row Location + Yrs/Reply layout.
- [x] **Smaller CTAs**: `h-7 → h-6` (`28 → 24 px`), with proportional icon/text resizing. Send Enquiry / Call swap behavior unchanged.
- [x] Removed `min-h: 26px` reservation on title — single-line names naturally take just 13 px; 2-line names still wrap cleanly via `line-clamp-2`.
- [x] Verified at 1366×768: page no scroll, grid no scroll, image 112 px on every card, row 1 = 208 px (with wrap), row 2 = 195 px (no wrap).

## Completed (2026-05-05 · v11 — card-sync edge cases + spec-match phase gating)
- [x] **Name 2-line wrap supported**: `line-clamp-2` + `min-h: 26px` reservation — short and long names produce identical card height. Verified with seed "Bharat Heavy Electricals & Industrial Diesel Solutions Ltd" → 2 lines, same 210 px.
- [x] **Reserved row heights** for Location (`min-h: 13px`) and Yrs/Reply (`min-h: 12px`) — cards remain perfectly synced even if a seller record is missing those fields.
- [x] **Trust chip row reserved height** (`min-h: 16px`) so missing `gst` / `trustSeal` / `paymentProtected` flags render as muted line-through chips without changing total card height. Verified with seed "PowerLine Generators" (`gst: false`) and "Escorts Power Ltd" with synthetic missing flags.
- [x] **Spec-match chip is now phase-gated**: hidden on the default Search page, visible only on the Find-Best-Match "Top picks for you" view. Implemented via `showSpecMatch={phase === "results"}` prop on `<SellerCard>`.
- [x] **Resolution sweep verified by testing agent**: All checked viewports — 1920×1080, 1440×900, 1366×768, 1280×720, **1366×625 (laptop with bookmark bar)** — produce uniform 210 px cards, 88 px images, NO page scroll, NO grid scroll.
- [x] Test-data seeds added: long-name & no-GST entries in `mockData.js` (diesel-generator inventory) for visual regression.

## Completed (2026-05-05 · v10 — card content compression, image untouched)
- [x] **Image is now FIXED at 88 px** (`shrink-0 h-[88px]`) — never shrinks or crops further regardless of viewport zoom.
- [x] Stars: `size 11 → 9`, rating text `10.5 → 9.5 px`.
- [x] Trust chips (`Tag` component): text `9.5 → 8.5 px`, padding `px-1.5 py-0.5 → px-1 py-px`, icon `9 → 8 px`. `whitespace-nowrap` already in place.
- [x] Card title: `11.5 → 11 px`; location: `10 → 9.5 px`; yrs/reply row: `9.5 → 9 px`.
- [x] Vertical rhythm: card content `gap-1 → gap-[3px]`, image overlay price chip text `10 → 9.5 px`.
- [x] **CTAs untouched** — Send Enquiry + Call buttons remain at the same height/prominence.
- [x] Grid row range tightened to `minmax(190 px, 210 px)` — uniform card heights at all zoom levels (search & FBM screens).
- [x] Verified: page no scroll, grid no scroll, image height stable at 88 px, card height 210 px.

## Completed (2026-05-05 · v9 — fully non-scrollable SearchPage at 100% zoom)
- [x] **Page no longer scrolls at 100% zoom** on standard laptop viewports (1366×768, 1440×900, 1920×1080).
- [x] Seller grid switched from `flex-1 + auto-rows-min + overflow-y-auto` (which used to scroll inside) to `shrink-0` with **CSS-Grid `minmax(150 px, 220 px)` row heights** — cards stay visually consistent across all viewport sizes, no internal scroll either.
- [x] Row count is phase-aware: `1` row for Find Best Match results phase (5 cards), `2` rows for filters phase (10 cards).
- [x] `SellerCard` content area uses `flex flex-col + mt-auto` on the CTA row so cards don't show empty padding at large viewports.
- [x] Both `gridScrolls` and `pageScrolls` programmatically verified to be `false` after the change.

## Completed (2026-05-05 · v8 — CTA proportions SWAP on Call click)
- [x] Default CTA row: **Send Enquiry (wide, flex-1)** + **Call (small 36 px icon with phone icon)**
- [x] On Call click: widths smoothly animate — **Send Enquiry shrinks to 36 px icon**, **Call expands to flex-1** and reveals the full phone number
- [x] On Send Enquiry click (in either state): button flips to "✓ Sent" (emerald) and a bottom-center toast confirms "Enquiry sent to {seller}"
- [x] Same component (`SellerCard.jsx`) is used for both **Search results grid** AND **Find Best Match "Top picks for you"** view — single update covers both flows

## Completed (2026-05-05 · v7 — SearchPage layout refactor + in-place CTA flip)
- [x] **Layout refactor**: sub-header row (Back / PRODUCT SEARCH / query / Location / Local only / count) moved INSIDE `<main>` column. Left nav + Refine Results panel now extend all the way up to the navy header — frees vertical space for more filters.
- [x] `CollapsibleSidebar`: removed the hard-coded `sticky top-[64px] h-[calc(100vh-64px)]` in favor of `h-full` so it fills the flex row cleanly.
- [x] **CTA row redesign** in `SellerCard.jsx`:
  - Floating phone chip removed (was getting clipped by the filter panel at smaller viewports).
  - "Send Enquiry" minimized to a 36 px icon-only button (Send icon) that flips to a green ✓ after click + fires an "Enquiry sent to {seller}" toast at the bottom-center of the page.
  - "Call" button is now `flex-1`; clicking flips the content in-place from `📞 Call` → `📞 +91 XXXXX XXXXX`. Button width and card layout stay constant (no reflow, no overflow).
  - Added `icon-flip` + `call-flip` Tailwind keyframes for micro-animations.
- [x] **Payment Protected filter chip**: added `whitespace-nowrap` so the label + "Soon" pill stay on a single line; re-styled to amber background with a rounded-pill "Soon" badge for clearer disabled/coming-soon state.

## Completed (2026-05-05 · v6 — Call CTA floating chip + seller trust data)
- [x] Call CTA no longer distorts card layout — revealed phone number now renders as an **absolute-positioned floating chip** above the Call button (high z-index)
- [x] Chip includes: click-to-dial link, copy-to-clipboard, dismiss (×), downward arrow pointing to the Call button
- [x] Chip auto-dismisses on outside click or Escape key
- [x] Call button label stays a constant "Call" — no width/text swap, no reflow
- [x] Card root `overflow-hidden` removed so chip can float outside; image `rounded-t-[10px]` applied to preserve card visual
- [x] New `phone-chip` Tailwind keyframe (160ms ease-out fade+slide)
- [x] New data row on every `SellerCard`: **Years Experience** (Briefcase icon) · **Response Rate** (Zap icon) — values already produced by `rankSellers.js` (`yearsExp`, `responsiveness`)


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

## Completed (2026-02 · v3 — Search Page declutter pass)
- [x] Grid switched from 5 → 4 columns on desktop (cleaner card density)
- [x] Filters phase shows 4 × 2 = 8 sellers (rest reachable via Find Best Match)
- [x] Find Best Match phase shows a single row of 4 cards with prev/next carousel arrows + pagination dots — full seller list paginated, vertical space freed for the assistant
- [x] Removed redundant "Refine Results" header AND "Specifications" section wrapper from filter panel — flat layout with thin dividers (no more "border inside border" double-frame on desktop)
- [x] Removed purple "Product Search" pill in sub-header; Back becomes a clean icon-only 28px button; query heading uses larger 16-17px emerald font
- [x] SellerCard declutter — inactive trust chips (GST / TrustSEAL / Pay-Protected) are now hidden instead of strike-through (`min-h-[16px]` reservation preserves vertical alignment)

## Backlog / P1
- [ ] Refactor `SearchPage.jsx` (~700 lines) into `<FilterPanel/>` and `<SearchSubHeader/>` modules
- [ ] Mobile (414px) responsiveness QA — sub-header wrap + 2-col card grid
- [ ] Hover tooltip showing full company name on truncated 2-line titles
- [ ] "Top Pick" / "Best Match" ribbon on card #1 in FBM phase
- [ ] Image fallback gradient placeholder to avoid broken-image flash
- [ ] Post RFQ flow (modal with form)
- [ ] "Continue with Seller" / "Send Enquiry" chat UI
- [ ] Compare Quotes side-by-side view
- [ ] Real backend (FastAPI + MongoDB) for RFQs, messages, orders
- [ ] Mobile responsive polish (<768px)
- [ ] Keyboard navigation for search suggestions

## Business Enhancement Idea
Auto-surface the user's *most-searched* category on the home dashboard (or persist recent searches in localStorage with a "Recently searched" strip under the search bar) — that raises repeat-RFQ conversion significantly on B2B marketplaces.
