"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { ISourceOptions } from "@tsparticles/engine";

export default function FloatingElements() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (reduced || !ready) return null;

  const options: ISourceOptions = {
    fullScreen: false,
    particles: {
      number: { value: isDesktop ? 15 : 8 },
      color: { value: ["#e8a0bf", "#d4a574", "#ff6b9d"] },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: { enable: true, speed: 0.3, sync: false },
      },
      size: {
        value: { min: 2, max: 6 },
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "bottom" as const,
        outModes: { default: "out" as const },
      },
      shape: { type: "circle" },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="floating-elements"
      options={options}
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
