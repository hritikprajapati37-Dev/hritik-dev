"use client";

import Image from "next/image";
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
      <div className="relative z-10 grid w-full items-center gap-12 md:grid-cols-[minmax(240px,420px)_minmax(0,1fr)]">
        <div data-reveal className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-crimson-deep/50 bg-panel/60 shadow-[0_0_50px_rgba(179,18,43,0.25)] backdrop-blur-sm">
            <Image
              src="/hi2.png"
              alt="Hritik Prajapati"
              fill
              sizes="(max-width: 768px) 80vw, 360px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/65 via-transparent to-transparent" />
          </div>
          <div className="absolute -left-2 top-8 max-w-[13rem] rounded-sm border border-crimson-hot/50 bg-panel/85 p-4 text-sm leading-relaxed text-bone shadow-[0_0_30px_rgba(255,47,71,0.22)] backdrop-blur-md sm:-left-16">
            <span className="block">These are my weapons ⚔️💻</span>
            <span className="block text-ash">Ready to build?</span>
          </div>
        </div>

        <div className="ml-auto w-full max-w-xl text-right">
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

          <div data-reveal className="mt-8 flex flex-wrap justify-end gap-2">
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
      </div>
    </section>
  );
}
