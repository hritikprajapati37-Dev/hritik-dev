"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Single fixed character layer — hi3.png stays pinned to the viewport and
 * glides between sections with GSAP-driven 3D transforms:
 *
 *   Hero    → center of viewport
 *   About   → glides right, rotateY(-10deg), depth translateZ(30px)
 *   Skills  → glides left,  rotateY( 10deg), depth translateZ(30px)
 *   Projects→ scales back (0.8) translateZ(-100px) + fades out COMPLETELY
 *   Focus   → fades back in on the right side
 *   Contact → fades out, sinks 50px
 *
 * One master timeline is scrubbed across the whole document (scrub: 1.5 for
 * cinematic inertia); segment boundaries are derived from each section's
 * real scroll position (section top reaching the viewport bottom), so the
 * transitions feel tied to the sections and stay correct on resize.
 *
 * Layers (nested so no two animations fight over the same transform):
 *   .char-scroll  – scroll-driven x/y/scale/rotateY/z/autoAlpha
 *   .char-tilt    – mouse tilt (rotateX/rotateY, lerped spring)
 *   .char-float   – ambient time-based bob
 *   #character-img – the hi3.png cutout; filter shadow shifts with tilt
 *   #char-bubble  – speech bubble with its own translateZ(50px) depth layer
 *
 * The whole layer is pointer-events-none so buttons and links stay clickable.
 */
