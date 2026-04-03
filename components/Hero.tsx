"use client";

import { motion } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Hero() {
  const reduced = useReducedMotion();

  const scrollToTimeline = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={reduced ? noMotion : fadeUp}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.h1
        initial={reduced ? undefined : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-[family-name:var(--font-playfair-display)] text-3xl md:text-5xl lg:text-6xl text-cream leading-tight"
      >
        For My Devi
      </motion.h1>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-4 font-[family-name:var(--font-caveat)] text-xl md:text-2xl lg:text-3xl text-lavender"
      >
        The most chaotic, beautiful thing that ever happened to me
      </motion.p>

      <motion.button
        onClick={scrollToTimeline}
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: [1, 1.05, 1] }
        }
        transition={
          reduced
            ? { duration: 0.1 }
            : {
                opacity: { duration: 0.8, delay: 0.8 },
                y: { duration: 0.8, delay: 0.8 },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
              }
        }
        className="mt-10 rounded-full border border-rose-gold px-8 py-3 font-[family-name:var(--font-playfair-display)] text-rose-gold animate-pulse-glow transition-shadow hover:shadow-[0_0_30px_rgba(232,160,191,0.5)]"
      >
        Read Our Story
      </motion.button>
    </motion.section>
  );
}
