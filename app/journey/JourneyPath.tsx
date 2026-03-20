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
            <div className={`flex-1 bg-surface rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-slate-100 ${i % 2 === 1 ? "text-right" : ""}`}>
              <h3 className="font-bold text-slate-900 text-xl mb-2">{m.label}</h3>
              <p className="text-slate-600 text-base font-light leading-relaxed">{m.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
