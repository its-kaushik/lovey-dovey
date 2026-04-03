"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, noMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { GalleryItem } from "@/data/gallery";

interface PhotoGalleryProps {
  items: GalleryItem[];
}

export default function PhotoGallery({ items }: PhotoGalleryProps) {
  const reduced = useReducedMotion();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [displayedCaption, setDisplayedCaption] = useState("");

  const closeLightbox = useCallback(() => {
    setSelectedItem(null);
    setDisplayedCaption("");
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!selectedItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedItem, closeLightbox]);

  // Typewriter caption
  useEffect(() => {
    if (!selectedItem?.caption) return;
    const text = selectedItem.caption;
    if (reduced) {
      setDisplayedCaption(text);
      return;
    }
    setDisplayedCaption("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedCaption(text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [selectedItem, reduced]);

  if (items.length === 0) {
    return (
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduced ? noMotion : fadeUp}
        className="mx-auto max-w-5xl px-6 py-20"
      >
        <h2 className="mb-12 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
          Gallery
        </h2>
        <p className="text-center font-[family-name:var(--font-caveat)] text-lg text-lavender/60">
          Photos coming soon...
        </p>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduced ? noMotion : fadeUp}
      className="mx-auto max-w-5xl px-6 py-20"
    >
      <h2 className="mb-12 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
        Gallery
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative overflow-hidden rounded-sm border-4 border-white/90 bg-white/10 p-1 pb-4 shadow-md transition-transform hover:scale-[1.02]"
            style={{ transform: `rotate(${item.rotation ?? 0}deg)` }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={400}
              height={400}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="aspect-square object-cover"
            />
            {item.caption && (
              <p className="mt-1 text-center font-[family-name:var(--font-caveat)] text-xs text-cream/60 truncate">
                {item.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-h-[90vh] max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -right-2 -top-10 text-2xl text-cream/70 hover:text-cream"
              >
                &times;
              </button>

              <Image
                src={selectedItem.src}
                alt={selectedItem.alt}
                width={900}
                height={900}
                sizes="90vw"
                className="rounded object-contain"
              />

              {selectedItem.caption && (
                <p className="mt-4 text-center font-[family-name:var(--font-caveat)] text-lg text-cream/80">
                  {displayedCaption}
                  <span className="animate-pulse">|</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
