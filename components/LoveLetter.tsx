"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function LoveLetter() {
  const reduced = useReducedMotion();
  const variants = reduced ? noMotion : fadeUp;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      className="mx-auto max-w-3xl px-6 py-20"
    >
      <h2 className="mb-12 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        The Love Letter
      </h2>

      {/* Her letter — scanned image */}
      <div className="mx-auto max-w-md -rotate-1 rounded-sm border-4 border-white/90 bg-white/10 p-2 shadow-xl shadow-black/30">
        <Image
          src="/images/love-letter.jpeg"
          alt="Her handwritten love letter"
          width={500}
          height={700}
          className="w-full rounded-sm"
          sizes="(max-width: 768px) 90vw, 500px"
        />
      </div>

      {/* Transcript */}
      <blockquote className="mx-auto mt-10 max-w-lg text-center">
        <p className="font-[family-name:var(--font-caveat)] text-xl md:text-2xl text-cream/90 leading-relaxed">
          &ldquo;Because he showed me how it felt to be treated right, in a
          week; The way others couldn&apos;t do in years.&rdquo;
        </p>
      </blockquote>

      {/* Kushik's counter letter */}
      <div className="mx-auto mt-12 max-w-lg">
        <p className="mb-2 font-[family-name:var(--font-caveat)] text-lg text-warm-gold">
          My reply:
        </p>
        <p className="font-[family-name:var(--font-inter)] text-base text-cream/80 leading-relaxed">
          You wrote that you fell fast. But here&apos;s the thing — I did too. I
          just didn&apos;t have the words for it yet. You gave me a letter, and
          I&apos;m giving you this entire website. I think we&apos;re both a
          little dramatic. And I wouldn&apos;t change a single thing about it.
        </p>
      </div>
    </motion.section>
  );
}
