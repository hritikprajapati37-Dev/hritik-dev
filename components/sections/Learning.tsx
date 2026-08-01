"use client";

import Image from "next/image";
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
      <div className="relative z-10 grid w-full items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(240px,390px)]">
        <div className="w-full max-w-2xl">
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

        <div data-reveal className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-crimson-deep/50 bg-panel/60 shadow-[0_0_50px_rgba(179,18,43,0.25)] backdrop-blur-sm">
            <Image
              src="/hi4.jpg"
              alt="Hritik Prajapati"
              fill
              sizes="(max-width: 768px) 80vw, 360px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
          </div>
          <div className="absolute -right-2 top-8 max-w-[14rem] rounded-sm border border-crimson-hot/50 bg-panel/85 p-4 text-sm leading-relaxed text-bone shadow-[0_0_30px_rgba(255,47,71,0.22)] backdrop-blur-md sm:-right-16">
            <span className="block">In the zone ⚡</span>
            <span className="block text-ash">Learning • Building • Growing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
