"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import { projects } from "@/lib/data";

export default function Projects() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="work"
      ref={ref}
      className="relative min-h-screen px-6 py-32 md:px-16"
    >
      <div data-reveal className="relative z-10">
        <SceneHeading number="04" label="SELECTED WORK" title="Projects" />
      </div>

      <div className="relative z-10 grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <a
            key={p.id}
            href={p.link}
            data-reveal
            className="focus-ring group relative block overflow-hidden rounded-sm border border-crimson-deep/40 bg-panel/60 backdrop-blur-sm transition-colors hover:border-crimson-hot/70"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-70 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
              <span className="absolute left-3 top-3 font-mono text-xs text-crimson-hot">
                {p.id}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">
                {p.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
