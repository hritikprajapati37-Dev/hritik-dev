"use client";

import { useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress, active } = useProgress();

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-void transition-opacity duration-700 ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!active}
    >
      <p className="font-mono text-xs tracking-widest2 text-crimson-hot">
        LOADING REEL
      </p>
      <div className="mt-4 h-px w-48 overflow-hidden bg-crimson-deep/40">
        <div
          className="h-full bg-crimson-hot transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 font-mono text-[10px] text-ash timecode">
        {String(Math.floor(progress)).padStart(3, "0")}%
      </p>
    </div>
  );
}
