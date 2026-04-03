"use client";

const paragraphText = `I don't know the exact second it happened. Maybe it was that night at CyberHub, when the city was blurring behind you and you were the only thing in focus. Maybe it was when you cooked for me and I realised no one had ever done something that simple and that meaningful. Or maybe it was the day you handed me that letter and I read what you wrote about me — and for the first time, I saw myself the way someone who loves me sees me. I don't know when it happened. I just know that by the time I noticed, it was already too late to go back. And I didn't want to.`;

export default function TheMomentIKnew() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-spotlight px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-10 font-[family-name:var(--font-caveat)] text-2xl md:text-3xl text-warm-gold">
          The Moment I Knew
        </h2>

        <p className="font-[family-name:var(--font-playfair-display)] text-lg md:text-xl lg:text-2xl text-cream/90 leading-relaxed">
          {paragraphText}
        </p>
      </div>
    </section>
  );
}
