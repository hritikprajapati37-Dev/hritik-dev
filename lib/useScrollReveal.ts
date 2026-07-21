"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Fades + slides children of the returned ref up into view as the section
 * scrolls into the viewport. Targets any element with [data-reveal] inside
 * the container, staggering them in document order.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const targets = ref.current!.querySelectorAll("[data-reveal]");
      if (targets.length === 0) return;

      gsap.set(targets, { opacity: 0, y: 36 });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export { ScrollTrigger };
