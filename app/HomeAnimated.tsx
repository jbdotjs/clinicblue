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
              <h1 className="font-serif text-primary text-5xl md:text-[64px] leading-[1.1] tracking-tight">
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
