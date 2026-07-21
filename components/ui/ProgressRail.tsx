"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "@/lib/scrollProgress";

const SCENES = ["HERO", "ABOUT", "SKILLS", "WORK", "FOCUS", "CONTACT"];

export default function ProgressRail() {
  const [pct, setPct] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    // Poll the module-level scroll store on rAF and mirror it into React
    // state — but only re-render when the rounded value actually changes,
    // so this doesn't fight the R3F loop for frame budget.
    const tick = () => {
      const next = Math.round(scrollState.progress * 100);
      setPct((prev) => (prev !== next ? next : prev));
      const idx = Math.min(
        SCENES.length - 1,
        Math.floor(scrollState.progress * SCENES.length)
      );
      setSceneIndex((prev) => (prev !== idx ? idx : prev));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden select-none font-mono text-[11px] text-ash md:flex md:items-center md:gap-3">
      <span className="timecode text-crimson-hot">
        {String(pct).padStart(3, "0")}%
      </span>
      <span className="h-px w-10 bg-ash/30" />
      <span className="tracking-widest2">{SCENES[sceneIndex]}</span>
    </div>
  );
}
