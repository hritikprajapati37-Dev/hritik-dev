"use client";

import Image from "next/image";
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
      className="relative flex min-h-screen items-center px-6 py-24 md:px-16"
    >
      <div className="relative z-10 grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8 xl:gap-12">
        {/* LEFT — scene label, heading, and bio text */}
        <div className="text-center lg:text-right">
          <div data-reveal>
            <SceneHeading number="02" label="ABOUT" title="Who I Am" />
          </div>
          <p
            data-reveal
            className="mx-auto max-w-xl text-lg leading-relaxed text-ash lg:mr-0 md:text-xl"
          >
            {profile.bio}
          </p>
        </div>

        {/* MIDDLE — the hi3.png portrait (320px wide, clean, no frame) */}
        <div data-reveal className="flex justify-center">
          <Image
            src="/hi3.png"
            alt="Portrait of Hritik Prajapati"
            width={320}
            height={480}
            priority
            className="h-auto w-[320px] max-w-full object-contain"
          />
        </div>

        {/* RIGHT — chat message bubble */}
        <div className="flex justify-center lg:justify-start">
          <ChatBubble tail="left">
            <p>
              Hi! 👋 <span className="text-crimson-hot">Code + Coffee</span> ☕💻
            </p>
            <p className="mt-1 text-ash">How can I help?</p>
          </ChatBubble>
        </div>
      </div>
    </section>
  );
}
