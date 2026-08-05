"use client";

import { useEffect, useRef, useState } from "react";
import { scrollState } from "@/lib/scrollProgress";

// Scene label ranges — must match the fixed progress keyframes used by the
// character layer:
//   HERO 0–20 · ABOUT 20–38 · SKILLS 38–58 · WORK 58–75 ·
//   FOCUS 75–90 · CONTACT 90–100
const SCENES: { label: string; from: number; to: number }[] = [
  { label: "HERO", from: 0, to: 0.2 },
  { label: "ABOUT", from: 0.2, to: 0.38 },
  { label: "SKILLS", from: 0.38, to: 0.58 },
  { label: "WORK", from: 0.58, to: 0.75 },
  { label: "FOCUS", from: 0.75, to: 0.9 },
  { label: "CONTACT", from: 0.9, to: 1 },
];

const labelFor = (progress: number): string =>
  SCENES.find((s) => progress >= s.from && progress < s.to)?.label ??
  SCENES[SCENES.length - 1].label;

export default function ProgressRail() {
  const [pct, setPct] = useState(0);
  const [scene, setScene] = useState("HERO");
  const raf = useRef<number | null>(null);

  useEffect(() => {
    // Poll the module-level scroll store on rAF and mirror it into React
    // state — but only re-render when the rounded value actually changes,
    // so this doesn't fight the R3F loop for frame budget.
    const tick = () => {
      const next = Math.round(scrollState.progress * 100);
      setPct((prev) => (prev !== next ? next : prev));
      const label = labelFor(scrollState.progress);
      setScene((prev) => (prev !== label ? label : prev));
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
      <span className="tracking-widest2">{scene}</span>
    </div>
  );
}
