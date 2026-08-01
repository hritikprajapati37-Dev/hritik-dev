"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import { skills, tools } from "@/lib/data";

export default function Skills() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="skills"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      {/* Content shifted LEFT — hi3 lives on the right side via CharacterLayer */}
      <div className="relative z-10 w-full max-w-xl text-left">
        <div data-reveal>
          <SceneHeading number="03" label="CAPABILITIES" title="Skills & Tools" />
        </div>

        <ul className="space-y-4">
          {skills.map((s) => (
            <li
              key={s.label}
              data-reveal
              className="border-b border-crimson-deep/40 pb-3"
            >
              <p className="font-display text-xl uppercase tracking-wide text-bone md:text-2xl">
                {s.label}
              </p>
              <p className="mt-1 text-sm text-ash">{s.note}</p>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-8 flex flex-wrap justify-start gap-2">
          {tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-crimson-core/50 px-3 py-1 font-mono text-xs text-crimson-glow"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
