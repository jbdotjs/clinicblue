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
