# Healing Waters Clinic — Implementation Design Spec

**Date:** 2026-03-20
**Stack:** Next.js 16.2 (App Router) · React 19 · Tailwind CSS v4 · Motion v12 · TypeScript
**Source material:** `healing_waters_clinic_prd.html` + `stitch/` HTML prototypes

---

## 1. Architecture

### Routing (App Router, file-system based)
```
app/
  layout.tsx            Root layout — fonts, metadata, Navbar, floating CTA
  globals.css           Tailwind v4 @theme tokens + base custom CSS
  page.tsx              /  (Home)
  services/page.tsx     /services
  practitioners/page.tsx /practitioners
  journey/page.tsx      /journey   ← built from PRD only; no stitch file
  facilities/page.tsx   /facilities
  booking/page.tsx      /booking
components/
  Navbar.tsx            Sticky, scroll-aware (Client Component, 'use client')
  Footer.tsx            Server Component
  QuickBookFAB.tsx      Floating action button (Client Component, 'use client')
```

### Component boundary strategy
- Pages are Server Components by default; no `'use client'` unless state/effects needed
- Interactive leaves (filters, accordion, booking form, lightbox) are isolated Client Components
- All Motion-animated components require `'use client'`

### Config file
`next.config.ts` — TypeScript is enabled; `.ts` extension is supported by Next.js 16.

---

## 2. Design System

### Color Decision
The stitch prototypes use `#11a0d4` (lighter, more saturated cyan) rather than the PRD's
`#227C9D`. Since the stitch represents the latest visual iteration, **`#11a0d4` is adopted
as the primary color** throughout. This is a deliberate design decision.

### Colors — Tailwind v4 `@theme` tokens
| CSS token | Value | Usage |
|-----------|-------|-------|
| `--color-primary` | `#11a0d4` | Buttons, links, active states, hero headline |
| `--color-accent` | `#17C3B2` | FAB, success, gradient end |
| `--color-background` | `#f6f7f8` | Page background |
| `--color-surface` | `#ffffff` | Cards, modals |
| `--color-text` | `#0d181b` | Body copy |
| `--color-muted` | `#B9D6D6` | Borders, secondary text |

### Typography
- **Headings:** `Instrument Serif` loaded via `next/font/google` with `variable: '--font-serif'`
- **Body/UI:** `Manrope` loaded via `next/font/google` with `variable: '--font-sans'`

Font wiring pattern:
```ts
// app/layout.tsx
import { Manrope, Instrument_Serif } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap'
})

// Apply both variables on <html>:
// className={`${manrope.variable} ${instrumentSerif.variable}`}
```

In `globals.css` `@theme`:
```css
@theme {
  --font-sans: var(--font-sans);   /* resolves to Manrope from next/font */
  --font-serif: var(--font-serif); /* resolves to Instrument Serif */
}
```
Tailwind utilities `font-sans` and `font-serif` then reference these.

### Shadow tokens
```css
--shadow-soft: 0 20px 40px rgba(17, 160, 212, 0.08);
--shadow-soft-hover: 0 30px 50px rgba(17, 160, 212, 0.15);
```
Used via Tailwind arbitrary values: `shadow-[var(--shadow-soft)]`, or defined in `@theme`.

### Border radius
- Cards: `rounded-2xl` (32px)
- Buttons: `rounded-full` (pill)

---

## 3. Pages

### Home (`/`)
**Sections:** Navbar · Hero · Service Cards · Testimonial

**Hero:**
- Flex layout, column on mobile, `md:flex-row` on desktop
- Left: `Instrument Serif` headline "Restore Your Natural Flow" + subtext + CTA button
- Right: morphing blob (CSS keyframe `morph` animating `border-radius`) with clinic image inside; entrance via Motion `initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}`
- Text block entrance: Motion `initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}`

**Service Cards (3-column grid, →2 tablet, →1 mobile):**
- Each card: white bg, `rounded-2xl`, `shadow-soft`; decorative top-right corner blob
- Motion `whileHover={{ y: -8 }}` + CSS transition for shadow (0.4s ease)
- Services: Hydrotherapy, Massage Therapy, Acupuncture
- "Discover →" link with hover gap transition

**Testimonial:**
- Full-width rounded panel, `bg-gradient-to-br from-primary/10 to-primary/5`
- Quote text, avatar image, name/role
- Motion `whileInView={{ opacity:1, y:0 }}` (once)

**Home loading shimmer:** Out of scope for v1 (no real async data; images load via `next/image` with `placeholder="blur"` if blur data URI is available, otherwise native lazy load). Documented as PRD deviation.

---

### Services (`/services`)
**Sections:** Navbar · Page Header + Category Filter · Treatment Blocks

