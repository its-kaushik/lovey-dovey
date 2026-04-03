"use client";

export default function Hero() {
  const scrollToTimeline = () => {
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[family-name:var(--font-playfair-display)] text-3xl md:text-5xl lg:text-6xl text-cream leading-tight">
        For My Devi
      </h1>

      <p className="mt-4 font-[family-name:var(--font-caveat)] text-xl md:text-2xl lg:text-3xl text-lavender">
        The most chaotic, beautiful thing that ever happened to me
      </p>

      <button
        onClick={scrollToTimeline}
        className="mt-10 rounded-full border border-rose-gold px-8 py-3 font-[family-name:var(--font-playfair-display)] text-rose-gold shadow-[0_0_20px_rgba(232,160,191,0.3)] transition-shadow hover:shadow-[0_0_30px_rgba(232,160,191,0.5)]"
      >
        Read Our Story
      </button>
    </section>
  );
}
