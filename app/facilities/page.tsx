import FacilitiesGrid from "./FacilitiesGrid";

export const metadata = { title: "Our Facilities — Healing Waters Clinic" };

export default function FacilitiesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
      <div className="flex flex-col gap-4 max-w-3xl mb-12">
        <h1 className="font-serif text-5xl md:text-6xl font-normal text-slate-900 tracking-tight">
          Our Spaces
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
          Experience tranquility before your treatment begins. Explore our
          carefully curated healing environments designed to lower anxiety and
          promote flow.
        </p>
      </div>
      <FacilitiesGrid />
    </div>
  );
}
