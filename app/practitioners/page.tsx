import Image from "next/image";

export const metadata = { title: "Our Practitioners — Healing Waters Clinic" };

const practitioners = [
  {
    name: "Dr. Elena Rostova",
    credentials: "ND, LAc",
    specialty: "Holistic Hydrotherapy & Acupuncture",
    quote: "Healing begins when the body feels safe enough to rest.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9jm318yS6CjWPMka7G9scIEtRUkOpxhNKyShLO5m6dAoWV3n8ugbiCuCo2KH-_UynlDF1Ut1R97xRJA_azTbjts0ibEecCfRmHI1Rh0YcUwEz0tRtpswEeno9387rCJKjVM1b7HFe9k6sAjcjSf8zPJ-9WCYhHKGvy9De-0JagiX_SiNSXpr_jwUGELhpavh7iSRJ8EMAikwyzqstBAvfQK-POMZQeY9MX_Y0iJLfur4qusJFFRMCBWUuNZl-f3gLY1biUAJLy2U",
    aspectClass: "aspect-[3/4]",
  },
  {
    name: "Dr. Marcus Thorne",
    credentials: "DC, MS",
    specialty: "Restorative Chiropractic",
    quote: "Alignment is the foundation of energy flow.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG5EUg7Zh9Q5_U85G25lnyLpYF8NU0yYBiGbopOQjJrJeV_fKE3dgrZstL_OUo81xmcnmBxknv4mOXAWLln4mGtJLaxSCksUhimhnMIfefyM032BhuLeoJqMpK1Yol9JCpWd32iUDZ_zXh1jJBMFjhPwVtj8wji5PYXfq4FHj1WaS36t9Md-RO8rQlFE_ijN8NaAOCHxGWagcjqdL-SH7-Gh3zDWLsatdzcOS27P-fHsDyMx-C5705tJRFMUAB6_ape3xgNqYkuNU",
    aspectClass: "aspect-square",
  },
  {
    name: "Sarah Jenkins",
    credentials: "LMT, CST",
    specialty: "Craniosacral & Deep Tissue",
    quote: "The tissues hold the issues; we gently ask them to let go.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBf1JhN7bcjNuuQYT7ClQnhkZjSUqi4i3AD-APWMh5JK7XrxnlKiVclZXPVrJuy88HuMQaW1yZghE-Lm26EujitBupBHfbkY9PwbWMtcCSBmoyAksHAnoQO1fy4eGUYQG8Q8KxVIh5H5sgFz0O2V_60Q5WnBSzjdxiqONC1v4Fsnl6BTnxe7JnZQXng6eaEfjqRrRGS1h9NTjjMPq2uoE3RM75VHVg6ekOMc48cxPYNNTF8GK5HSmV_y_EyEYNRgWpvufDs8emtiM",
    aspectClass: "aspect-[4/5]",
  },
  {
    name: "David Chen",
    credentials: "PT, DPT",
    specialty: "Movement Re-education",
    quote: "Movement is medicine when guided by intention.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXFUTLuwA9F9dKzr0tYHSAy2zNnKkSCQcQGSWsVy6LDDA33ubLskPS1r5pUwqj9LgKSnVCrT_NWsIygwvg-XTywjdO5SHRm2miF4iP1tnXjaLmOlXVY5PSdM624Fxa-lqtvBFAWCB4SlRzDNC0yCeWzIbZxG_rb6FhVfA2HpJjMdTMbFiAZQjutbR9R86IE6cvwfhzNJkI_LqG_KcsOS57Lrb1ROLnivohexDmeitJfPhmi3iSQYYnAl-bUFXRj1PPIUTYn1dJHOU",
    aspectClass: "aspect-[3/4]",
  },
  {
    name: "Aisha Patel",
    credentials: "RDN, IFNCP",
    specialty: "Integrative Nutrition",
    quote: "Nourishment comes not just from food, but from a balanced life.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbeaLW6Ky2GvqdkkGmsDsQCJv2CerPe960Ez7eHg7J1JSndtbcAfwzJGx93sG_6xl0Zj16DHGP2PszGKgn5cve4VykoL3pB93P3C02ZBQXNg8B3DP8oQlPGNGldZ4fKTcQ_nCGvpdzH-V_Lj7NOFxpMhvoyTUNbuudxNGHo2yTIWfAFTKmE48gEzOzFH3_z-8yPN1oo6KGLFV2L6DxvSix1_Uag4jGQe1gZSmXozde9NOSQTfFSjGnztLrK3vWVG_EzeeMhIFnD_4",
    aspectClass: "aspect-square",
  },
];

export default function PractitionersPage() {
  // CSS for .duotone-hover, .quote-slide, .name-block, .masonry-grid
  // is in app/globals.css — do NOT use an inline <style> tag here.
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 relative inline-block">
          Guided by Experts
          <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-primary rounded-full opacity-80" />
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-6 text-lg font-light">
          Meet our team of dedicated healers, medical professionals, and wellness
          guides committed to your restorative journey.
        </p>
      </div>

      {/* Masonry */}
      <div className="masonry-grid">
        {practitioners.map((p) => (
          <div
            key={p.name}
            className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer bg-surface shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`relative ${p.aspectClass} w-full overflow-hidden`}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="duotone-hover absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-20" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                <div className="name-block">
                  <h3 className="text-white text-2xl font-bold mb-1">{p.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-1">{p.credentials}</p>
                  <p className="text-slate-300 text-sm">{p.specialty}</p>
                </div>
                <div className="quote-slide mt-4">
                  <p className="text-white/90 italic text-sm border-l-2 border-primary pl-3">
                    &ldquo;{p.quote}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
