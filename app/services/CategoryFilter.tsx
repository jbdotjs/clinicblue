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
            aria-pressed={active === cat}
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
