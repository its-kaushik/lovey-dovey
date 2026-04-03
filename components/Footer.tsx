"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import RelationshipTimer from "./RelationshipTimer";

export default function Footer() {
  const reduced = useReducedMotion();
  const [showRehpatt, setShowRehpatt] = useState(false);

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

      <div className="relative mt-16 text-center">
        <p className="font-[family-name:var(--font-inter)] text-sm text-lavender/40">
          Made with love by your shy calm guy{" "}
          {/* Rehpatt easter egg — tiny heart, barely visible */}
          <button
            onClick={() => setShowRehpatt(true)}
            className="inline text-lavender/[0.15] hover:text-lavender/40 transition-colors duration-500"
            aria-label="Secret"
          >
            &#10084;
          </button>
        </p>

        {/* Rehpatt tooltip */}
        {showRehpatt && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
            onClick={() => setShowRehpatt(false)}
          >
            <div className="rounded-2xl border border-rose-gold/30 bg-midnight-deep p-8 text-center">
              <p className="font-[family-name:var(--font-caveat)] text-3xl text-rose-gold">
                Rehpatt &#128536;
              </p>
              <p className="mt-2 font-[family-name:var(--font-inter)] text-sm text-lavender/60">
                You found it. Now come give me one.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.footer>
  );
}