**Category Filter (Client Component):**
- Pill buttons: All | Hydrotherapy | Massage | Alternative
- State: `activeCategory` string; onClick toggles
- Filtered list: `AnimatePresence` wraps list; items use `motion.article` with `exit={{ opacity:0, y:-10 }}`, `animate={{ opacity:1, y:0 }}`

**Treatment Blocks (alternating left/right):**
- Odd: image left, text right (`lg:flex-row`)
- Even: image right, text left (`lg:flex-row-reverse`)
- Image: `next/image`, `rounded-2xl`, with offset decorative shadow bg div
- Text: category badge, title, description, duration/price row, outlined CTA button
- Note: PRD specifies scroll parallax (10% speed). **Out of scope v1** (performance/complexity tradeoff). Future enhancement.

**Empty state:** "Check back soon for new wellness offerings." — rendered when filter returns no items.

**Treatments:**
1. Thermal Contrast Therapy — Hydrotherapy — 45min — $85
2. Restorative Deep Tissue — Massage — 60/90min — $130/$180
3. Acupuncture Flow — Alternative — 60min — $110

---

### Practitioners (`/practitioners`)
**Sections:** Navbar · Page Header · Masonry Portrait Grid

**Header:**
- Title: "Guided by Experts" with cyan underline (`::after` or `<span>` positioned absolutely)
- Subtitle paragraph

**Masonry Grid:**
- CSS `column-count: 1` (sm: 2, lg: 3); `column-gap: 1.5rem`; `break-inside: avoid`
- No JS needed — pure CSS masonry

**Portrait Cards:**
- `overflow-hidden rounded-xl`; each card has variable aspect ratio for visual interest
- On hover:
  - `group-hover:scale-105` on `<img>` (inside overflow-hidden) — 700ms ease
  - `::after` pseudo-element: `background: #11a0d4; mix-blend-mode: multiply; opacity: 0 → 0.6` — duotone effect
  - Name/credentials block: `translateY(-1rem)` to reveal space below
  - Philosophy quote: `translateY(20px) opacity:0 → translateY(0) opacity:1` CSS transition
- Gradient overlay: `bg-gradient-to-t from-slate-900/90 to-transparent`

**5 practitioners:**
1. Dr. Elena Rostova — ND, LAc — Holistic Hydrotherapy & Acupuncture — "Healing begins when the body feels safe enough to rest."
2. Dr. Marcus Thorne — DC, MS — Restorative Chiropractic — "Alignment is the foundation of energy flow."
3. Sarah Jenkins — LMT, CST — Craniosacral & Deep Tissue — "The tissues hold the issues; we gently ask them to let go."
4. David Chen — PT, DPT — Movement Re-education — "Movement is medicine when guided by intention."
5. Aisha Patel — RDN, IFNCP — Integrative Nutrition — "Nourishment comes not just from food, but from a balanced life."

---

### Patient Journey (`/journey`)
**Sections:** Navbar · Page Header · SVG Path + 4 Milestones · FAQ Accordion

**SVG Path Animation (Client Component):**
- Winding vertical SVG, ~800px tall
- Stroke: linear gradient `#17C3B2 → #11a0d4`, 4px wide
- `stroke-dasharray` = total path length; `stroke-dashoffset` animated via:
  ```ts
  import { motion, useScroll, useTransform } from 'motion/react'
  const { scrollYProgress } = useScroll({ target: sectionRef })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])
  // <motion.path style={{ pathLength }} />
  ```
- `pathLength` 0→1 fills the path as the user scrolls the section into view

**4 Milestone Nodes:**
- 48px circular nodes, `bg-primary`, white icon inside
- Icons (Material Symbols): `chat` (Consultation), `analytics` (Assessment), `healing` (Treatment), `self_improvement` (Integration)
- Each node: Motion `whileInView={{ scale:1, opacity:1 }}` staggered by `delay: index * 0.2`

**FAQ Accordion (Client Component):**
- 4 questions: "Do you accept insurance?", "What should I wear?", "How long is a session?", "What should I expect during my first visit?"
- `AnimatePresence` + `motion.div animate={{ height: "auto" }}` initial `height: 0, overflow: "hidden"`
  - Note: use string `"auto"` not bare `auto` — required by Motion for auto-height
- Chevron/arrow icon: CSS `rotate-180` on open state

---

### Facilities (`/facilities`)
**Sections:** Navbar · Page Header · Bento Photo Grid · Lightbox (Client Component)

**Bento Grid:**
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `auto-rows-[250px] md:auto-rows-[300px]`
- Cell spans: Pool → `lg:col-span-2 lg:row-span-2`; Massage Room → `lg:row-span-2`; Lounge → `md:col-span-2`
- Each cell: `relative overflow-hidden rounded-2xl cursor-pointer`
- Hover: `group-hover:scale-[1.05]` on `<img>` + gradient overlay fade-in with room name

