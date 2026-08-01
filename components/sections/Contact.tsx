"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import { profile } from "@/lib/data";

export default function Contact() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 py-32 md:px-16"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
        <div>
          <div data-reveal>
            <SceneHeading number="06" label="CONTACT" title="Get In Touch / Contact" />
          </div>
          <p data-reveal className="max-w-xl text-lg leading-relaxed text-ash md:text-xl">
            Have a project, collaboration, or remote opportunity in mind? Send a message and I will get back to you soon.
          </p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.contact.email}`}
              className="focus-ring rounded-sm border border-crimson-hot/70 bg-crimson-core/20 px-5 py-3 font-mono text-xs uppercase tracking-widest2 text-bone transition-colors hover:bg-crimson-core/35"
            >
              Email Me
            </a>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-sm border border-crimson-deep/70 bg-panel/70 px-5 py-3 font-mono text-xs uppercase tracking-widest2 text-crimson-glow transition-colors hover:border-crimson-hot/70"
            >
              GitHub
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-sm border border-crimson-deep/70 bg-panel/70 px-5 py-3 font-mono text-xs uppercase tracking-widest2 text-crimson-glow transition-colors hover:border-crimson-hot/70"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <form
          data-reveal
          action={`mailto:${profile.contact.email}`}
          method="post"
          encType="text/plain"
          className="space-y-4 rounded-sm border border-crimson-deep/50 bg-panel/70 p-5 shadow-[0_0_50px_rgba(179,18,43,0.2)] backdrop-blur-md"
        >
          <input
            name="name"
            aria-label="Name"
            placeholder="Name"
            className="focus-ring w-full rounded-sm border border-crimson-deep/50 bg-void/70 px-4 py-3 text-sm text-bone outline-none placeholder:text-ash/60"
          />
          <input
            name="email"
            type="email"
            aria-label="Email"
            placeholder="Email"
            className="focus-ring w-full rounded-sm border border-crimson-deep/50 bg-void/70 px-4 py-3 text-sm text-bone outline-none placeholder:text-ash/60"
          />
          <textarea
            name="message"
            aria-label="Message"
            placeholder="Message"
            rows={5}
            className="focus-ring w-full resize-none rounded-sm border border-crimson-deep/50 bg-void/70 px-4 py-3 text-sm text-bone outline-none placeholder:text-ash/60"
          />
          <button
            type="submit"
            className="focus-ring w-full rounded-sm border border-crimson-hot/70 bg-crimson-core/25 px-5 py-3 font-mono text-xs uppercase tracking-widest2 text-bone transition-colors hover:bg-crimson-core/40"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
