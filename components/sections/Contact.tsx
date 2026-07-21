"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import { profile } from "@/lib/data";

export default function Contact() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p
        data-reveal
        className="font-mono text-xs tracking-widest2 text-crimson-hot"
      >
        SCENE 06 — END CREDITS
      </p>
      <h2
        data-reveal
        className="mt-4 font-display text-5xl uppercase leading-[0.95] text-bone text-glow sm:text-6xl md:text-7xl"
      >
        Let&rsquo;s Build
        <br />
        Something
      </h2>

      <a
        data-reveal
        href={`mailto:${profile.contact.email}`}
        className="focus-ring mt-10 inline-block border border-crimson-hot px-8 py-3 font-mono text-sm uppercase tracking-widest2 text-crimson-glow transition-colors hover:bg-crimson-hot hover:text-void"
      >
        {profile.contact.email}
      </a>

      <div data-reveal className="mt-8 flex gap-6 font-mono text-xs text-ash">
        <a href={profile.contact.github} className="focus-ring hover:text-crimson-glow">
          GITHUB
        </a>
        <a href={profile.contact.linkedin} className="focus-ring hover:text-crimson-glow">
          LINKEDIN
        </a>
      </div>

      <p className="mt-16 font-mono text-[10px] text-ash/50">
        © {new Date().getFullYear()} {profile.name}. Built with Next.js &amp; Three.js.
      </p>
    </section>
  );
}
