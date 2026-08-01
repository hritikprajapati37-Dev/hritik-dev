"use client";

import Image from "next/image";
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
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
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
        <div
          data-reveal
          className="mt-9 h-52 w-52 overflow-hidden rounded-full border border-crimson-hot/70 bg-panel/70 shadow-[0_0_42px_rgba(255,47,71,0.35)] backdrop-blur-sm sm:h-64 sm:w-64 md:h-72 md:w-72"
        >
          <Image
            src="/hi4.jpg"
            alt="Hritik Prajapati"
            width={576}
            height={576}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div data-reveal className="mt-10 flex justify-center gap-2 font-mono text-[11px] text-ash/70">
          <span>SCROLL</span>
          <span className="animate-pulse text-crimson-hot">↓</span>
        </div>
      </div>
    </section>
  );
}
