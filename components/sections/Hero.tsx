"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { profile } from "@/lib/data";

export default function Hero() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <div className="relative z-10 text-center">
        <p
          data-reveal
          className="font-mono text-xs tracking-widest2 text-crimson-hot"
        >
          PORTFOLIO — SCENE 01
        </p>
        <h1
          data-reveal
          className="mt-4 font-display text-6xl uppercase leading-[0.95] text-bone text-glow sm:text-7xl md:text-8xl"
        >
          {profile.name}
        </h1>
        <p
          data-reveal
          className="mx-auto mt-5 max-w-xl font-body text-base text-ash sm:text-lg"
        >
          {profile.title}
        </p>
        <div data-reveal className="mt-10 flex justify-center gap-2 font-mono text-[11px] text-ash/70">
          <span>SCROLL</span>
          <span className="animate-pulse text-crimson-hot">↓</span>
        </div>
      </div>
    </section>
  );
}
