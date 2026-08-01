"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";
import SceneHeading from "@/components/ui/SceneHeading";
import ChatBubble from "@/components/ui/ChatBubble";
import { profile } from "@/lib/data";

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-10">
        {/* Greeting bubble — hi3.png no longer appears here; it lives only in
            the Skills and Currently Focused On sections as a floating portrait. */}
        <div data-reveal className="flex justify-center lg:justify-start">
          <ChatBubble tail="left">
            <p>
              Hi! 👋 <span className="text-crimson-hot">Code + Coffee</span> ☕💻
            </p>
            <p className="mt-1 text-ash">How can I help?</p>
          </ChatBubble>
        </div>

        {/* Heading + bio */}
        <div className="max-w-xl">
          <div data-reveal>
            <SceneHeading number="02" label="ABOUT" title="Who I Am" />
          </div>
          <p data-reveal className="text-lg leading-relaxed text-ash md:text-xl">
            {profile.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
