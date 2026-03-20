import BookingForm from "./BookingForm";

export const metadata = { title: "Book Your Visit — Healing Waters Clinic" };

export default function BookingPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      {/* Blurred background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 blur-md opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>

      {/* Card */}
      <div className="w-full max-w-[600px] bg-surface rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <BookingForm />
      </div>
    </div>
  );
}
