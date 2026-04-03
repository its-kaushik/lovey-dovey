"use client";

import { motion } from "framer-motion";
import { fadeUp, noMotion, staggerContainer, staggerItem } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PromiseItem } from "@/data/promises";

interface WhatIPromiseProps {
  promises: PromiseItem[];
}

export default function WhatIPromise({ promises }: WhatIPromiseProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduced ? noMotion : fadeUp}
      className="mx-auto max-w-2xl px-6 py-20"
    >
      <h2 className="mb-8 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        What I Promise
      </h2>

      <p className="mb-6 text-center font-[family-name:var(--font-inter)] text-lg text-lavender">
        I promise to:
      </p>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduced ? noMotion : staggerContainer}
        className="space-y-4"
      >
        {promises.map((promise) => (
          <motion.li
            key={promise.id}
            variants={reduced ? noMotion : staggerItem}
            className="flex items-start gap-3 font-[family-name:var(--font-inter)] text-base md:text-lg text-cream/85 leading-relaxed"
          >
            <span className="mt-0.5 shrink-0 text-rose-gold">&#9825;</span>
            <span>{promise.text}</span>
          </motion.li>
        ))}
      </motion.ul>

      <p className="mt-10 text-center font-[family-name:var(--font-caveat)] text-lg text-lavender italic">
        That&apos;s not everything. But it&apos;s a start.
      </p>
    </motion.section>
  );
}
