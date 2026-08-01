"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import ChatBubble from "@/components/ui/ChatBubble";
import FloatingPortrait from "@/components/ui/FloatingPortrait";
import { skills, tools } from "@/lib/data";

export default function Skills() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="skills"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-10">
        {/* Floating portrait + chat bubble on the left side */}
        <div className="order-2 flex flex-col items-center gap-10 sm:flex-row sm:justify-center lg:order-1 lg:justify-start">
          <FloatingPortrait className="w-32 sm:w-40 lg:w-44" />
          <ChatBubble tail="left">
            <p>
              These are my weapons <span className="text-crimson-hot">⚔️💻</span>
            </p>
            <p className="mt-1 text-ash">Ready to build?</p>
          </ChatBubble>
        </div>

        {/* Skills & tools stay exactly as they were */}
        <div className="order-1 ml-auto w-full max-w-xl text-right lg:order-2">
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
