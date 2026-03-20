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
