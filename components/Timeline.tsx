"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Milestone } from "@/data/milestones";
import TimelineCard from "./TimelineCard";

interface TimelineProps {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      id="timeline"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={reduced ? noMotion : fadeUp}
      className="relative mx-auto max-w-5xl px-6 py-20"
    >
      <h2 className="mb-16 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        Our Story
      </h2>

      {/* Self-drawing vertical line */}
      <svg className="absolute left-5 lg:left-1/2 top-28 bottom-8 w-px -translate-x-1/2 overflow-visible">
        {/* Background track */}
        <line
          x1="0.5" y1="0" x2="0.5" y2="100%"
          stroke="#e8a0bf"
          strokeWidth="1"
          strokeOpacity="0.1"
        />
        {/* Animated draw line */}
        <motion.line
          x1="0.5" y1="0" x2="0.5" y2="100%"
          stroke="#e8a0bf"
          strokeWidth="2"
          style={{ pathLength: reduced ? 1 : pathLength }}
        />
      </svg>

      <div className="flex flex-col gap-16">
        {milestones.map((milestone, index) => (
          <TimelineCard
            key={milestone.id}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}
