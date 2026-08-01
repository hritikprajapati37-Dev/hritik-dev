"use client";

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
      {/* Content shifted RIGHT — hi3 lives on the left side via CharacterLayer */}
      <div className="relative z-10 ml-auto w-full max-w-xl">
        <div data-reveal>
          <SceneHeading number="02" label="ABOUT" title="Who I Am" />
        </div>
        <p data-reveal className="text-lg leading-relaxed text-ash md:text-xl">
          {profile.bio}
        </p>
      </div>
    </section>
  );
}
