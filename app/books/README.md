Books

- Drag scattered book covers (pointer + keyboard nudge).
- Click a card to open details (right sheet on desktop, full-screen modal on mobile). 
- Toggle between scatter/grid with smooth spring animations.
- Sort by title/author/year/rating. In scatter mode, order updates z-index; positions stay.

Dev

- Install deps: `pnpm add @dnd-kit/core @dnd-kit/sortable framer-motion`
- Run: `pnpm dev` and open `/books`.

Keybinds

- Enter/Space on a focused card: open details
- Arrow keys on a focused card (scatter mode): move by 10px (hold Shift for 20px)
- Esc in details: close

API swap memo

- Data source: `app/books/_data/books.json` is imported in `app/books/Client.tsx`.
- Replace with a fetcher function that returns `Book[]` and pass into the component.
- If fetching client-side, add a skeleton or Suspense fallback and keep the same `Book` shape.

