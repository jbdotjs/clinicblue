import JourneyPath from "./JourneyPath";
import FaqAccordion from "./FaqAccordion";

export const metadata = { title: "Your Patient Journey — Healing Waters Clinic" };

export default function JourneyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-primary font-bold tracking-widest uppercase text-sm">
          What to Expect
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-slate-900 mt-3 mb-4">
          Your Path to Wellness
        </h1>
        <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
          We believe transparency reduces anxiety. Here&apos;s exactly what your first
          visit looks like, step by step.
        </p>
      </div>

      {/* Scroll-animated journey path */}
      <JourneyPath />

      {/* FAQ */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Common Questions
        </h2>
        <FaqAccordion />
      </div>
    </div>
  );
}
