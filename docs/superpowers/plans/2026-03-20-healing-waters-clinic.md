# Healing Waters Clinic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 6-page Next.js 16 wellness clinic website (Home, Services, Practitioners, Journey, Facilities, Booking) with Tailwind CSS v4, Motion v12 animations, and a shared Navbar/Footer.

**Architecture:** App Router pages are Server Components by default; interactive leaves (category filter, lightbox, booking form, FAQ, journey path) are isolated Client Components with `'use client'`. All Motion imports use `motion/react`. Custom design tokens live in `globals.css` `@theme {}` — no `tailwind.config.js`.

**Tech Stack:** Next.js 16.2 · React 19 · Tailwind CSS v4 · Motion v12 · TypeScript · `next/font/google` (Manrope + Instrument Serif) · Material Symbols web font

---

## File Map

| File | Responsibility |
|------|----------------|
| `app/globals.css` | `@theme` design tokens (colors, fonts, shadows) + blob keyframe |
| `app/layout.tsx` | Root layout: fonts, metadata, `<Navbar>`, `<QuickBookFAB>`, `<Footer>` |
| `next.config.ts` | `images.remotePatterns` for external image domains |
| `components/Navbar.tsx` | Sticky, scroll-aware header (Client Component) |
| `components/Footer.tsx` | Dark footer with nav links (Server Component) |
| `components/QuickBookFAB.tsx` | Fixed "Quick Book" pill (Client Component) |
| `app/page.tsx` | Home: Server Component shell — imports animated child |
| `app/HomeAnimated.tsx` | Client Component: Hero, Service Cards, Testimonial (all Motion) |
| `app/services/page.tsx` | Services: shell + static treatment data |
| `app/services/CategoryFilter.tsx` | Client Component: pill filter + animated list |
| `app/practitioners/page.tsx` | Practitioners: masonry portrait grid (CSS-only interactivity) |
| `app/journey/page.tsx` | Patient Journey: shell + milestones + FAQ |
| `app/journey/JourneyPath.tsx` | Client Component: scroll-linked SVG stroke animation |
| `app/journey/FaqAccordion.tsx` | Client Component: AnimatePresence accordion |
| `app/facilities/page.tsx` | Facilities: bento grid shell |
| `app/facilities/FacilitiesGrid.tsx` | Client Component: grid + lightbox |
| `app/booking/page.tsx` | Booking: blurred background shell |
| `app/booking/BookingForm.tsx` | Client Component: 3-step form + confirmation |

---

## Task 1: Foundation — globals.css, next.config.ts, layout.tsx

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Update `next.config.ts` to allow external images**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Replace `app/globals.css` with Tailwind v4 design tokens**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #11a0d4;
  --color-accent: #17C3B2;
  --color-background: #f6f7f8;
  --color-surface: #ffffff;
  --color-text: #0d181b;
  --color-muted: #B9D6D6;

  /* Shadows */
  --shadow-soft: 0 20px 40px rgba(17, 160, 212, 0.08);
  --shadow-soft-hover: 0 30px 50px rgba(17, 160, 212, 0.15);
}

/* Fonts — @theme inline resolves the CSS variable at runtime rather than at
   theme-compile time, avoiding a circular self-reference. The --font-sans and
   --font-serif CSS properties are set by next/font via the `variable` option
   applied to the <html> element in layout.tsx. */
@theme inline {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-sans, Manrope, sans-serif);
  -webkit-font-smoothing: antialiased;
}

/* Blob morphing animation used in Hero */
@keyframes morph {
  0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}

.blob-mask {
  animation: morph 8s ease-in-out infinite alternate;
}
```

- [ ] **Step 3: Update `app/layout.tsx` with fonts, metadata, and shell**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickBookFAB from "@/components/QuickBookFAB";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Healing Waters Clinic — Restore Your Natural Flow",
  description:
    "Premium holistic wellness clinic offering hydrotherapy, massage therapy, and acupuncture.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Material Symbols for icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickBookFAB />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
```

