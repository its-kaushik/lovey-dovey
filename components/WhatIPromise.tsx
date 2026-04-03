"use client";

import type { PromiseItem } from "@/data/promises";

interface WhatIPromiseProps {
  promises: PromiseItem[];
}

export default function WhatIPromise({ promises }: WhatIPromiseProps) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h2 className="mb-8 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        What I Promise
      </h2>

      <p className="mb-6 text-center font-[family-name:var(--font-inter)] text-lg text-lavender">
        I promise to:
      </p>

      <ul className="space-y-4">
        {promises.map((promise) => (
          <li
            key={promise.id}
            className="flex items-start gap-3 font-[family-name:var(--font-inter)] text-base md:text-lg text-cream/85 leading-relaxed"
          >
            <span className="mt-0.5 shrink-0 text-rose-gold">&#9825;</span>
            <span>{promise.text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center font-[family-name:var(--font-caveat)] text-lg text-lavender italic">
        That&apos;s not everything. But it&apos;s a start.
      </p>
    </section>
  );
}
