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
        {/* Portrait (hi3) + chat bubble on the right side of the image — no border,
            box, or container around the image, just the clean PNG. */}
        <div data-reveal className="flex items-end justify-center gap-5 sm:gap-8 lg:justify-start">
          <Image
            src="/hi3.png"
            alt="Portrait of Hritik Prajapati"
            width={407}
            height={612}
            priority
            className="max-h-[52vh] w-auto object-contain"
          />

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