Expected: no errors (or only errors about missing components we haven't created yet).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx next.config.ts
git commit -m "feat: foundation — design tokens, fonts, layout shell"
```

---

## Task 2: Shared Components — Navbar, Footer, QuickBookFAB

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`
- Create: `components/QuickBookFAB.tsx`

- [ ] **Step 1: Create `components/Navbar.tsx`**

```tsx
// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/practitioners", label: "Practitioners" },
  { href: "/journey", label: "Journey" },
  { href: "/facilities", label: "Facilities" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Note: backdropFilter is not animatable via Motion's animate prop.
  // Use className toggle for backdrop-blur and bg instead.
  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0)",
        borderBottomColor: scrolled ? "rgba(226,232,240,0.6)" : "rgba(226,232,240,0)",
      }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-50 border-b w-full transition-[backdrop-filter] duration-300 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-primary">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48">
            <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" />
          </svg>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            Healing Waters Clinic
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-primary"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile icon */}
        <div className="flex items-center gap-4">
          <Link
            href="/booking"
            className="hidden md:flex items-center justify-center rounded-full h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_8px_16px_rgba(17,160,212,0.15)]"
          >
            Book Visit
          </Link>
          <button className="md:hidden text-slate-900" aria-label="Menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
```

- [ ] **Step 2: Create `components/Footer.tsx`**

```tsx
// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-bold text-white text-lg">Healing Waters Clinic</span>
          <span className="text-sm">Restore your natural flow.</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          {[
            { href: "/services", label: "Services" },
            { href: "/practitioners", label: "Practitioners" },
            { href: "/journey", label: "Journey" },
            { href: "/facilities", label: "Facilities" },
            { href: "/booking", label: "Book a Visit" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-slate-600">
          © 2026 Healing Waters Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create `components/QuickBookFAB.tsx`**

```tsx
// components/QuickBookFAB.tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function QuickBookFAB() {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href="/booking"
        className="flex items-center gap-2 rounded-full h-14 px-7 bg-accent text-white text-sm font-bold shadow-[0_10px_25px_rgba(23,195,178,0.4)] hover:shadow-[0_15px_35px_rgba(23,195,178,0.5)] transition-shadow"
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          calendar_month
        </span>
        <span>Quick Book</span>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
```

Expected: no errors related to the three new component files.

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: add Navbar, Footer, QuickBookFAB shared components"
```

---

## Task 3: Home Page

**Files:**
- Create: `app/HomeAnimated.tsx` (Client Component — all Motion)
- Modify: `app/page.tsx` (Server Component — imports HomeAnimated)

- [ ] **Step 1: Create `app/HomeAnimated.tsx`** (Client Component with all animations)

```tsx
// app/HomeAnimated.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

const services = [
  {
    icon: "water_drop",
    iconFill: true,
    title: "Hydrotherapy",
    description:
      "Immerse yourself in healing waters. Contrast therapy to reduce inflammation and accelerate recovery.",
    href: "/services",
  },
  {
    icon: "spa",
    iconFill: false,
    title: "Massage Therapy",
    description:
      "Release deep tissue tension, improve circulation, and restore musculoskeletal balance with expert hands.",
    href: "/services",
  },
  {
    icon: "acupuncture",
    iconFill: false,
    title: "Acupuncture",
    description:
      "Realign your body's natural energy pathways to manage pain, reduce stress, and promote holistic healing.",
    href: "/services",
  },
];

export default function HomeAnimated() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 justify-between">
          {/* Text */}
          <motion.div
            className="flex flex-col gap-8 md:w-1/2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-primary text-5xl md:text-[64px] leading-[1.1] font-extrabold tracking-tight">
                Restore Your<br />Natural Flow
              </h1>
              <p className="text-slate-600 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                Experience holistic wellness designed to lower stress and elevate
                physical recovery. Step into tranquility.
              </p>
            </div>
            <Link
              href="/services"
              className="flex w-fit items-center gap-2 rounded-full h-14 px-8 bg-primary text-white text-base font-bold tracking-wide shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1 transition-all duration-300"
            >
              Discover Treatments
              <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
            </Link>
          </motion.div>

          {/* Blob image */}
          <motion.div
            className="md:w-1/2 flex justify-center relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-primary/10 blob-mask scale-105 blur-xl" />
            <div className="relative w-full max-w-[500px] aspect-square blob-mask overflow-hidden shadow-[var(--shadow-soft)] border-4 border-white">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPOuD4lRfkE7mW9Uf2RlAng4VhjTJLh0mkRt00OHkBdUFReIVEphLF1pmp8M_Atr5nQ13SRrM7KB82MbiZaa_sWf5q97iAUaXChXGgFIaJfvnwFiw-jUMKLZW7ZJT2RAYUo5BHM79Jfimqt47-jBSrWiH6Z-b280ELpq5pmUg6lddCh3turlzwnF_KNYNFN_AJ8RgXiAfpEvZM5PlmXE3A0DIIvMMDTKoFrxCnrb80J25Dtrarb9UpiNGYR9IzS28U3K7I6nT_PkA"
                alt="Serene hydrotherapy pool"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col gap-12">
          <div className="flex flex-col gap-3 items-center text-center max-w-2xl mx-auto">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              Core Therapies
            </span>
            <h2 className="text-slate-900 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Our Services
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              Explore treatments tailored for physical recovery, stress relief, and
              restoring your body's natural balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                className="group relative flex flex-col gap-6 rounded-2xl bg-surface p-8 shadow-[var(--shadow-soft)] border border-slate-100 overflow-hidden cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8, boxShadow: "var(--shadow-soft-hover)" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform group-hover:scale-110 -z-10" />
                <div className="text-primary bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={service.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {service.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-slate-900 text-2xl font-bold">{service.title}</h3>
                  <p className="text-slate-600 text-base font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <Link
                    href={service.href}
                    className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Discover
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 md:py-24">
        <motion.div
          className="relative rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 p-10 md:p-16 flex flex-col items-center text-center overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute top-4 left-4 text-primary/20">
            <span
              className="material-symbols-outlined text-8xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
          </div>
          <div className="max-w-3xl relative z-10">
            <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed italic mb-8">
              "The moment I stepped in, my anxiety melted away. The hydrotherapy
              session was truly a restorative experience that left me feeling
              completely renewed."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgJTCMl6sQ4piUsrvze0io4Fck2xCVctBQuFFu5TLr1XDHHE0EsvWvCuAmgNHaOwz25OL_LGcsjA9DEJQ_IzpLm5UEU0JnfjpE3O3-LEvvGcyKacx62hkRmxe9uuVatI5KmKryk2P3RnaETQuF6_7G58cklFYk06MQZWbbLYMJesquMNjK03MHwDWVILhag2-a5YAXzaBJpAZNsLM-EzGh_SdfFsdVr6mffhSDN8xxBrTPN8W30sfwvC3mz6BXuYSKICwaV_fH5eE"
                  alt="Sarah T."
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Sarah T.</p>
                <span className="text-sm text-slate-500">Wellness Patient</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/page.tsx`** (Server Component — just imports and renders HomeAnimated)

```tsx
// app/page.tsx
import HomeAnimated from "./HomeAnimated";

export default function HomePage() {
  return <HomeAnimated />;
}
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/HomeAnimated.tsx
git commit -m "feat: add Home page with hero, service cards, and testimonial"
```

---

## Task 4: Services Page

**Files:**
- Create: `app/services/page.tsx`
- Create: `app/services/CategoryFilter.tsx`

- [ ] **Step 1: Create `app/services/CategoryFilter.tsx`** (Client Component for interactive filtering)

```tsx
// app/services/CategoryFilter.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const treatments = [
  {
    id: 1,
    category: "Hydrotherapy",
    icon: "water_drop",
    title: "Thermal Contrast Therapy",
    description:
      "Experience the profound restorative effects of alternating hot and cold plunge pools. This ancient practice stimulates circulation, reduces muscle inflammation, and provides an immediate surge of endorphins, leaving you feeling revitalized and clear-headed.",
    duration: "45 mins",
    price: "$85",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCypftV-5iGlYqh_UCuGpvspIrHefBCOABwCo7D_5vcFQRlY_UA9O7oPz7mNF4KhVr-rFTqKNacw9IasPjzNud1ljXs5G33V5ftjRQhsRow1gyRKasKwGX8CNtfQJ2kU_E5xNWJbIqin77FydDz2Ox2wgR8_66tP01WMfuqlnOdwxmvvLNEoYDetSx_VaI3XBOC9RD_xnkxPmIYE7GwGpdqbvqgq48EBry6Ztlo9D1mDpyxcxW5IN6l9jvgAmuuiLF_N8drLCU4kAE",
    imageAlt: "Person relaxing in a hydrotherapy pool",
  },
  {
    id: 2,
    category: "Massage",
    icon: "spa",
    title: "Restorative Deep Tissue",
    description:
      "A highly targeted therapeutic massage designed to release chronic tension patterns. Our practitioners use slow, deliberate strokes and deep pressure to realign deeper layers of muscles and connective tissue, promoting healing and restoring mobility.",
    duration: "60 / 90 mins",
    price: "$130 / $180",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDZYwoyZSXM47tdV9jhS_lTogre-d1R6Wjcbgx0gqh_vF2bZctjT1rrGmg27Bch4Ne1EkTO_-0X46A_ckgRrX0s-qbbwGAHsyZyGW-wLw_-l7VAg8VAb4VLFiwndmQ4Lym-dX7wV_opJyTytcT7o6Ooma00e3YyXbTz4PqUrDepHezMBemNtBB2SALFnhaDPNsSEKBY_PK6A_BgPDcW0cGYohQTeEAycSCl0T2a2fJMLV5ua4-Jv4zn9H5Fq4y1NwLe9mZgrjjA-k",
    imageAlt: "Person receiving a deep tissue back massage",
  },
  {
    id: 3,
    category: "Alternative",
    icon: "energy_savings_leaf",
    title: "Acupuncture Flow",
    description:
      "Rebalance your body's vital energy pathways. This gentle, time-tested modality involves the insertion of ultra-fine needles at strategic points to alleviate pain, reduce systemic stress, and encourage the body's natural self-healing mechanisms.",
    duration: "60 mins",
    price: "$110",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-dOjwV7SBEbGaPWDOFDNqUr8M5Of9kgf7lIkEc-9X4cLpSKOFtARQUpdDOQ1ZrZZWJSvAl86KZ_2axxgi2ymV9db4duQXwg2Axs9FN_jvA5EFV7hv0L33mCpwvFEYdHKLS5efbPmefca2gGgHmb-aEAPJc_N4pHhhsP7JbVHpbq1Huy91ATSKqoxpDW0Gzja3GAdK24JLV4FW31lf00NJxw34W8lZlpk-Wlqc93Fk-InWs_KNsjr5c3kMcydkd0-zvOhB9X7zp0Q",
    imageAlt: "Close up of acupuncture needles",
  },
];

const categories = ["All", "Hydrotherapy", "Massage", "Alternative"];

export default function CategoryFilter() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? treatments
      : treatments.filter((t) => t.category === active);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-all ${
              active === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Treatment list */}
      <div className="flex flex-col gap-24 md:gap-40 mt-16">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              className="text-slate-500 text-center py-16 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Check back soon for new wellness offerings.
            </motion.p>
          ) : (
            filtered.map((treatment, i) => (
              <motion.article
                key={treatment.id}
                className={`flex flex-col lg:gap-20 items-center gap-10 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 relative group">
                  <div
                    className={`absolute inset-0 bg-primary/10 rounded-2xl -z-10 transition-transform duration-500 ${
                      i % 2 === 1
                        ? "transform -translate-x-4 translate-y-4 group-hover:-translate-x-6 group-hover:translate-y-6"
                        : "transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6"
                    }`}
                  />
                  <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                    <Image
                      src={treatment.image}
                      alt={treatment.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="w-full lg:w-1/2 flex flex-col items-start">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                    <span className="material-symbols-outlined text-[18px]">
                      {treatment.icon}
                    </span>
                    {treatment.category}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    {treatment.title}
                  </h3>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {treatment.description}
                  </p>
                  <div className="flex items-center gap-6 mb-8 text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                      {treatment.duration}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      {treatment.price}
                    </div>
                  </div>
                  <Link
                    href="/booking"
                    className="flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors px-8 py-3 font-bold"
                  >
                    Book {treatment.category === "Hydrotherapy" ? "Thermal Therapy" : treatment.title}
                  </Link>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `app/services/page.tsx`**

```tsx
// app/services/page.tsx
import CategoryFilter from "./CategoryFilter";

export const metadata = {
  title: "Our Healing Therapies — Healing Waters Clinic",
};

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
      <section className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Our Healing Therapies
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            Explore our holistic treatments designed for your physical recovery,
            stress relief, and overall well-being. Find the perfect flow for your
            body.
          </p>
        </div>
        {/* CategoryFilter handles its own filter pills and list */}
        <div />
      </section>
      <CategoryFilter />
    </div>
  );
}
```

- [ ] **Step 3: Type-check and commit**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
git add app/services/
git commit -m "feat: add Services page with animated category filter"
```

---

## Task 5: Practitioners Page

**Files:**
- Create: `app/practitioners/page.tsx`

Note: Hover effects (duotone, quote slide) are CSS-only — no JS needed, so no Client Component.

- [ ] **Step 1: Add practitioners CSS to `app/globals.css`**

Append the following to `app/globals.css` (after the blob keyframe). Do NOT use an inline `<style>` in the Server Component — Next.js App Router does not support raw `<style>` JSX in Server Components.

```css
/* Practitioners page — CSS-only hover effects */
.duotone-hover::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: #11a0d4;
  mix-blend-mode: multiply;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 10;
  border-radius: inherit;
}
.group:hover .duotone-hover::after { opacity: 0.6; }

.quote-slide {
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s ease;
}
.group:hover .quote-slide { transform: translateY(0); opacity: 1; }

.name-block { transition: transform 0.3s ease; }
.group:hover .name-block { transform: translateY(-1rem); }

.masonry-grid {
  column-count: 1;
  column-gap: 1.5rem;
}
@media (min-width: 640px) { .masonry-grid { column-count: 2; } }
@media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
.masonry-item { break-inside: avoid; margin-bottom: 1.5rem; }
```

- [ ] **Step 2: Create `app/practitioners/page.tsx`**

```tsx
// app/practitioners/page.tsx
import Image from "next/image";

export const metadata = { title: "Our Practitioners — Healing Waters Clinic" };

const practitioners = [
  {
    name: "Dr. Elena Rostova",
    credentials: "ND, LAc",
    specialty: "Holistic Hydrotherapy & Acupuncture",
    quote: "Healing begins when the body feels safe enough to rest.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9jm318yS6CjWPMka7G9scIEtRUkOpxhNKyShLO5m6dAoWV3n8ugbiCuCo2KH-_UynlDF1Ut1R97xRJA_azTbjts0ibEecCfRmHI1Rh0YcUwEz0tRtpswEeno9387rCJKjVM1b7HFe9k6sAjcjSf8zPJ-9WCYhHKGvy9De-0JagiX_SiNSXpr_jwUGELhpavh7iSRJ8EMAikwyzqstBAvfQK-POMZQeY9MX_Y0iJLfur4qusJFFRMCBWUuNZl-f3gLY1biUAJLy2U",
    aspectClass: "aspect-[3/4]",
  },
  {
    name: "Dr. Marcus Thorne",
    credentials: "DC, MS",
    specialty: "Restorative Chiropractic",
    quote: "Alignment is the foundation of energy flow.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG5EUg7Zh9Q5_U85G25lnyLpYF8NU0yYBiGbopOQjJrJeV_fKE3dgrZstL_OUo81xmcnmBxknv4mOXAWLln4mGtJLaxSCksUhimhnMIfefyM032BhuLeoJqMpK1Yol9JCpWd32iUDZ_zXh1jJBMFjhPwVtj8wji5PYXfq4FHj1WaS36t9Md-RO8rQlFE_ijN8NaAOCHxGWagcjqdL-SH7-Gh3zDWLsatdzcOS27P-fHsDyMx-C5705tJRFMUAB6_ape3xgNqYkuNU",
    aspectClass: "aspect-square",
  },
  {
    name: "Sarah Jenkins",
    credentials: "LMT, CST",
    specialty: "Craniosacral & Deep Tissue",
    quote: "The tissues hold the issues; we gently ask them to let go.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1JhN7bcjNuuQYT7ClQnhkZjSUqi4i3AD-APWMh5JK7XrxnlKiVclZXPVrJuy88HuMQaW1yZghE-Lm26EujitBupBHfbkY9PwbWMtcCSBmoyAksHAnoQO1fy4eGUYQG8Q8KxVIh5H5sgFz0O2V_60Q5WnBSzjdxiqONC1v4Fsnl6BTnxe7JnZQXng6eaEfjqRrRGS1h9NTjjMPq2uoE3RM75VHVg6ekOMc48cxPYNNTF8GK5HSmV_y_EyEYNRgWpvufDs8emtiM",
    aspectClass: "aspect-[4/5]",
  },
  {
    name: "David Chen",
    credentials: "PT, DPT",
    specialty: "Movement Re-education",
    quote: "Movement is medicine when guided by intention.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXFUTLuwA9F9dKzr0tYHSAy2zNnKkSCQcQGSWsVy6LDDA33ubLskPS1r5pUwqj9LgKSnVCrT_NWsIygwvg-XTywjdO5SHRm2miF4iP1tnXjaLmOlXVY5PSdM624Fxa-lqtvBFAWCB4SlRzDNC0yCeWzIbZxG_rb6FhVfA2HpJjMdTMbFiAZQjutbR9R86IE6cvwfhzNJkI_LqG_KcsOS57Lrb1ROLnivohexDmeitJfPhmi3iSQYYnAl-bUFXRj1PPIUTYn1dJHOU",
    aspectClass: "aspect-[3/4]",
  },
  {
    name: "Aisha Patel",
    credentials: "RDN, IFNCP",
    specialty: "Integrative Nutrition",
    quote: "Nourishment comes not just from food, but from a balanced life.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbeaLW6Ky2GvqdkkGmsDsQCJv2CerPe960Ez7eHg7J1JSndtbcAfwzJGx93sG_6xl0Zj16DHGP2PszGKgn5cve4VykoL3pB93P3C02ZBQXNg8B3DP8oQlPGNGldZ4fKTcQ_nCGvpdzH-V_Lj7NOFxpMhvoyTUNbuudxNGHo2yTIWfAFTKmE48gEzOzFH3_z-8yPN1oo6KGLFV2L6DxvSix1_Uag4jGQe1gZSmXozde9NOSQTfFSjGnztLrK3vWVG_EzeeMhIFnD_4",
    aspectClass: "aspect-square",
  },
];

export default function PractitionersPage() {
  // CSS for .duotone-hover, .quote-slide, .name-block, .masonry-grid
  // is in app/globals.css — do NOT use an inline <style> tag here.
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 relative inline-block">
            Guided by Experts
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-primary rounded-full opacity-80" />
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-6 text-lg font-light">
            Meet our team of dedicated healers, medical professionals, and wellness
            guides committed to your restorative journey.
          </p>
        </div>

        {/* Masonry */}
        <div className="masonry-grid">
          {practitioners.map((p) => (
            <div
              key={p.name}
              className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer bg-surface shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`relative ${p.aspectClass} w-full overflow-hidden`}>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="duotone-hover absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                  <div className="name-block">
                    <h3 className="text-white text-2xl font-bold mb-1">{p.name}</h3>
                    <p className="text-primary font-semibold text-sm mb-1">{p.credentials}</p>
                    <p className="text-slate-300 text-sm">{p.specialty}</p>
                  </div>
                  <div className="quote-slide mt-4">
                    <p className="text-white/90 italic text-sm border-l-2 border-primary pl-3">
                      "{p.quote}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check and commit**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
git add app/globals.css app/practitioners/
git commit -m "feat: add Practitioners page with masonry grid and duotone hover"
```

---

## Task 6: Patient Journey Page

**Files:**
- Create: `app/journey/page.tsx`
- Create: `app/journey/JourneyPath.tsx`
- Create: `app/journey/FaqAccordion.tsx`

- [ ] **Step 1: Create `app/journey/JourneyPath.tsx`** (scroll-linked SVG path animation)

```tsx
// app/journey/JourneyPath.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const milestones = [
  { icon: "chat", label: "Consultation", description: "A 20-minute call with a care coordinator to understand your health goals and match you with the right practitioner." },
  { icon: "analytics", label: "Assessment", description: "A comprehensive physical assessment at our clinic, including a wellness intake form and postural analysis." },
  { icon: "healing", label: "Treatment", description: "Your personalized treatment session. Arrive 10 minutes early to settle in and complete any remaining paperwork." },
  { icon: "self_improvement", label: "Integration", description: "A follow-up to review outcomes, discuss at-home practices, and schedule your next session if desired." },
];

export default function JourneyPath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative py-12 max-w-2xl mx-auto">
      {/* SVG path */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 4 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#17C3B2" />
              <stop offset="100%" stopColor="#11a0d4" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <path d="M2 0 L2 800" stroke="#e2e8f0" strokeWidth="4" />
          {/* Animated fill */}
          <motion.path
            d="M2 0 L2 800"
            stroke="url(#pathGrad)"
            strokeWidth="4"
            style={{ pathLength }}
          />
        </svg>
      </div>

      {/* Milestones */}
      <div className="flex flex-col gap-24">
        {milestones.map((m, i) => (
          <motion.div
            key={m.label}
            className={`relative flex items-start gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            {/* Node */}
            <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-[0_0_0_6px_rgba(17,160,212,0.15)]">
              <span className="material-symbols-outlined text-white text-xl">
                {m.icon}
              </span>
            </div>
            {/* Card */}
            <div className={`flex-1 bg-surface rounded-2xl p-6 shadow-[0_20px_40px_rgba(17,160,212,0.08)] border border-slate-100 ${i % 2 === 1 ? "text-right" : ""}`}>
              <h3 className="font-bold text-slate-900 text-xl mb-2">{m.label}</h3>
              <p className="text-slate-600 text-base font-light leading-relaxed">{m.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/journey/FaqAccordion.tsx`** (AnimatePresence accordion)

```tsx
// app/journey/FaqAccordion.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    q: "Do you accept insurance?",
    a: "We are an out-of-network provider. We provide superbills that you can submit to your insurance for potential reimbursement. We recommend contacting your insurer before your first visit to understand your out-of-network benefits.",
  },
  {
    q: "What should I wear to my appointment?",
    a: "For hydrotherapy sessions, we provide clinic-grade swimwear or you can bring your own. For massage and bodywork, you will be draped professionally. Comfortable, loose clothing is recommended for your arrival and departure.",
  },
  {
    q: "How long is a typical session?",
    a: "Sessions vary by treatment: hydrotherapy intake is 45 minutes, massage sessions are 60 or 90 minutes, and acupuncture is 60 minutes. Add 10–15 minutes for your first visit to complete intake paperwork.",
  },
  {
    q: "What should I expect during my first visit?",
    a: "You'll be greeted by a care coordinator, given a brief orientation to the facility, and escorted to your practitioner. The environment is designed to be calm and unhurried — there's no rush. Most new patients remark that their anxiety dissolves within the first few minutes.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-surface rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between p-6 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-semibold text-slate-900 text-lg">{faq.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="material-symbols-outlined text-primary flex-shrink-0 ml-4"
            >
              expand_more
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <p className="px-6 pb-6 text-slate-600 font-light leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/journey/page.tsx`**

```tsx
// app/journey/page.tsx
import JourneyPath from "./JourneyPath";
import FaqAccordion from "./FaqAccordion";

export const metadata = { title: "Your Patient Journey — Healing Waters Clinic" };

export default function JourneyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-primary font-bold tracking-widest uppercase text-sm">
          What to Expect
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-slate-900 mt-3 mb-4">
          Your Path to Wellness
        </h1>
        <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
          We believe transparency reduces anxiety. Here's exactly what your first
          visit looks like, step by step.
        </p>
      </div>

      {/* Scroll-animated journey path */}
      <JourneyPath />

      {/* FAQ */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Common Questions
        </h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Type-check and commit**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
git add app/journey/
git commit -m "feat: add Patient Journey page with scroll-linked SVG path and FAQ accordion"
```

---

## Task 7: Facilities Page

**Files:**
- Create: `app/facilities/page.tsx`
- Create: `app/facilities/FacilitiesGrid.tsx`

- [ ] **Step 1: Create `app/facilities/FacilitiesGrid.tsx`** (bento grid + lightbox)

```tsx
// app/facilities/FacilitiesGrid.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const rooms = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDW-gSUtYcQDBq4rSr1kjS_nwSMcAEG4q5RXgQeq8Va9qzzZgFYDMVBkn8jiChA5lBFULvWBFBCTkOlDpbiYqWEHqk5PzCiwae-UljzWgpHyU_nWTVeUWN3c3mK1FCGv2Diyg8GKKS1IAQ-4nLKbBkNvo4v57tuCYhtaOWiJMxvtIVhJ8Fe6ka2RHFBzj-J5m-H6bDHk8ARU7O_PXS5Tx2Nyq1MZPwr66skJm1m8lIE5BUUouVViIWpfnqsbFpxXgJqap6ce28f3E",
    label: "Hydrotherapy Pool",
    gridClass: "lg:col-span-2 lg:row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuASvxJaiuKICDKc7JoVJDrxMvkJCDVZEsAaLJ2UZ8O75_jGaqZTZK5LIXZlh-xDP7nfeuVUO7xPikTPtympMP3e9KbxV5jJZJz-ByYcJwf6GksOzzkA7j7Arrn1geW5yujQVZxCGIEfldJOQxbejiWtqaWqeZWsLvVWiiInGaKcqfhShYoiNFZ6JVFKFelc5FS5Sjuznr1QhZ8XfJu0_xfC7itwsMqDQuVhtn3f75FPMNj0tqJKihGzR3h9n5b1Y7EFtk1QcUYLWk",
    label: "Waiting Suite",
    gridClass: "",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqy9PTWW9FM9WoaT3r8QbfNgn9_FfrRMqSFzHShiw_odRgUHzclj8bq9raBv8PmzfWGWuBxuop5w2eCe09dakE36k--PAm9uKB1X2Sp1msqfjktirAGk2O3R3VjdXcpagNqH03vdS8_KOuHK7eX675MB1rgj03c7hjSA4TbHRZQfHjZsalamiYYJtDkJhT6O7Y45t3fMywtuCM1jeK_uYLHHzoQ8969PDHxbRcP4AQxeSYnVjrP-kKp4C5c9enz3g4tNs5vJIJ7oY",
    label: "Massage Room",
    gridClass: "lg:row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjl4JHmOqNuGJNobmqPXxLjf5VCQowAagW_vlVqJtyAdKze9aCFF2M4dpp1g9kpMLw93H4-ZAvPqK2-u-LEz_hR07fk5GxX7aSxpSdEdM-Y1PsKBEN79sS3T6ItkhfT5_FU3jeLfMDjKNVGQfvkTTNp9Qcpg7XAhbaDaFjljZ0PEWgne-xwnWfpPMXAU_vhySe3G-DsJEIK4r9Ys25YSyMPe5helKNy26aGlYBC0Ac9bpkbl8uT2FI1769SSgE2Nny62M0OznE9aI",
    label: "Acupuncture Room",
    gridClass: "",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPwbG4WXoYlFGCSeHjT_2dOBWCMjt9z_btWBxqyyKi1N9m_4wj3d480ajqfdWAe5uE-j4SROUXwCG8kJ-BImRjDYws9YARff7nw8_lk_44l8zhB0yx6Tyr_YINCpmvtifeLBJkUQ-_b6-QbNcKrXmlhfd5jPT1g5xRaLFiD9WXNjT-Nc9AtbravkEsbI1ieQMvgnHDAseyeANq7CCAbreC9mdLLsjX6eWmBCve7CfJBXY4lx-G6mDkFl9kgV8TvoJ401N8nD3FVaU",
    label: "Relaxation Lounge",
    gridClass: "md:col-span-2",
  },
];

export default function FacilitiesGrid() {
  const [selected, setSelected] = useState<(typeof rooms)[0] | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {rooms.map((room) => (
          <div
            key={room.label}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500 ${room.gridClass}`}
            onClick={() => setSelected(room)}
          >
            <Image
              src={room.src}
              alt={room.label}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <span className="text-white font-medium text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                {room.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.src}
                alt={selected.label}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-semibold text-xl">{selected.label}</p>
              </div>
              <button
                onClick={close}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Create `app/facilities/page.tsx`**

```tsx
// app/facilities/page.tsx
import FacilitiesGrid from "./FacilitiesGrid";

export const metadata = { title: "Our Facilities — Healing Waters Clinic" };

export default function FacilitiesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
      <div className="flex flex-col gap-4 max-w-3xl mb-12">
        <h1 className="font-serif text-5xl md:text-6xl font-normal text-slate-900 tracking-tight">
          Our Spaces
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
          Experience tranquility before your treatment begins. Explore our
          carefully curated healing environments designed to lower anxiety and
          promote flow.
        </p>
      </div>
      <FacilitiesGrid />
    </div>
  );
}
```

- [ ] **Step 3: Type-check and commit**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
git add app/facilities/
git commit -m "feat: add Facilities page with bento grid and lightbox"
```

---

## Task 8: Booking Page

**Files:**
- Create: `app/booking/page.tsx`
- Create: `app/booking/BookingForm.tsx`

- [ ] **Step 1: Create `app/booking/BookingForm.tsx`** (3-step form + confirmation)

```tsx
// app/booking/BookingForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

// ─── Data ───────────────────────────────────────────────────────────────────

const treatments = [
  { id: "hydro", name: "Hydrotherapy Intake", duration: "45 mins", price: "$120", icon: "water_drop" },
  { id: "massage", name: "Restorative Massage", duration: "60 mins", price: "$150", icon: "spa" },
  { id: "acu", name: "Acupuncture Session", duration: "30 mins", price: "$90", icon: "healing" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// Build a simple April 2026 calendar
const YEAR = 2026;
const MONTH = 3; // April (0-indexed)
const MONTH_NAME = "April 2026";
function buildCalendar() {
  const firstDay = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
const CALENDAR = buildCalendar();

// ─── Component ──────────────────────────────────────────────────────────────

type Fields = { firstName: string; lastName: string; email: string; phone: string; notes: string };
type Errors = Partial<Record<keyof Omit<Fields, "notes">, string>>;

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedTreatment, setSelectedTreatment] = useState(treatments[0].id);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const TOTAL = 3;

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };
  const goPrev = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const validate = (): boolean => {
    const errs: Errors = {};
    if (!fields.firstName.trim()) errs.firstName = "First name is required";
    if (!fields.lastName.trim()) errs.lastName = "Last name is required";
    if (!fields.email.trim()) errs.email = "Email is required";
    if (!fields.phone.trim()) errs.phone = "Phone is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setConfirmed(true);
  };

  const treatment = treatments.find((t) => t.id === selectedTreatment)!;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  if (confirmed) {
    return (
      <motion.div
        className="flex flex-col items-center gap-6 py-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
          <svg viewBox="0 0 52 52" className="w-12 h-12">
            <motion.path
              fill="none"
              stroke="#17C3B2"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27 l10 10 l14 -16"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">You're Booked!</h2>
          <p className="text-slate-500">A confirmation email is on its way.</p>
        </div>
        <div className="w-full bg-slate-50 rounded-xl p-5 text-left space-y-2 border border-slate-100">
          <p className="text-slate-700"><span className="font-semibold">Treatment:</span> {treatment.name}</p>
          <p className="text-slate-700"><span className="font-semibold">Date:</span> April {selectedDay}, 2026</p>
          <p className="text-slate-700"><span className="font-semibold">Time:</span> {selectedTime}</p>
          <p className="text-slate-700"><span className="font-semibold">Duration:</span> {treatment.duration}</p>
        </div>
        <button className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 text-slate-700 py-3 font-medium hover:border-primary hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">calendar_add_on</span>
          Add to Calendar
        </button>
        <Link href="/" className="text-sm text-primary hover:underline">Back to Home</Link>
      </motion.div>
    );
  }

  return (
    <>
      {/* Progress */}
      <div className="flex items-center px-6 py-4 border-b border-slate-100">
        <button
          onClick={goPrev}
          className={`p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 ${step === 1 ? "invisible" : ""}`}
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex-1 flex justify-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-primary/30"}`} />
          ))}
        </div>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="mx-6 mt-4 h-1.5 rounded-full bg-primary/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${(step / TOTAL) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Steps */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-6 sm:p-10 flex flex-col gap-8"
          >
            {step === 1 && (
              <>
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">
                    Step 1 of 3 — <span className="text-primary">Service</span>
                  </p>
                  <h1 className="text-3xl font-bold text-slate-900">Select your treatment</h1>
                  <p className="text-slate-500 mt-1">Choose a holistic therapy to begin your healing journey.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {treatments.map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-start gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all ${
                        selectedTreatment === t.id
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="treatment"
                        value={t.id}
                        checked={selectedTreatment === t.id}
                        onChange={() => setSelectedTreatment(t.id)}
                        className="mt-1 accent-[#11a0d4]"
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-slate-900 text-lg font-semibold">{t.name}</p>
                          <span className={`material-symbols-outlined ${selectedTreatment === t.id ? "text-primary" : "text-slate-300"}`}>
                            {t.icon}
                          </span>
                        </div>
                        <p className={`text-sm font-medium ${selectedTreatment === t.id ? "text-primary" : "text-slate-400"}`}>
                          {t.duration} · {t.price}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className="w-full bg-primary text-white text-lg font-semibold py-4 rounded-full shadow-[0_8px_20px_rgba(17,160,212,0.2)] hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                >
                  Continue to Time
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">
                    Step 2 of 3 — <span className="text-primary">Time</span>
                  </p>
                  <h1 className="text-3xl font-bold text-slate-900">Choose a date & time</h1>
                  <p className="text-slate-500 mt-1">Select an available slot for your {treatment.name}.</p>
                </div>
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-slate-900">{MONTH_NAME}</span>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {DAYS.map((d) => (
                      <div key={d} className="text-xs font-semibold text-slate-400 py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {CALENDAR.map((day, idx) => (
                      <button
                        key={idx}
                        disabled={!day || day < 5}
                        onClick={() => day && setSelectedDay(day)}
                        className={`h-9 w-full rounded-full text-sm transition-all ${
                          !day ? "invisible" : ""
                        } ${
                          day && day < 5
                            ? "text-slate-300 cursor-not-allowed"
                            : selectedDay === day
                            ? "bg-primary text-white font-semibold"
                            : "hover:bg-primary/10 text-slate-700"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Time slots */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedTime === t
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 text-slate-700 hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={goNext}
                  disabled={!selectedDay || !selectedTime}
                  className="w-full bg-primary text-white text-lg font-semibold py-4 rounded-full shadow-[0_8px_20px_rgba(17,160,212,0.2)] hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Details
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">
                    Step 3 of 3 — <span className="text-primary">Details</span>
                  </p>
                  <h1 className="text-3xl font-bold text-slate-900">Your details</h1>
                  <p className="text-slate-500 mt-1">Just a few more things before we confirm your booking.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(["firstName", "lastName"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {field === "firstName" ? "First name" : "Last name"} *
                      </label>
                      <input
                        type="text"
                        value={fields[field]}
                        onChange={(e) => { setFields((f) => ({ ...f, [field]: e.target.value })); setErrors((e2) => ({ ...e2, [field]: undefined })); }}
                        className={`w-full rounded-xl border-2 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-primary ${errors[field] ? "border-red-400" : "border-slate-200"}`}
                        placeholder={field === "firstName" ? "Jane" : "Doe"}
                      />
                      {errors[field] && <p className="text-sm mt-1" style={{ color: "#E07A5F" }}>{errors[field]}</p>}
                    </div>
                  ))}
                  {(["email", "phone"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {field === "email" ? "Email address" : "Phone number"} *
                      </label>
                      <input
                        type={field === "email" ? "email" : "tel"}
                        value={fields[field]}
                        onChange={(e) => { setFields((f) => ({ ...f, [field]: e.target.value })); setErrors((e2) => ({ ...e2, [field]: undefined })); }}
                        className={`w-full rounded-xl border-2 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-primary ${errors[field] ? "border-red-400" : "border-slate-200"}`}
                        placeholder={field === "email" ? "jane@example.com" : "+1 (555) 000-0000"}
                      />
                      {errors[field] && <p className="text-sm mt-1" style={{ color: "#E07A5F" }}>{errors[field]}</p>}
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (optional)</label>
                    <textarea
                      value={fields.notes}
                      onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors focus:border-primary resize-none"
                      placeholder="Any relevant health information, areas of focus, or questions..."
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-primary text-white text-lg font-semibold py-4 rounded-full shadow-[0_8px_20px_rgba(17,160,212,0.2)] hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-80"
                >
                  {loading ? (
                    <>
                      <motion.span
                        className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                      Confirming...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  )}
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `app/booking/page.tsx`**

```tsx
// app/booking/page.tsx
import BookingForm from "./BookingForm";

export const metadata = { title: "Book Your Visit — Healing Waters Clinic" };

export default function BookingPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      {/* Blurred background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 blur-md opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>

      {/* Card */}
      <div className="w-full max-w-[600px] bg-surface rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <BookingForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/booking/
git commit -m "feat: add Booking page with 3-step animated form and confirmation"
```

---

## Task 9: Final verification

- [ ] **Step 1: Run full TypeScript check**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Start the dev server and verify all 6 pages render**

```bash
cd /Users/tlh/projects/tests/websites/clinicblue && npm run dev
```

Visit: `http://localhost:3000`, `/services`, `/practitioners`, `/journey`, `/facilities`, `/booking`

Check for:
- [ ] Navbar is sticky and gets blur/bg on scroll
- [ ] Home hero blob animates on load
- [ ] Service cards lift on hover
- [ ] Services filter toggles between categories
- [ ] Practitioners masonry grid shows correctly; hover shows duotone + quote
- [ ] Journey SVG path fills on scroll; FAQ accordion expands/collapses
- [ ] Facilities bento grid; clicking image opens lightbox; Esc closes
- [ ] Booking form steps slide; validation shows errors; submit shows spinner then confirmation
- [ ] QuickBookFAB is visible on all pages and lifts on hover
- [ ] Footer appears on all pages

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Healing Waters Clinic website — all 6 pages with Motion animations"
```
