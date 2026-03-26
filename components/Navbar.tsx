"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
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
          <Link href="/" className="flex items-center gap-3 text-primary">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" />
            </svg>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Healing Waters Clinic
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className="hidden md:flex items-center justify-center rounded-full h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_8px_16px_rgba(17,160,212,0.15)]"
            >
              Book Visit
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-slate-900 hover:text-primary transition-colors p-1"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
                    aria-label="Close menu"
                  >
                    <span className="material-symbols-outlined text-2xl">close</span>
                  </button>
                </div>
                <nav className="flex-1 p-5 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-5 border-t border-slate-100">
                  <Link
                    href="/booking"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full h-12 px-6 bg-primary text-white text-sm font-bold w-full shadow-[0_8px_16px_rgba(17,160,212,0.2)]"
                  >
                    Book Visit
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
