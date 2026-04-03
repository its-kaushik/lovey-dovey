"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRelationshipTimer } from "@/hooks/useRelationshipTimer";

export default function RelationshipTimer() {
  const { days, hours, minutes, seconds } = useRelationshipTimer();
  const reduced = useReducedMotion();

  const units = [
    { value: days, label: "days" },
    { value: hours, label: "hours" },
    { value: minutes, label: "mins" },
    { value: seconds, label: "secs" },
  ];

  return (
    <div className="text-center">
      <p className="mb-4 font-[family-name:var(--font-caveat)] text-xl text-cream">
        Together for
      </p>

      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 md:grid-cols-4">
        {units.map((unit) => (
          <div key={unit.label} className="rounded-xl bg-midnight-deep p-4">
            <div className="relative h-12 md:h-14 lg:h-16 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={unit.value}
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                  className="font-[family-name:var(--font-playfair-display)] text-3xl md:text-4xl lg:text-5xl text-warm-gold"
                >
                  {unit.value}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-lavender">
              {unit.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 font-[family-name:var(--font-caveat)] text-lg text-lavender">
        ...and counting forever
      </p>
    </div>
  );
}
