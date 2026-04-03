"use client";

import type { Milestone } from "@/data/milestones";
import TimelineCard from "./TimelineCard";

interface TimelineProps {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  return (
    <section id="timeline" className="relative mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-16 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        Our Story
      </h2>

      {/* Vertical center line */}
      <div className="absolute left-5 lg:left-1/2 top-28 bottom-8 w-px -translate-x-1/2 bg-rose-gold/20" />

      <div className="flex flex-col gap-16">
        {milestones.map((milestone, index) => (
          <TimelineCard
            key={milestone.id}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
