"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const treatments = [
  { id: "hydro", name: "Hydrotherapy Intake", duration: "45 mins", price: "$120", icon: "water_drop" },
  { id: "massage", name: "Restorative Massage", duration: "60 mins", price: "$150", icon: "spa" },
  { id: "acu", name: "Acupuncture Session", duration: "30 mins", price: "$90", icon: "healing" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// DEMO: calendar locked to April 2026 — replace with dynamic month state for production
const YEAR = 2026;
const MONTH = 3;
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

  const goNext = () => { setDirection(1); setStep((s) => s + 1); };
  const goPrev = () => { setDirection(-1); setStep((s) => s - 1); };

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
        className="flex flex-col items-center gap-6 py-10 text-center p-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
          <svg viewBox="0 0 52 52" className="w-12 h-12">
            <motion.path
              fill="none"
              stroke="var(--color-accent)"
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
          <h2 className="text-2xl font-bold text-slate-900 mb-1">You&apos;re Booked!</h2>
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
      {/* Progress dots */}
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
                        className="mt-1 accent-primary"
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
                      <button disabled aria-label="Previous month (demo only)" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button disabled aria-label="Next month (demo only)" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
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
