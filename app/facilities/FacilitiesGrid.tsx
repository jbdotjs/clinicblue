"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const rooms = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDW-gSUtYcQDBq4rSr1kjS_nwSMcAEG4q5RXgQeq8Va9qzzZgFYDMVBkn8jiChA5lBFULvWBFBCTkOlDpbiYqWEHqk5PzCiwae-UljzWgpHyU_nWTVeUWN3c3mK1FCGv2Diyg8GKKS1IAQ-4nLKbBkNvo4v57tuCYhtaOWiJMxvtIVhJ8Fe6ka2RHFBzj-J5m-H6bDHk8ARU7O_PXS5Tx2Nyq1MZPwr66skJm1m8lIE5BUUouVViIWpfnqsbFpxXgJqap6ce28f3E",
    label: "Hydrotherapy Pool",
    gridClass: "lg:col-span-2 lg:row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuASvxJaiuKICDKc7JoVJDrxMvkJCDVZEsAaLJ2UZ8O75_jGaqZTZK5LIXZlh-xDP7nfeuVUO7xPikTPtympMP3e9KbxV5jJZJz-ByYcJwf6GksOzzkA7j7Arrn1geW5yujQVZxCGIEfldJOQxbejiWtqaWqeZWsLvVWiiInGaKcqfhShYoiNFZ6JVFKFelc5FS5Sjuznr1QhZ8XfJu0_xfC7itwsMqDQuVhtn3f75FPMNj0tqJKihGzR3h9n5b1Y7EFtk1QcUYLWk",
    label: "Waiting Suite",
    gridClass: "",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqy9PTWW9FM9WoaT3r8QbfNgn9_FfrRMqSFzHShiw_odRgUHzclj8bq9raBv8PmzfWGWuBxuop5w2eCe09dakE36k--PAm9uKB1X2Sp1msqfjktirAGk2O3R3VjdXcpagNqH03vdS8_KOuHK7eX675MB1rgj03c7hjSA4TbHRZQfHjZsalamiYYJtDkJhT6O7Y45t3fMywtuCM1jeK_uYLHHzoQ8969PDHxbRcP4AQxeSYnVjrP-kKp4C5c9enz3g4tNs5vJIJ7oY",
    label: "Massage Room",
    gridClass: "lg:row-span-2",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjl4JHmOqNuGJNobmqPXxLjf5VCQowAagW_vlVqJtyAdKze9aCFF2M4dpp1g9kpMLw93H4-ZAvPqK2-u-LEz_hR07fk5GxX7aSxpSdEdM-Y1PsKBEN79sS3T6ItkhfT5_FU3jeLfMDjKNVGQfvkTTNp9Qcpg7XAhbaDaFjljZ0PEWgne-xwnWfpPMXAU_vhySe3G-DsJEIK4r9Ys25YSyMPe5helKNy26aGlYBC0Ac9bpkbl8uT2FI1769SSgE2Nny62M0OznE9aI",
    label: "Acupuncture Room",
    gridClass: "",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPwbG4WXoYlFGCSeHjT_2dOBWCMjt9z_btWBxqyyKi1N9m_4wj3d480ajqfdWAe5uE-j4SROUXwCG8kJ-BImRjDYws9YARff7nw8_lk_44l8zhB0yx6Tyr_YINCpmvtifeLBJkUQ-_b6-QbNcKrXmlhfd5jPT1g5xRaLFiD9WXNjT-Nc9AtbravkEsbI1ieQMvgnHDAseyeANq7CCAbreC9mdLLsjX6eWmBCve7CfJBXY4lx-G6mDkFl9kgV8TvoJ401N8nD3FVaU",
    label: "Relaxation Lounge",
    gridClass: "md:col-span-2",
  },
];

type Room = (typeof rooms)[0];

export default function FacilitiesGrid() {
  const [selected, setSelected] = useState<Room | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close]);

  useEffect(() => {
    if (selected) {
      closeButtonRef.current?.focus();
    }
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {rooms.map((room) => (
          <div
            key={room.label}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500 ${room.gridClass}`}
            onClick={() => setSelected(room)}
          >
            <Image
              src={room.src}
              alt={room.label}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <span className="text-white font-medium text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                {room.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={selected?.label ?? "Facility photo"}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.src}
                alt={selected.label}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-semibold text-xl">{selected.label}</p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={close}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
