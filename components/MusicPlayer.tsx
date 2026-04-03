"use client";

import { useState, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio ref={audioRef} src="/music/our-song.mp3" loop />
      <button
        onClick={togglePlay}
        className="flex items-center gap-2 rounded-full border border-rose-gold/30 bg-midnight-deep/80 px-4 py-2 min-h-[44px] backdrop-blur-sm [-webkit-backdrop-filter:blur(4px)] transition-all hover:border-rose-gold/50"
      >
        <span className="text-sm">{isPlaying ? "⏸" : "▶"}</span>
        <span className="font-[family-name:var(--font-inter)] text-xs text-cream/70">
          Our Song
        </span>
      </button>
    </div>
  );
}
