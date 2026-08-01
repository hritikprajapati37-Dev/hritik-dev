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
      <div className="relative z-10 text-center">
        {/* Small, clean circular profile picture — standard portfolio style.
            Rendered in HTML (not the 3D scene) so it scrolls away completely
            once the user moves past the hero. */}
        <div
          data-reveal
          className="mx-auto w-fit rounded-full bg-gradient-to-b from-crimson-hot/80 via-crimson-core/60 to-crimson-deep/70 p-1.5 shadow-[0_0_50px_rgba(255,47,71,0.4)]"
        >
          <Image
            src={profile.heroImage}
            alt="Profile picture of Hritik Prajapati"
            width={352}
            height={352}
            priority
            className="h-36 w-36 rounded-full border-2 border-void object-cover sm:h-44 sm:w-44"
            style={{ objectPosition: "50% 30%" }}
          />
        </div>

        <p
          data-reveal
          className="mt-8 font-mono text-xs tracking-widest2 text-crimson-hot"
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
          className="mt-10 flex justify-center gap-2 font-mono text-[11px] text-ash/70"
        >
          <span>SCROLL</span>
          <span className="animate-pulse text-crimson-hot">↓</span>
        </div>
      </div>
    </section>
  );
}
