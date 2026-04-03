"use client";

import type { Milestone } from "@/data/milestones";

interface TimelineCardProps {
  milestone: Milestone;
  index: number;
}

export default function TimelineCard({ milestone, index }: TimelineCardProps) {
  const isRight = index % 2 === 1;

  return (
    <div
      className={`relative flex items-start gap-6 lg:gap-10 ${
        isRight ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Timeline dot + icon */}
      <div className="absolute left-0 lg:left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-gold/40 bg-midnight-deep text-lg z-10">
        {milestone.icon}
      </div>

      {/* Connector line (horizontal) */}
      <div
        className={`hidden lg:block absolute top-5 h-px w-8 bg-rose-gold/20 ${
          isRight
            ? "right-1/2 mr-5"
            : "left-1/2 ml-5"
        }`}
      />

      {/* Card */}
      <div
        className={`ml-14 lg:ml-0 lg:w-[calc(50%-2.5rem)] ${
          isRight ? "lg:mr-auto lg:pr-8" : "lg:ml-auto lg:pl-8"
        } ${milestone.isOpenEnded ? "italic" : ""}`}
      >
        {/* Date */}
        {!milestone.isOpenEnded && (
          <span className="text-sm font-[family-name:var(--font-inter)] text-warm-gold">
            {milestone.date}
          </span>
        )}
        {milestone.isOpenEnded && (
          <span className="text-sm font-[family-name:var(--font-inter)] text-lavender/60">
            {milestone.date}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-1 font-[family-name:var(--font-playfair-display)] text-xl md:text-2xl text-cream">
          {milestone.title}
        </h3>

        {/* Description */}
        <p className="mt-2 font-[family-name:var(--font-inter)] text-sm md:text-base text-cream/80 leading-relaxed">
          {milestone.description}
        </p>

        {/* Aside (gajar ka halwa) */}
        {milestone.aside && (
          <p className="mt-3 rounded-lg border border-warm-gold/20 bg-midnight-deep/60 px-4 py-3 font-[family-name:var(--font-caveat)] text-sm text-warm-gold/80">
            {milestone.aside}
          </p>
        )}
      </div>
    </div>
  );
}