**Lightbox (Client Component):**
- `AnimatePresence` renders when `selectedImage !== null`
- `motion.div` backdrop: `fixed inset-0 bg-black/80 z-50`, click to close
- `motion.img initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}`
- Escape key listener in `useEffect` to close
- 5 rooms: Hydrotherapy Pool, Waiting Suite, Massage Room, Acupuncture Room, Relaxation Lounge

---

### Booking (`/booking`)
**Sections:** Blurred background · Centered card (`max-w-[600px]`) · 3-step form + Confirmation

**Progress tracking:**
- 3 dots (steps: Service, Time, Details). Confirmation is a post-submission state, not a dot.
- Progress bar: `w-1/3` (step 1) → `w-2/3` (step 2) → `w-full` (step 3, filling before submit)
- 3 dots, active dot = `bg-primary`, inactive = `bg-primary/30`

**Step transitions (Client Component):**
- `AnimatePresence mode="wait"` with `key={step}`
- `motion.div initial={{ x:50, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-50, opacity:0 }}`

**Step 1 — Service:**
- 3 styled radio label-cards: Hydrotherapy Intake ($120/45min), Restorative Massage ($150/60min), Acupuncture Session ($90/30min)
- Selected card: `border-primary bg-primary/5`; unselected: `border-slate-200`

**Step 2 — Time:**
- Month/year header with prev/next chevrons
- 7-column date grid; selected date: `bg-primary text-white rounded-full`
- AM/PM time slot buttons in a grid

**Step 3 — Details:**
- First name, last name, email, phone (all required), notes (optional)
- Error state: `border-red-400` outline + inline error text (`text-[#E07A5F]`)
- Submit button: "Confirm Booking" → "Confirming..." with spinning loader on submit
- `transition-all duration-300`

**Confirmation (post-submit state, replaces card content):**
- Large animated checkmark: `motion.path` with `initial={{ pathLength:0 }} animate={{ pathLength:1 }}`
- Appointment summary card
- "Add to Calendar" button (decorative; no real calendar API)

---

## 4. Shared Components

### Navbar
- `'use client'` — needs `useEffect` scroll listener
- On mount scroll = 0: transparent, no border
- On scroll > 10px: `backdrop-blur-md bg-white/80 border-b border-slate-200/60`
- Smooth via Motion `animate` on `motion.header`
- Logo: water-drop SVG icon + "Healing Waters Clinic"
- Nav links → Next.js `<Link>` (not `<a>`) for client-side navigation
- Active link: text-primary; inactive: text-slate-600
- Mobile breakpoint: links hidden below `md` (768px); hamburger icon visible. Drawer not wired (v1 out of scope).
- CTA: "Book Visit" → `<Link href="/booking">` pill button

### Footer
- `bg-slate-900 text-slate-300`
- Logo + tagline + nav links + copyright `© 2026 Healing Waters Clinic`

### QuickBookFAB
- `'use client'` for Motion hover
- `fixed bottom-8 right-8 z-50`
- `bg-accent` (`#17C3B2`), white text, pill, calendar icon + "Quick Book"
- `motion.a whileHover={{ y:-4 }}`, glow shadow

---

## 5. Tailwind v4 Migration Notes

No `tailwind.config.js` is used. All theme extensions live in `globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #11a0d4;
  --color-accent: #17C3B2;
  --color-background: #f6f7f8;
  --color-surface: #ffffff;
  --color-text: #0d181b;
  --color-muted: #B9D6D6;

  --font-sans: var(--font-sans);      /* set by next/font Manrope variable */
  --font-serif: var(--font-serif);   /* set by next/font Instrument Serif variable */

  --shadow-soft: 0 20px 40px rgba(17, 160, 212, 0.08);
  --shadow-soft-hover: 0 30px 50px rgba(17, 160, 212, 0.15);
}
```

v3 CDN config (stitch files) → v4 equivalents:
- `bg-primary` ✓ works via `--color-primary`
- `text-primary/10` ✓ opacity slash syntax supported
- `shadow-soft` → `[box-shadow:var(--shadow-soft)]` or defined in `@theme` as above
- `font-display` → renamed to `font-sans` (Manrope) in this project
- `bg-background-light` → replaced with `bg-background` (maps to `--color-background`)

---

## 6. Motion v12 Import Path

All Motion imports must use `motion/react` (package was renamed from `framer-motion`):
```ts
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react'
```

---

## 7. External Images

`next.config.ts` → `images.remotePatterns`:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ]
}
```

---

## 8. Out of Scope (v1)

| Feature | PRD reference | Reason omitted |
|---------|--------------|----------------|
| Mobile hamburger drawer | Home/all pages | Complexity; icon visible |
| Services image parallax (10% scroll) | Services interactions | Performance tradeoff |
| Home image placeholder shimmer | Home loading state | No async data source |
| Real booking backend | Booking confirmation | Static demo only |
| Dark mode toggle | Implied by stitch dark variants | No toggle wired |
