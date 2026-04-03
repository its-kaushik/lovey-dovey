"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { randomIndex } from "@/lib/random";

interface PressIfYouMissMeProps {
  messages: string[];
}

export default function PressIfYouMissMe({ messages }: PressIfYouMissMeProps) {
  const reduced = useReducedMotion();
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [hearts, setHearts] = useState<{ id: number; angle: number }[]>([]);
  const lastIndexRef = useRef<number>(-1);
  const heartIdRef = useRef(0);

  const handlePress = useCallback(() => {
    const idx = randomIndex(messages.length, lastIndexRef.current);
    lastIndexRef.current = idx;
    setCurrentMessage(messages[idx]);
    setShowOverlay(true);

    // Heart burst
    if (!reduced) {
      const newHearts = Array.from({ length: 8 }, () => ({
        id: heartIdRef.current++,
        angle: Math.random() * 360,
      }));
      setHearts(newHearts);
      setTimeout(() => setHearts([]), 800);
    }
  }, [messages, reduced]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={reduced ? noMotion : fadeUp}
      className="relative py-20 text-center"
    >
      <div className="relative inline-block">
        <motion.button
          onClick={handlePress}
          animate={reduced ? undefined : { y: [-4, 4, -4] }}
          transition={
            reduced ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          className="min-h-[44px] rounded-full border border-rose-gold/40 bg-rose-gold/10 px-8 py-4 font-[family-name:var(--font-caveat)] text-xl text-rose-gold transition-all hover:bg-rose-gold/20"
        >
          Press if you miss me
        </motion.button>

        {/* Heart burst */}
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="pointer-events-none absolute left-1/2 top-1/2 text-lg animate-[heartBurst_0.8s_ease-out_forwards]"
            style={{
              ["--angle" as string]: `${heart.angle}deg`,
            }}
          >
            &#10084;
          </span>
        ))}
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6"
            onClick={() => setShowOverlay(false)}
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl text-cream leading-relaxed text-center"
            >
              {currentMessage}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
