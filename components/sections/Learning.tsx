"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import ChatBubble from "@/components/ui/ChatBubble";
import FloatingPortrait from "@/components/ui/FloatingPortrait";
import { currentFocus } from "@/lib/data";

export default function Learning() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="focus"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
        {/* Three columns stay exactly as they were */}
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

        {/* Chat bubble + floating portrait on the right side */}
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center lg:justify-end">
          <ChatBubble tail="right">
            <p>
              In the zone <span className="text-crimson-hot">⚡</span>
            </p>
            <p className="mt-1 text-ash">Learning • Building • Growing</p>
          </ChatBubble>
          <FloatingPortrait className="w-[380px] max-w-full" />
        </div>
      </div>
    </section>
  );
}
