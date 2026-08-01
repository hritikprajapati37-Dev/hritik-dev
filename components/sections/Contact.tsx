"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import { profile } from "@/lib/data";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.05 11.05 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const ref = useScrollReveal<HTMLDivElement>();
  const { email, github, linkedin } = profile.contact;

  const socials = SOCIALS.map((s) => ({
    ...s,
    href:
      s.label === "GitHub" && github
        ? github
        : s.label === "LinkedIn" && linkedin
          ? linkedin
          : s.href,
  }));

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div data-reveal>
          <SceneHeading number="06" label="CONTACT" title="Get In Touch" />
        </div>

        <p
          data-reveal
          className="mx-auto max-w-xl text-lg leading-relaxed text-ash md:text-xl"
        >
          Got a project in mind, a freelance gig, or just want to talk code
          and coffee? My inbox is always open — I usually reply within a day.
        </p>

        {/* Email CTA */}
        <div data-reveal className="mt-10">
          <a
            href={`mailto:${email}`}
            className="focus-ring inline-flex items-center gap-3 rounded-full border border-crimson-hot/60 bg-crimson-core/20 px-8 py-4 font-mono text-xs uppercase tracking-widest text-bone transition-all duration-300 hover:bg-crimson-hot hover:text-void hover:shadow-[0_0_45px_rgba(255,47,71,0.55)] sm:text-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-crimson-glow" />
            Say Hello — {email}
          </a>
        </div>

        {/* Social links */}
        <div data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-crimson-core/50 bg-panel/60 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ash backdrop-blur-sm transition-all duration-300 hover:border-crimson-hot/70 hover:text-bone hover:shadow-[0_0_25px_rgba(255,47,71,0.3)]"
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>

        <p
          data-reveal
          className="mt-12 font-mono text-[10px] tracking-widest2 text-crimson-hot/70"
        >
          AVAILABLE FOR FREELANCE · REMOTE OK · SCENE 06 — FIN
        </p>
      </div>
    </section>
  );
}
