import Link from "next/link";

const footerLinks = {
  treatments: [
    { href: "/services", label: "Hydrotherapy" },
    { href: "/services", label: "Massage Therapy" },
    { href: "/services", label: "Acupuncture" },
  ],
  clinic: [
    { href: "/practitioners", label: "Our Team" },
    { href: "/facilities", label: "Facilities" },
    { href: "/journey", label: "Patient Journey" },
  ],
  connect: [
    { href: "/booking", label: "Book a Visit" },
    { href: "/services", label: "Pricing" },
    { href: "/journey", label: "FAQ" },
  ],
};

const socialLinks = [
  { label: "Instagram", icon: "photo_camera", href: "#" },
  { label: "Facebook", icon: "share", href: "#" },
  { label: "LinkedIn", icon: "work", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 48 48">
                  <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" />
                </svg>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Healing Waters Clinic
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              A sanctuary for holistic wellness, offering evidence-based therapies 
              designed to restore your body&apos;s natural balance and promote lasting healing.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Treatments</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.treatments.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-white hover:translate-x-1 transition-all text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Clinic</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.clinic.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-white hover:translate-x-1 transition-all text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Connect</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.connect.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-white hover:translate-x-1 transition-all text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-slate-500">
            © 2026 Healing Waters Clinic. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
