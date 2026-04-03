"use client";

import { useState, useEffect } from "react";

const START_DATE = new Date("2026-03-24T00:00:00+05:30");

export function useRelationshipTimer() {
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - START_DATE.getTime();
      setElapsed({
        seconds: Math.floor(diff / 1000) % 60,
        minutes: Math.floor(diff / (1000 * 60)) % 60,
        hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return elapsed;
}
