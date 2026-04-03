"use client";

import { useState, useRef } from "react";
import { randomIndex } from "@/lib/random";

interface PressIfYouMissMeProps {
  messages: string[];
}

export default function PressIfYouMissMe({ messages }: PressIfYouMissMeProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const lastIndexRef = useRef<number>(-1);

  const handlePress = () => {
    const idx = randomIndex(messages.length, lastIndexRef.current);
    lastIndexRef.current = idx;
    setCurrentMessage(messages[idx]);
    setShowOverlay(true);
  };

  return (
    <section className="py-20 text-center">
      <button
        onClick={handlePress}
        className="rounded-full border border-rose-gold/40 bg-rose-gold/10 px-8 py-4 font-[family-name:var(--font-caveat)] text-xl text-rose-gold transition-all hover:bg-rose-gold/20"
      >
        Press if you miss me
      </button>

      {/* Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6"
          onClick={() => setShowOverlay(false)}
        >
          <p className="max-w-md font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl text-cream leading-relaxed text-center">
            {currentMessage}
          </p>
        </div>
      )}
    </section>
  );
}
