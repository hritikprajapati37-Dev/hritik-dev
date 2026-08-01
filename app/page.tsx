"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scrollProgress";

import Loader from "@/components/ui/Loader";
import ProgressRail from "@/components/ui/ProgressRail";
import CharacterLayer from "@/components/ui/CharacterLayer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Learning from "@/components/sections/Learning";
import Contact from "@/components/sections/Contact";

// The 3D canvas touches window/WebGL — must be client-only, no SSR.
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    // Drives the whole cinematic camera move: one ScrollTrigger spanning
    // the full document height, writing normalized progress into the
    // module-level store that CameraRig and ProgressRail read from.
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <>
      <Loader />

      {/* Fixed, full-viewport 3D backdrop. Sections scroll on top of it. */}
      <Scene />

      {/* Readability gradient so text stays legible over the busy 3D scene */}
      <div className="pointer-events-none fixed inset-0 z-[5] bg-crimson-fade opacity-70" />

      {/* Fixed cinematic character (hi3) — scrolls between sections in 3D */}
      <CharacterLayer />

      <div className="film-grain" />
      <ProgressRail />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Learning />
        <Contact />
      </main>
    </>
  );
}
