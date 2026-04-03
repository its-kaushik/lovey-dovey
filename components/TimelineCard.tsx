"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Milestone } from "@/data/milestones";

interface TimelineCardProps {
  milestone: Milestone;
  index: number;
}

export default function TimelineCard({ milestone, index }: TimelineCardProps) {
  const isRight = index % 2 === 1;
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Desktop: 5-stage stagger. Mobile: simple fade.
  const cardVariants = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : isDesktop
      ? {
          hidden: { opacity: 0, x: isRight ? 60 : -60 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" as const, staggerChildren: 0.2 },
          },
        }
      : {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.15 },
          },
        };

  const childFade = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
      };

  const heartPulse = reduced
    ? {}
    : { scale: [1, 1.3, 1], transition: { duration: 0.4 } };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className={`relative flex items-start gap-6 lg:gap-10 ${
        isRight ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Timeline dot + icon */}
      <motion.div
        animate={heartPulse}
        className="absolute left-0 lg:left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-rose-gold/40 bg-midnight-deep text-lg z-10"
      >
        {milestone.icon}
      </motion.div>

      {/* Connector line (horizontal) */}
      <div
        className={`hidden lg:block absolute top-5 h-px w-8 bg-rose-gold/20 ${
          isRight ? "right-1/2 mr-5" : "left-1/2 ml-5"
        }`}
      />

      {/* Card content */}
      <div
        className={`ml-14 lg:ml-0 lg:w-[calc(50%-2.5rem)] ${
          isRight ? "lg:mr-auto lg:pr-8" : "lg:ml-auto lg:pl-8"
        } ${milestone.isOpenEnded ? "italic" : ""}`}
      >
        {/* Date */}
        <motion.span
          variants={childFade}
          className={`text-sm font-[family-name:var(--font-inter)] ${
            milestone.isOpenEnded ? "text-lavender/60" : "text-warm-gold"
          }`}
        >
          {milestone.date}
        </motion.span>

        {/* Title */}
        <motion.h3
          variants={childFade}
          className="mt-1 font-[family-name:var(--font-playfair-display)] text-xl md:text-2xl text-cream"
        >
          {milestone.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          variants={childFade}
          className="mt-2 font-[family-name:var(--font-inter)] text-sm md:text-base text-cream/80 leading-relaxed"
        >
          {milestone.description}
        </motion.p>

        {/* Aside (gajar ka halwa) */}
        {milestone.aside && (
          <motion.p
            variants={childFade}
            className="mt-3 rounded-lg border border-warm-gold/20 bg-midnight-deep/60 px-4 py-3 font-[family-name:var(--font-caveat)] text-sm text-warm-gold/80"
          >
            {milestone.aside}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
