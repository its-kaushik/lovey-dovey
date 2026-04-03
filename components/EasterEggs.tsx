"use client";

import { useState, useEffect, useCallback } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function EasterEggs() {
  const [konamiTriggered, setKonamiTriggered] = useState(false);
  const [hiddenHeartFound, setHiddenHeartFound] = useState(false);
  const [gayJokeTriggered, setGayJokeTriggered] = useState(false);

  // --- Konami Code ---
  useEffect(() => {
    let sequence: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      sequence = [...sequence, e.key].slice(-KONAMI.length);
      if (sequence.join(",") === KONAMI.join(",")) {
        setKonamiTriggered(true);
        sequence = [];
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const dismissKonami = useCallback(() => setKonamiTriggered(false), []);
  const dismissGayJoke = useCallback(() => setGayJokeTriggered(false), []);

  return (
    <>
      {/* Hidden Heart — positioned near the Reasons section area */}
      {!hiddenHeartFound && (
        <button
          onClick={() => setHiddenHeartFound(true)}
          className="absolute z-10 text-rose-gold/[0.07] hover:text-rose-gold/30 transition-colors duration-700 text-lg"
          style={{ top: "calc(50vh + 300px)", right: "8%" }}
          aria-label="Hidden heart"
        >
          &#10084;
        </button>
      )}

      {/* Hidden Heart — found message */}
      {hiddenHeartFound && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          onClick={() => setHiddenHeartFound(false)}
        >
          <div className="max-w-sm rounded-2xl border border-rose-gold/30 bg-midnight-deep p-8 text-center">
            <p className="text-4xl mb-4">&#10084;&#65039;</p>
            <p className="font-[family-name:var(--font-playfair-display)] text-xl text-cream">
              You found the hidden heart
            </p>
            <p className="mt-2 font-[family-name:var(--font-caveat)] text-lg text-lavender">
              — just like I found you.
            </p>
          </div>
        </div>
      )}

      {/* Gay Joke trigger — tiny invisible text in the page */}
      {!gayJokeTriggered && (
        <button
          onClick={() => setGayJokeTriggered(true)}
          className="absolute z-10 text-[8px] text-midnight/[0.15] hover:text-lavender/30 transition-colors"
          style={{ top: "calc(50vh + 600px)", left: "5%" }}
          aria-label="Secret"
        >
          ?
        </button>
      )}

      {/* Gay Joke overlay */}
      {gayJokeTriggered && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          onClick={dismissGayJoke}
        >
          <div className="max-w-md rounded-2xl border border-rose-gold/30 bg-midnight-deep p-8 text-center">
            <p className="font-[family-name:var(--font-playfair-display)] text-xl text-cream leading-relaxed">
              You call me gay, but the only thing I&apos;m hopelessly attracted
              to... is you.
            </p>
          </div>
        </div>
      )}

      {/* Konami Code overlay — heart rain */}
      {konamiTriggered && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={dismissKonami}
        >
          {/* Raining hearts */}
          {Array.from({ length: 25 }).map((_, i) => (
            <span
              key={i}
              className="pointer-events-none fixed text-xl animate-[heartRain_3s_ease-in_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                top: "-20px",
              }}
            >
              &#10084;&#65039;
            </span>
          ))}
          <div className="relative z-10 text-center">
            <p className="text-5xl mb-4">&#129303;</p>
            <p className="font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl text-cream">
              Secret level unlocked: hug mode
            </p>
            <p className="mt-3 font-[family-name:var(--font-caveat)] text-lg text-lavender/60">
              Click anywhere to dismiss
            </p>
          </div>
        </div>
      )}
    </>
  );
}
