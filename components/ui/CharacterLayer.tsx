"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Single fixed character layer — ONE global <img id="hi3-img"> (hi3.png)
 * pinned to the viewport, gliding between scenes with GSAP 3D transforms.
 *
 * Visibility is guarded at THREE levels so the avatar can never flash:
 *   1. globals.css sets #hi3-img { opacity:0 !important; visibility:
 *      hidden !important; pointer-events:none } by default (Scene 01).
 *   2. The .char-scroll wrapper ships with opacity-0 invisible
 *      pointer-events-none Tailwind classes (pre-hydration).
 *   3. GSAP autoAlpha takes over opacity/visibility on the wrapper for the
 *      scrubbed scene fades; .char-scroll.is-active (toggled by the
 *      ScrollTrigger onUpdate once scroll leaves the very top) un-hides
 *      the image's own !important rules.
 *
 * The image (#hi3-img) and the speech bubble (#char-bubble) are treated as
 * ONE UNIT: opacity/visibility is animated ONLY on the .char-scroll
 * wrapper (autoAlpha), and the bubble inherits it — so both always fade,
 * move, and appear in perfect sync. The bubble's own autoAlpha is set to 1
 * at the first fade-in start and never touched again.
 *
 * Scene keyframes are FIXED progress values that match the bottom-left
 * progress indicator exactly (HERO 0–20 · ABOUT 20–38 · SKILLS 38–58 ·
 * WORK 58–75 · FOCUS 75–90 · CONTACT 90–100) — no element position math:
 *   0.00 → 0.20  HERO    — COMPLETELY HIDDEN (never visible on load)
 *   0.20 → 0.25  ABOUT   — fade in together on the LEFT
 *   0.25 → 0.38  ABOUT   — stationary, fully visible on the LEFT
 *   0.38 → 0.46  SKILLS  — glide LEFT→RIGHT, text swap at 38%
 *   0.46 → 0.58  SKILLS  — stationary, fully visible on the RIGHT
 *   0.58 → 0.64  WORK    — fade out completely (gone by 64%)
 *   0.64 → 0.75  WORK    — remain hidden
 *   0.75 → 0.80  FOCUS   — fade back in on the RIGHT
 *   0.80 → 0.90  FOCUS   — stationary, fully visible on the RIGHT
 *   0.90 → 0.95  CONTACT — fade out completely (gone by 95%)
 *   0.95 → 1.00  CONTACT — remain hidden
 *
 * One master timeline scrubbed across the whole document (scrub: 1,
 * invalidateOnRefresh: true, ease: power2.out per segment). Because the
 * timeline is fully scrubbed, scrolling backwards seamlessly plays every
 * step in reverse. Transitions complete early inside their target scene,
 * then HOLD so the character keeps the correct pose for the rest of it.
 * The timeline is rebuilt on resize, window load, document.fonts.ready,
 * and an 800ms post-mount sweep — so hard refreshes never leave stale
 * state.
 *
 * Layers (nested so no two animations fight over one transform):
 *   .char-scroll – scroll-driven x/y/scale/rotateY/z/autoAlpha
 *   .char-float  – ambient time-based bob
 *   #hi3-img     – the hi3.png cutout with a static cinematic filter
 *   #char-bubble – speech bubble on its own translateZ(50px) depth layer
 *
 * The image responds ONLY to scrolling — there are NO cursor/mousemove
 * listeners attached anywhere in this component.
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
      // Starts hidden (Scene 01 / Hero). The DOM also carries a CSS initial
      // state (opacity-0 invisible pointer-events-none on .char-scroll) so
      // the image is hidden even before this JS runs; autoAlpha here takes
      // over opacity + visibility for the rest of the page. Position/scale
      // are left to the timeline's fromTo at progress 0 — no stale values.
      gsap.set(CHAR, { autoAlpha: 0, transformPerspective: 1000 });
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

        if (document.documentElement.scrollHeight <= window.innerHeight) return;

        const off = window.innerWidth >= 1024 ? 300 : 70; // side travel (px)

        // ── FIXED PROGRESS KEYFRAMES (scene-aligned) ─────────────────────
        // Scene boundaries match the bottom-left indicator exactly:
        //   HERO 0–20 · ABOUT 20–38 · SKILLS 38–58 · WORK 58–75 ·
        //   FOCUS 75–90 · CONTACT 90–100.
        // The image + bubble are visible ONLY in ABOUT, SKILLS, and FOCUS;
        // they are completely hidden in HERO, WORK, and CONTACT.
        const tAbout = 0.2;        // About begins — fade-in starts here
        const tFadeIn1End = 0.25;  // fully visible on the LEFT by 25%
        const tSkills = 0.38;      // Skills begins — left→right glide starts
        const tMoveEnd = 0.46;     // fully on the RIGHT by 46%
        const tWork = 0.58;        // Work begins — fade-out starts here
        const tFadeOut1End = 0.64; // completely gone by 64% (early Work)
        const tFocus = 0.75;       // Focus begins — fade-in starts here
        const tFadeIn2End = 0.8;   // fully visible on the RIGHT by 80%
        const tContact = 0.9;      // Contact begins — fade-out starts here
        const tFadeOut2End = 0.95; // completely gone by 95%

        tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1, // tied to scroll: forward AND reverse play seamlessly
            invalidateOnRefresh: true, // re-capture fromTo values on refresh
            onUpdate: (self) => {
              // Once scroll leaves the very top, un-hide #hi3-img via
              // .is-active (its CSS default is opacity/visibility hidden
              // with !important). This is only the pre-hydration flash
              // guard — scene visibility itself is driven by the wrapper's
              // scrubbed autoAlpha, so image + bubble always stay in sync.
              const scrollEl = root.querySelector(".char-scroll");
              scrollEl?.classList.toggle("is-active", self.progress > 0.0001);
            },
          },
        });

        // ── Scene 01 (0 → 0.20) HERO — COMPLETELY HIDDEN ─────────────────
        // The set at time 0 pins the whole unit (image + bubble, both inside
        // .char-scroll) to autoAlpha 0 — nothing animates through the whole
        // Hero scene, on page load, or on refresh.
        tl.set(
          CHAR,
          { x: -off - 60, rotateY: -14, z: 0, scale: 0.92, autoAlpha: 0 },
          0
        );

        // ── Scene 02 (0.20 → 0.38) ABOUT — fade in together on the LEFT ──
        // The pair fades in as About begins and is fully visible and
        // correctly positioned by 25%, then holds for the rest of the scene.
        tl.fromTo(
          CHAR,
          { x: -off - 60, rotateY: -14, z: 0, scale: 0.92, autoAlpha: 0 },
          { x: -off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1, duration: tFadeIn1End - tAbout },
          tAbout
        );
        // From the fade-in start on, the bubble's own opacity is 1 and it
        // rides the wrapper's autoAlpha — image + bubble fade as one unit.
        tl.set(BUBBLE, { autoAlpha: 1 }, tAbout);
        tl.add(() => setBubble({ lines: ["Hi! Code + Coffee ☕", "How can I help?"], side: "right" }), tAbout);
        // (0.25 → 0.38): HOLD — fully visible and stationary on the LEFT.

        // ── Scene 03 (0.38 → 0.58) SKILLS — glide LEFT → RIGHT ───────────
        // The pair sweeps to the right across the 38–46% band; the text
        // swaps at the exact moment the move begins. autoAlpha stays 1
        // throughout the Skills scene.
        tl.fromTo(
          CHAR,
          { x: -off, rotateY: -10, z: 30, scale: 1, autoAlpha: 1 },
          { x: off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1, duration: tMoveEnd - tSkills },
          tSkills
        );
        tl.add(() => setBubble({ lines: ["These are my weapons ⚔️", "Ready to build?"], side: "left" }), tSkills);
        // (0.46 → 0.58): HOLD — fully visible on the RIGHT.

        // ── Scene 04 (0.58 → 0.75) WORK — fade out completely ────────────
        // Scales back into 3D space and fades out as Work begins — gone by
        // 64% and hidden through the whole Work scene, so it never
        // obstructs the project cards.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: 10, z: 30, scale: 1, autoAlpha: 1 },
          { x: off * 0.5, rotateY: 4, z: -100, scale: 0.8, autoAlpha: 0, duration: tFadeOut1End - tWork },
          tWork
        );
        // (0.64 → 0.75): HOLD — completely hidden (image AND bubble).

        // ── Scene 05 (0.75 → 0.90) FOCUS — fade back in on the RIGHT ─────
        // Fully visible and settled by 80%, then holds for the rest of the
        // Focus scene.
        tl.fromTo(
          CHAR,
          { x: off + 100, rotateY: 8, z: -80, scale: 0.85, autoAlpha: 0 },
          { x: off, rotateY: -8, z: 0, scale: 1, autoAlpha: 1, duration: tFadeIn2End - tFocus },
          tFocus
        );
        tl.add(() => setBubble({ lines: ["In the zone ✨", "Learning • Building • Growing"], side: "left" }), tFocus);
        // (0.80 → 0.90): HOLD — fully visible on the RIGHT.

        // ── Scene 06 (0.90 → 1.00) CONTACT — fade out completely ─────────
        // Vanishes as the contact form and social links come into view —
        // gone by 95% and hidden through the rest of the page.
        tl.fromTo(
          CHAR,
          { x: off, rotateY: -8, z: 0, scale: 1, autoAlpha: 1 },
          { x: off * 0.6, rotateY: 0, z: 0, scale: 0.95, autoAlpha: 0, duration: tFadeOut2End - tContact },
          tContact
        );
        // (0.95 → 1.00): HOLD — remain hidden.
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

      // Recalculate scene boundaries after all fonts AND images have loaded
      // — prevents stale positions on hard refresh if late assets shift the
      // layout (scene tops move → the avatar would appear at the wrong spot).
      let disposed = false;
      const refreshWhenReady = () => {
        if (disposed) return;
        ScrollTrigger.refresh();
        build();
      };
      if (document.fonts && "ready" in document.fonts) {
        document.fonts.ready.then(refreshWhenReady);
      }
      // Fallback sweep shortly after mount catches late images/layout too.
      const sweepTimer = window.setTimeout(refreshWhenReady, 800);

      return () => {
        disposed = true;
        window.clearTimeout(sweepTimer);
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
      {/* Initial CSS state: opacity 0, visibility hidden, pointer-events none
          — guarantees hi3-img is invisible on page load / Scene 01 even before
          GSAP hydrates. GSAP autoAlpha (inline styles) takes over from here. */}
      <div
        className="char-scroll pointer-events-none invisible relative opacity-0"
        style={{ transformStyle: "preserve-3d" }}
      >
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
            id="hi3-img"
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

        {/* Speech bubble — own depth layer (translateZ 50px), follows the
            character. Its opacity is 1 from the first fade-in start on and it
            inherits the wrapper's scrubbed autoAlpha, so it fades in and out
            in perfect sync with #hi3-img (one unit). */}
        <div
          id="char-bubble"
          className={`absolute top-[6%] z-10 ${
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
