"use client";

import { motion } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import RelationshipTimer from "./RelationshipTimer";

export default function Footer() {
  const reduced = useReducedMotion();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduced ? noMotion : fadeUp}
      className="px-6 py-20"
    >
      <p className="mb-12 text-center font-[family-name:var(--font-playfair-display)] text-xl md:text-2xl text-cream">
        This is just the beginning, Devi.
      </p>

      <RelationshipTimer />

      <p className="mt-16 text-center font-[family-name:var(--font-inter)] text-sm text-lavender/40">
        Made with love by your shy calm guy
      </p>
    </motion.footer>
  );
}
