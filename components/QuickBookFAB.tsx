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
