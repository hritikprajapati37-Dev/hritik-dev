"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import { profile } from "@/lib/data";

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 grid w-full items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
        <div className="max-w-xl">
          <div data-reveal>
            <SceneHeading number="02" label="ABOUT" title="Who I Am" />
          </div>
          <p data-reveal className="text-lg leading-relaxed text-ash md:text-xl">
            {profile.bio}
          </p>
        </div>

        <div data-reveal className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-crimson-deep/50 bg-panel/60 shadow-[0_0_50px_rgba(179,18,43,0.25)] backdrop-blur-sm">
            <Image
              src="/hi3.png"
              alt="Hritik Prajapati"
              fill
              sizes="(max-width: 768px) 80vw, 360px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
          </div>
          <div className="absolute -right-2 top-8 max-w-[13rem] rounded-sm border border-crimson-hot/50 bg-panel/85 p-4 text-sm leading-relaxed text-bone shadow-[0_0_30px_rgba(255,47,71,0.22)] backdrop-blur-md sm:-right-16">
            <span className="block">Hi! 👋 Code + Coffee ☕💻</span>
            <span className="block text-ash">How can I help?</span>
          </div>
        </div>
      </div>
    </section>
  );
}
