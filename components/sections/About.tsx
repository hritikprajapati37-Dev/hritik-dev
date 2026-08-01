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
      className="relative flex min-h-screen items-center px-6 md:px-16"
    >
      <div className="relative z-10 grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-10">
        {/* Portrait (hi3) + chat bubble on the right side of the image */}
        <div data-reveal className="flex items-end justify-center gap-5 sm:gap-8 lg:justify-start">
          <div className="relative shrink-0 rounded-2xl border border-crimson-deep/40 bg-panel/50 p-3 shadow-[0_0_45px_rgba(179,18,43,0.25)] backdrop-blur-sm">
            <Image
              src="/hi3.png"
              alt="Portrait of Hritik Prajapati"
              width={407}
              height={612}
              priority
              className="max-h-[52vh] w-auto rounded-xl object-contain"
            />
            <span className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-inset ring-crimson-hot/20" />
          </div>

          <ChatBubble tail="left" className="mb-8 shrink-0">
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
