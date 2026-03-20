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
