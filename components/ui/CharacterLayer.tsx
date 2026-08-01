"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Single fixed character layer — ONE global <img id="character-img"> (hi3.png)
 * pinned to the viewport, gliding between sections with GSAP 3D transforms:
 *
 *   Hero     → COMPLETELY HIDDEN (opacity 0, visibility hidden)
 *   About    → fades in on the LEFT side (text content sits right)
 *   Skills   → glides to the RIGHT side (text content sits left),
 *              brightness/contrast boosted so it reads against the glow
 *   Projects → COMPLETELY HIDDEN (fades back into 3D space)
 *   Focus    → enters RIGHT→LEFT (translateX 100px → 0), settles RIGHT
 *   Contact  → fades out, sinks 50px
 *
 * One master timeline scrubbed across the whole document (scrub: 1.5 for
 * cinematic inertia, ease: power2.out per segment for clean glides).
 * Segment boundaries are derived from each section's real scroll position
 * and rebuilt on resize/load.
 *
 * Layers (nested so no two animations fight over one transform):
 *   .char-scroll – scroll-driven x/y/scale/rotateY/z/autoAlpha
 *   .char-tilt   – mouse tilt (rotateX/rotateY, lerped spring)
 *   .char-float  – ambient time-based bob
 *   #character-img – the hi3.png cutout; filter shadow shifts with tilt
 *   #char-bubble  – speech bubble on its own translateZ(50px) depth layer
 *
 * Container: position fixed, pointer-events none, z-index 10 — buttons and
 * project links always stay clickable.
 */
export default function CharacterLayer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Bubble side is relative to the character: "right" = bubble to the
  // character's right; "left" = bubble to the character's left.
  const [bubble, setBubble] = useState<{
    lines: [string, string];
    side: "left" | "right";
  }>({
    lines: ["Hi! Code + Coffee ☕", "How can I help?"],
    side: "right",
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
      // Starts hidden (Section 01 Hero) — autoAlpha 0 = opacity 0 + visibility hidden.
      gsap.set(CHAR, {
        x: -320, y: 0, scale: 0.9, rotateY: 0, z: 0, autoAlpha: 0,
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
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        // ── Segment 1 — Hero → About ─────────────────────────────────────
        // Character fades in from behind on the LEFT side (text is on the right).
        tl.fromTo(
          CHAR,
          { x: -off - 60, rotateY: -14, z: 0, scale: 0.92, autoAlpha: 0 },
          { x: -off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1, duration: D(0, tAbout) },
          0
        );
        tl.fromTo(BUBBLE, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, Math.max(0, tAbout - 0.01));
        tl.add(() => setBubble({ lines: ["Hi! Code + Coffee ☕", "How can I help?"], side: "right" }), tAbout);

        // ── Segment 2 — About → Skills ───────────────────────────────────
        // Sweep across to the RIGHT side with reverse 3D tilt.
        tl.fromTo(
          CHAR,
          { x: -off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1 },
          { x: off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1, duration: D(tAbout, tSkills) },
          tAbout
        );
        tl.add(() => setBubble({ lines: ["These are my weapons ⚔️", "Ready to build?"], side: "left" }), tSkills);

        // ── Segment 3 — Skills → Projects ────────────────────────────────
        // Scales back into 3D space and fades out — COMPLETELY HIDDEN
        // (visibility: hidden) throughout the whole Projects section.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1 },
          { x: off * 0.5, rotateY: 4, z: -100, scale: 0.8, autoAlpha: 0, duration: D(tSkills, tWork) },
          tSkills
        );
        tl.fromTo(BUBBLE, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, Math.max(0, tWork - 0.01));
        tl.add(() => setBubble({ lines: ["These are my weapons ⚔️", "Ready to build?"], side: "left" }), tWork);

        // ── Segment 4 — Projects → Focus ─────────────────────────────────
        // RIGHT-to-LEFT entrance: translateX(100px) → 0, settles on the
        // RIGHT side (content columns stay left).
        tl.fromTo(
          CHAR,
          { x: off + 100, rotateY: 8, z: -80, scale: 0.85, autoAlpha: 0 },
          { x: off, rotateY: -8, z: 0, scale: 1, autoAlpha: 1, duration: D(tWork, tFocus) },
          tWork
        );
        tl.fromTo(BUBBLE, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, Math.max(0, tFocus - 0.01));
        tl.add(() => setBubble({ lines: ["In the zone ✨", "Learning • Building • Growing"], side: "left" }), tFocus);

        // ── Segment 5 — Focus → Contact ──────────────────────────────────
        // Fades out and sinks 50px as the contact section enters.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: -8, z: 0, scale: 1, autoAlpha: 1 },
          { x: off * 0.6, rotateY: 0, y: 50, scale: 0.95, autoAlpha: 0, duration: D(tFocus, tContact) },
          tFocus
        );
        tl.fromTo(BUBBLE, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, Math.max(0, tContact - 0.01));
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
        // Brightness/contrast boost + drop-shadow that shifts angle/blur in
        // sync with the tilt — red cinematic ambient lighting.
        imgEl.style.filter =
          `brightness(1.1) contrast(1.05) ` +
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
      className="pointer-events-none fixed inset-0 z-[10] flex items-center justify-center"
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
              className="relative h-auto w-[min(230px,48vw)] md:w-[300px] lg:w-[380px]"
              style={{
                filter:
                  "brightness(1.1) contrast(1.05) drop-shadow(0 20px 30px rgba(255,0,50,0.3)) drop-shadow(0 0 70px rgba(179,18,43,0.28))",
              }}
            />
          </div>
        </div>

        {/* Speech bubble — own depth layer (translateZ 50px), follows the character */}
        <div
          id="char-bubble"
          className={`absolute top-[6%] z-10 opacity-0 ${
            bubble.side === "right"
              ? "left-[calc(100%+1.5rem)]"
              : "right-[calc(100%+1.5rem)]"
          }`}
        >
          <div
            className={`char-bubble-inner relative w-44 rounded-2xl border border-crimson-core/40 bg-panel/80 px-4 py-3 shadow-[0_0_35px_rgba(255,47,71,0.22)] backdrop-blur-md sm:w-56 ${
              bubble.side === "right" ? "rounded-tl-md" : "rounded-tr-md"
            }`}
          >
            <span
              className={`absolute top-4 h-3 w-3 rotate-45 bg-panel/80 ${
                bubble.side === "right"
                  ? "-left-[7px] border-b border-l border-crimson-core/40"
                  : "-right-[7px] border-t border-r border-crimson-core/40"
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
