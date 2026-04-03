"use client";

import { useRelationshipTimer } from "@/hooks/useRelationshipTimer";

export default function RelationshipTimer() {
  const { days, hours, minutes, seconds } = useRelationshipTimer();

  const units = [
    { value: days, label: "days" },
    { value: hours, label: "hours" },
    { value: minutes, label: "mins" },
    { value: seconds, label: "secs" },
  ];

  return (
    <div className="text-center">
      <p className="mb-4 font-[family-name:var(--font-caveat)] text-xl text-cream">
        Together for
      </p>

      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 md:grid-cols-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl bg-midnight-deep p-4"
          >
            <p className="font-[family-name:var(--font-playfair-display)] text-3xl md:text-4xl lg:text-5xl text-warm-gold">
              {unit.value}
            </p>
            <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-lavender">
              {unit.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 font-[family-name:var(--font-caveat)] text-lg text-lavender">
        ...and counting forever
      </p>
    </div>
  );
}
