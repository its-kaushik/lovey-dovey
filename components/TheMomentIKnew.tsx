"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const paragraphText = `I don't know the exact second it happened. Maybe it was that night at CyberHub, when the city was blurring behind you and you were the only thing in focus. Maybe it was when you cooked for me and I realised no one had ever done something that simple and that meaningful. Or maybe it was the day you handed me that letter and I read what you wrote about me — and for the first time, I saw myself the way someone who loves me sees me. I don't know when it happened. I just know that by the time I noticed, it was already too late to go back. And I didn't want to.`;

const words = paragraphText.split(" ");

export default function TheMomentIKnew() {
  const reduced = useReducedMotion();
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Word-by-word reveal
  useEffect(() => {
    if (!isInView) return;
    if (reduced) {
      setVisibleWordCount(words.length);
      return;
    }
    const interval = setInterval(() => {
      setVisibleWordCount((prev) => {
        if (prev >= words.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isInView, reduced]);

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduced ? noMotion : fadeUp}
      className="flex min-h-screen items-center justify-center bg-spotlight px-6 py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-10 font-[family-name:var(--font-caveat)] text-2xl md:text-3xl text-warm-gold">
          The Moment I Knew
        </h2>

        <p className="font-[family-name:var(--font-playfair-display)] text-lg md:text-xl lg:text-2xl leading-relaxed">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block transition-opacity duration-500"
              style={{ opacity: i < visibleWordCount ? 1 : 0 }}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </motion.section>
  );
}
