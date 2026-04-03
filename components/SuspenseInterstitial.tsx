"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuspenseInterstitialProps {
  onComplete: () => void;
}

export default function SuspenseInterstitial({
  onComplete,
}: SuspenseInterstitialProps) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={(definition) => {
            // Only fire on exit animation
            if (
              typeof definition === "object" &&
              "opacity" in definition &&
              definition.opacity === 0
            ) {
              onComplete();
            }
          }}
        >
          {/* Line 1 — fades in at 0.5s */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl text-cream"
          >
            Before the world changed...
          </motion.p>

          {/* Line 2 — fades in at 2.0s */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="mt-4 font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl text-cream"
            onAnimationComplete={() => {
              // After line 2 finishes fading in, wait 1s then trigger exit
              setTimeout(() => setVisible(false), 1000);
            }}
          >
            I met someone.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
