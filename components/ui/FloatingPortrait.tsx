"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Cinematic floating portrait — the /hi3.png cutout with a soft crimson
 * rim-glow, a gentle time-based bob, and scroll-driven parallax (drift,
 * scale, and rotation) tied to its section via ScrollTrigger.
 *
 * Two nested layers keep the animations from fighting each other:
 *   .fp-wrap — scroll-driven transforms (y, scale, rotate, opacity)
 *   .fp-img  — endless time-based float (y only)
 *
 * Usage: <FloatingPortrait className="w-40" /> — size it with width classes;
 * height follows the image's aspect ratio automatically.
 */
export default function FloatingPortrait({
  className = "",
  imageClassName = "",
  float = 10,
  parallax = 70,
  scaleFrom = 0.9,
  scaleTo = 1.05,
}: {
  className?: string;
  imageClassName?: string;
  /** Gentle bobbing distance in px (time-based). */
  float?: number;
  /** Scroll-parallax travel in px. */
  parallax?: number;
  /** Scale while the section enters from below. */
  scaleFrom?: number;
  /** Scale once the section is centered. */
  scaleTo?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Time-based float: slow, smooth sine bob on the inner image only.
      gsap.to(".fp-img", {
        y: float,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll-driven cinematic motion across the whole section: drifts up,
      // scales in, and settles with a subtle tilt as the user scrolls.
      gsap.fromTo(
        ".fp-wrap",
        { y: parallax, scale: scaleFrom, opacity: 0.5, rotate: -2.5 },
        {
          y: -parallax,
          scale: scaleTo,
          opacity: 1,
          rotate: 1.5,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [float, parallax, scaleFrom, scaleTo]);

  return (
    <div ref={ref} className={`pointer-events-none select-none ${className}`}>
      <div className="fp-wrap relative will-change-transform">
        {/* Soft crimson rim-glow halo behind the cutout */}
        <div
          aria-hidden
          className="absolute -inset-10 rounded-full bg-crimson-radial blur-2xl"
        />
        {/* Subtle warm under-glow hugging the figure's silhouette */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-crimson-hot/10 blur-xl"
        />
        <Image
          src="/hi3.png"
          alt=""
          width={1023}
          height={1537}
          className={`fp-img relative h-auto w-full object-contain drop-shadow-[0_0_28px_rgba(255,47,71,0.4)] drop-shadow-[0_0_70px_rgba(179,18,43,0.35)] ${imageClassName}`}
        />
      </div>
    </div>
  );
}
