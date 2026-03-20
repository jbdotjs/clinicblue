import CategoryFilter from "./CategoryFilter";

export const metadata = {
  title: "Our Healing Therapies — Healing Waters Clinic",
};

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
      <section className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Our Healing Therapies
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            Explore our holistic treatments designed for your physical recovery,
            stress relief, and overall well-being. Find the perfect flow for your
            body.
          </p>
        </div>
      </section>
      <CategoryFilter />
    </div>
  );
}
