"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/data/gallery";

interface PhotoGalleryProps {
  items: GalleryItem[];
}

export default function PhotoGallery({ items }: PhotoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const closeLightbox = useCallback(() => setSelectedItem(null), []);

  // Close on Escape
  useEffect(() => {
    if (!selectedItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedItem, closeLightbox]);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center font-[family-name:var(--font-playfair-display)] text-2xl md:text-3xl lg:text-4xl text-cream">
          Gallery
        </h2>
        <p className="text-center font-[family-name:var(--font-caveat)] text-lg text-lavender/60">
          Photos coming soon...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
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
            style={{
              transform: `rotate(${item.rotation ?? 0}deg)`,
            }}
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
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
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
                {selectedItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
