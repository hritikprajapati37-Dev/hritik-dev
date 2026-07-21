"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import { currentFocus } from "@/lib/data";

export default function Learning() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="focus"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 w-full max-w-2xl">
        <div data-reveal>
          <SceneHeading number="05" label="RIGHT NOW" title="Currently Focused On" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {currentFocus.map((item) => (
            <div key={item.label} data-reveal>
              <p className="font-mono text-xs tracking-widest2 text-crimson-hot">
                {item.label.toUpperCase()}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
