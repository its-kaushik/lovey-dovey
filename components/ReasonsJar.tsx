"use client";

import { useState } from "react";
import type { Reason } from "@/data/reasons";
import { randomIndex } from "@/lib/random";

interface ReasonsJarProps {
  reasons: Reason[];
}

export default function ReasonsJar({ reasons }: ReasonsJarProps) {
  const [drawnIds, setDrawnIds] = useState<Set<number>>(new Set());
  const [currentReason, setCurrentReason] = useState<Reason | null>(null);
  const [allDrawn, setAllDrawn] = useState(false);

  const drawReason = () => {
    const remaining = reasons.filter((r) => !drawnIds.has(r.id));
    if (remaining.length === 0) {
      setAllDrawn(true);
      return;
    }
    const idx = randomIndex(remaining.length);
    const selected = remaining[idx];
    setCurrentReason(selected);
    setDrawnIds((prev) => new Set(prev).add(selected.id));
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h2 className="mb-12 font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        Reasons I Love You
      </h2>

      {/* Jar */}
      <div className="mx-auto mb-6 flex h-40 w-32 flex-col items-center justify-center rounded-2xl rounded-t-lg border-2 border-rose-gold/30 bg-midnight-deep/60">
        <span className="text-3xl">
          {allDrawn ? "✨" : "💌"}
        </span>
        <p className="mt-2 text-xs text-lavender/60">
          {drawnIds.size}/{reasons.length}
        </p>
      </div>

      {/* Draw button */}
      <button
        onClick={drawReason}
        disabled={allDrawn}
        className="rounded-full border border-rose-gold/40 bg-rose-gold/10 px-6 py-3 font-[family-name:var(--font-caveat)] text-lg text-rose-gold transition-all hover:bg-rose-gold/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {allDrawn ? "All drawn!" : "Draw a Reason"}
      </button>

      {/* Drawn reason card */}
      {currentReason && (
        <div className="mx-auto mt-8 max-w-md rounded-xl border border-warm-gold/20 bg-midnight-deep/80 p-6 shadow-lg">
          <p className="font-[family-name:var(--font-caveat)] text-xl text-cream leading-relaxed">
            &ldquo;{currentReason.text}&rdquo;
          </p>
        </div>
      )}

      {/* All drawn message */}
      {allDrawn && (
        <p className="mt-6 font-[family-name:var(--font-caveat)] text-lg text-lavender">
          That&apos;s not even all of them. I&apos;ll keep adding.
        </p>
      )}
    </section>
  );
}