export default function CharacterLayer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [bubble, setBubble] = useState<{
    lines: [string, string];
    side: "left" | "right";
  }>({
    lines: ["Hi! Code + Coffee ☕", "How can I help?"],
    side: "left",
  });

  useEffect(() => {
    const root = rootRef.current;
    const tiltEl = tiltRef.current;
    const imgEl = imgRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const CHAR = ".char-scroll";
      const BUBBLE = "#char-bubble";

      // ── Static initial states ──────────────────────────────────────────
      gsap.set(CHAR, {
        x: 0, y: 0, scale: 1, rotateY: 0, z: 0, autoAlpha: 1,
        transformPerspective: 1000,
      });
      gsap.set(BUBBLE, { z: 50, autoAlpha: 0, transformPerspective: 1000 });

      // ── Ambient floating (time-based, endless) ─────────────────────────
      if (!reduced) {
        gsap.to(".char-float", {
          y: -8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1,
        });
        gsap.to(".char-bubble-inner", {
          y: -5, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1,
          delay: 0.35,
        });
      }

      // ── Master scrubbed timeline ───────────────────────────────────────
      let tl: gsap.core.Timeline | null = null;

      const build = () => {
        if (tl) {
          tl.scrollTrigger?.kill();
          tl.kill();
          tl = null;
        }

        const docH = document.documentElement.scrollHeight - window.innerHeight;
        if (docH <= 0) return;

        const off = window.innerWidth >= 1024 ? 300 : 70; // side travel (px)
        const vh = window.innerHeight;

        // Boundary = scroll position at which a section's top reaches the
        // viewport bottom (the moment the section "enters the reel").
        const boundary = (selector: string) => {
          const el = document.querySelector(selector);
          if (!el) return 1;
          const b = el.getBoundingClientRect().top + window.scrollY - vh;
          return Math.max(0, Math.min(1, b / docH));
        };

        const tAbout = boundary("#about");
        const tSkills = boundary("#skills");
        const tWork = boundary("#work");
        const tFocus = boundary("#focus");
        const tContact = boundary("#contact");

        const D = (a: number, b: number) => Math.max(0.0001, b - a);

        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        // Segment 1 — Hero → About: glide right with rotateY(-10) + depth.
        tl.fromTo(
          CHAR,
          { x: 0, rotateY: 0, z: 0, scale: 1, autoAlpha: 1 },
          { x: off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1, duration: D(0, tAbout) },
          0
        );
        // Bubble fades in just before About takes over.
        tl.fromTo(
          BUBBLE,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.01 },
          Math.max(0, tAbout - 0.01)
        );
        tl.add(() => setBubble({ lines: ["Hi! Code + Coffee ☕", "How can I help?"], side: "left" }), tAbout);

        // Segment 2 — About → Skills: sweep left with rotateY(+10).
        tl.fromTo(
          CHAR,
          { x: off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1 },
          { x: -off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1, duration: D(tAbout, tSkills) },
          tAbout
        );
        tl.add(() => setBubble({ lines: ["These are my weapons ⚔️", "Ready to build?"], side: "right" }), tSkills);

        // Segment 3 — Skills → Projects: scale back into 3D space, fade out,
        // stay COMPLETELY hidden through the whole Projects section.
        tl.fromTo(
          CHAR,
          { x: -off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1 },
          { x: -off * 0.5, rotateY: 4, z: -100, scale: 0.8, autoAlpha: 0, duration: D(tSkills, tWork) },
          tSkills
        );
        tl.fromTo(
          BUBBLE,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.01 },
          Math.max(0, tWork - 0.01)
        );
        tl.add(() => setBubble({ lines: ["These are my weapons ⚔️", "Ready to build?"], side: "right" }), tWork);

        // Segment 4 — Projects → Focus: fade back in on the right side.
        tl.fromTo(
          CHAR,
          { x: -off * 0.4, rotateY: 0, z: -100, scale: 0.8, autoAlpha: 0 },
          { x: off, rotateY: -10, z: 0, scale: 1, autoAlpha: 1, duration: D(tWork, tFocus) },
          tWork
        );
        tl.fromTo(
          BUBBLE,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.01 },
          Math.max(0, tFocus - 0.01)
        );
        tl.add(() => setBubble({ lines: ["In the zone ✨", "Learning • Building • Growing"], side: "left" }), tFocus);

        // Segment 5 — Focus → Contact: fade out and sink 50px.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: -10, z: 0, scale: 1, autoAlpha: 1 },
          { x: off * 0.6, rotateY: 0, y: 50, scale: 0.95, autoAlpha: 0, duration: D(tFocus, tContact) },
          tFocus
        );
        tl.fromTo(
          BUBBLE,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.01 },
          Math.max(0, tContact - 0.01)
        );
        tl.add(() => setBubble({ lines: ["In the zone ✨", "Learning • Building • Growing"], side: "left" }), tContact);
      };

      build();

      // Keep segment boundaries honest when layout changes.
      let resizeTimer: ReturnType<typeof setTimeout> | null = null;
      const onResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 200);
      };
      const onLoad = () => {
        ScrollTrigger.refresh();
        build();
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", onLoad);
      };
    }, root);

    // ── Interactive mouse tilt + dynamic shadow (hover-capable devices) ──
    let tickFn: (() => void) | null = null;
    const canHover =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (canHover && !reduced && tiltEl && imgEl) {
      const target = { x: 0, y: 0 };
      const cur = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("mousemove", onMove);

      tickFn = () => {
        cur.x += (target.x - cur.x) * 0.055; // smooth spring-ish lerp
        cur.y += (target.y - cur.y) * 0.055;
        tiltEl.style.transform = `rotateX(${(-cur.y * 5).toFixed(2)}deg) rotateY(${(cur.x * 8).toFixed(2)}deg)`;
        // Drop-shadow angle/blur shifts in sync with the tilt — red ambient light.
        imgEl.style.filter =
          `drop-shadow(${(cur.x * 16).toFixed(1)}px ${(20 + cur.y * 8).toFixed(1)}px ` +
          `${(26 + Math.abs(cur.x) * 8).toFixed(1)}px rgba(255,0,50,0.3)) ` +
          `drop-shadow(0 0 70px rgba(179,18,43,0.28))`;
      };
      gsap.ticker.add(tickFn);
    }

    return () => {
      if (tickFn) gsap.ticker.remove(tickFn);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[6] flex items-center justify-center"
      style={{ perspective: "1000px" }}
      aria-hidden
    >
      <div className="char-scroll relative" style={{ transformStyle: "preserve-3d" }}>
        <div ref={tiltRef} className="char-tilt" style={{ transformStyle: "preserve-3d" }}>
          <div className="char-float relative" style={{ transformStyle: "preserve-3d" }}>
            {/* Soft crimson rim-glow halo + under-glow */}
            <div
              aria-hidden
              className="absolute -inset-14 rounded-full bg-crimson-radial blur-2xl"
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-crimson-hot/10 blur-xl"
            />
            <Image
              ref={imgRef}
              id="character-img"
              src="/hi3.png"
              alt=""
              width={1023}
              height={1537}
              priority
              draggable={false}
              className="relative h-auto w-[min(230px,48vw)] drop-shadow-[0_0_28px_rgba(255,47,71,0.4)] drop-shadow-[0_0_70px_rgba(179,18,43,0.3)] md:w-[300px] lg:w-[380px]"
            />
          </div>
        </div>

        {/* Speech bubble — own depth layer (translateZ 50px), follows the character */}
        <div
          id="char-bubble"
          className={`absolute top-[6%] z-10 opacity-0 ${
            bubble.side === "left"
              ? "right-[calc(100%+1.5rem)]"
              : "left-[calc(100%+1.5rem)]"
          }`}
        >
          <div
            className={`char-bubble-inner relative w-44 rounded-2xl border border-crimson-core/40 bg-panel/80 px-4 py-3 shadow-[0_0_35px_rgba(255,47,71,0.22)] backdrop-blur-md sm:w-56 ${
              bubble.side === "left" ? "rounded-tr-md" : "rounded-tl-md"
            }`}
          >
            <span
              className={`absolute top-4 h-3 w-3 rotate-45 bg-panel/80 ${
                bubble.side === "left"
                  ? "-right-[7px] border-t border-r border-crimson-core/40"
                  : "-left-[7px] border-b border-l border-crimson-core/40"
              }`}
            />
            <p className="font-body text-sm leading-relaxed text-bone">
              {bubble.lines[0]}
              <span className="mt-1 block text-ash">{bubble.lines[1]}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
