"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Single fixed character layer — ONE global <img id="character-img"> (hi3.png)
 * pinned to the viewport, gliding between sections with GSAP 3D transforms:
 *
 *   Hero     → COMPLETELY HIDDEN (opacity 0, visibility hidden)
 *   About    → fades in, then HOLDS on the LEFT side for the whole scene
 *              (text content sits right)
 *   Skills   → glides LEFT → RIGHT early in the scene and REMAINS fully
 *              visible throughout Scene 03 (no shrink / no fade there)
 *   Projects → vanishes right as the section enters (scale 0.8,
 *              translateZ(-100px), opacity 0, visibility hidden)
 *   Focus    → reappears on the RIGHT (translateX 100px → 0 entrance)
 *   Contact  → vanishes (opacity 0, autoAlpha) as Scene 06 enters so the
 *              contact form and social links stay clear
 *
 * One master timeline scrubbed across the whole document (scrub: 1.5 for
 * cinematic inertia, ease: power2.out per segment for clean glides).
 * Scene boundaries are derived from each section's real scroll position,
 * and each transition completes early in its target scene, then HOLDS so
 * the character stays in the correct pose for the rest of that scene.
 * Boundaries are rebuilt on resize/load.
 *
 * Layers (nested so no two animations fight over one transform):
 *   .char-scroll – scroll-driven x/y/scale/rotateY/z/autoAlpha
 *   .char-float  – ambient time-based bob
 *   #character-img – the hi3.png cutout with a static cinematic filter
 *   #char-bubble  – speech bubble on its own translateZ(50px) depth layer
 *
 * The image responds ONLY to scrolling — zero reaction to cursor movement.
 * Container: position fixed, pointer-events none, z-index 10 — buttons and
 * project links always stay clickable.
 */
export default function CharacterLayer() {
  const rootRef = useRef<HTMLDivElement>(null);

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

        // Transition windows — each transition finishes early inside its
        // target scene, then the timeline HOLDS so the character keeps the
        // correct pose for the remainder of that scene:
        const tMoveEnd = tSkills + (tWork - tSkills) * 0.45;    // left→right glide done early in Scene 03
        const tFadeOutEnd = tWork + (tFocus - tWork) * 0.3;     // vanish right after Projects (04) enters
        const tFadeInEnd = tFocus + (tContact - tFocus) * 0.3;  // reappear right after Focus (05) enters
        const tContactOutEnd = tContact + (1 - tContact) * 0.35; // vanish shortly after Contact (06) enters

        tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        // ── Scene 01 → 02 — fade in on the LEFT ──────────────────────────
        // Hidden through all of Scene 01 (autoAlpha 0 = opacity 0 +
        // visibility hidden at scroll 0). Glides in as About approaches and
        // then HOLDS on the left for the entire Scene 02.
        tl.fromTo(
          CHAR,
          { x: -off - 60, rotateY: -14, z: 0, scale: 0.92, autoAlpha: 0 },
          { x: -off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1, duration: D(0, tAbout) },
          0
        );
        tl.fromTo(BUBBLE, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, Math.max(0, tAbout - 0.01));
        tl.add(() => setBubble({ lines: ["Hi! Code + Coffee ☕", "How can I help?"], side: "right" }), tAbout);
        // (tAbout → tSkills): HOLD — fully visible on the LEFT during Scene 02.

        // ── Scene 03 — glide LEFT → RIGHT, fully visible the whole time ──
        // The sweep happens inside Scene 03 (not Scene 02) and finishes
        // early; there is NO shrink and NO fade anywhere in Scene 03.
        tl.fromTo(
          CHAR,
          { x: -off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1 },
          { x: off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1, duration: D(tSkills, tMoveEnd) },
          tSkills
        );
        tl.add(() => setBubble({ lines: ["These are my weapons ⚔️", "Ready to build?"], side: "left" }), tSkills);
        // (tMoveEnd → tWork): HOLD — fully visible on the RIGHT for the rest
        // of Scene 03.

        // ── Scene 04 — vanish as Projects enters ─────────────────────────
        // Scales back into 3D space and fades out quickly after the Projects
        // section appears, so it never obstructs the project cards, and
        // stays COMPLETELY HIDDEN through the rest of Scene 04.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1 },
          { x: off * 0.5, rotateY: 4, z: -100, scale: 0.8, autoAlpha: 0, duration: D(tWork, tFadeOutEnd) },
          tWork
        );
        tl.fromTo(BUBBLE, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, Math.max(0, tWork - 0.01));
        // (tFadeOutEnd → tFocus): HOLD — completely hidden through the rest
        // of Scene 04.

        // ── Scene 05 — reappear on the RIGHT (right-to-left entrance) ────
        tl.fromTo(
          CHAR,
          { x: off + 100, rotateY: 8, z: -80, scale: 0.85, autoAlpha: 0 },
          { x: off, rotateY: -8, z: 0, scale: 1, autoAlpha: 1, duration: D(tFocus, tFadeInEnd) },
          tFocus
        );
        tl.fromTo(BUBBLE, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, Math.max(0, tFocus - 0.01));
        tl.add(() => setBubble({ lines: ["In the zone ✨", "Learning • Building • Growing"], side: "left" }), tFocus);
        // (tFadeInEnd → tContact): HOLD — fully visible on the right
        // through the rest of Scene 05.

        // ── Scene 06 — vanish as Contact enters ─────────────────────────
        // Fades out (and settles slightly) as the contact form and social
        // links come into view, so the contact area stays clear.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: -8, z: 0, scale: 1, autoAlpha: 1 },
          { x: off * 0.6, rotateY: 0, z: 0, scale: 0.95, autoAlpha: 0, duration: D(tContact, tContactOutEnd) },
          tContact
        );
        tl.fromTo(BUBBLE, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, Math.max(0, tContact - 0.01));
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

    return () => {
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
