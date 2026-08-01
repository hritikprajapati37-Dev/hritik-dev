# Hritik Prajapati — Cinematic Portfolio

A dark, crimson-gradient cinematic 3D portfolio built with Next.js 15 (App
Router), React Three Fiber, GSAP/ScrollTrigger, and @react-three/postprocessing.

The concept: the page is structured like a film reel. Each section is a
"SCENE," a fixed 3D camera flies through the space as you scroll, and a
timecode-style progress readout sits in the bottom-left corner the whole
way down.

## 1. Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. That's it — no environment variables required.

To build for production:

```bash
npm run build
npm start
```

> Note: `next/font` fetches Anton, Sora, and JetBrains Mono from Google
> Fonts at build time, so an internet connection is required to build.

## 2. Replace the hero image (do this first)

`/public/hero-figure.png` is currently a **placeholder silhouette** with a
crimson rim-glow effect baked in, just so the scene renders correctly out
of the box. Replace it with your real photo:

1. Take or choose a portrait — arms outstretched / profile pose works best,
   matching the "Arpit Kaushik 00:11" reference you described.
2. Cut the background out (remove.bg, Photoshop, or any background-removal
   tool) so you're left with a **transparent PNG**.
3. For the best result, edit in strong **crimson rim lighting** along your
   silhouette's edges before exporting — this is what makes the cutout
   blend into the 3D bloom/glow instead of looking pasted on.
4. Save it as `public/hero-figure.png` (or update the path in
   `lib/data.ts` → `profile.heroImage`).

The component (`components/canvas/HeroFigure.tsx`) automatically reads the
image's aspect ratio, so any reasonably tall portrait crop will work
without code changes.

## 3. Edit your content

Everything text/content-related lives in **`lib/data.ts`** — name, bio,
skills, tools, projects, contact links, and the "Currently Focused On"
items. You should not need to touch any component file just to update
copy.

Things marked `// TODO` in that file still need your real info:
- The 3 project entries are **drafted placeholders** — swap in your real
  titles, descriptions, images, and links once ready. Project images
  currently point at Unsplash URLs; swap for your own screenshots (drop
  files in `/public` and reference them, or keep external URLs — just add
  their domain to `next.config.mjs` → `images.remotePatterns`).

Testimonials were intentionally left out and replaced with a
**"Currently Focused On"** section, since a client-testimonial section
would be dishonest without real client work yet. Swap it back in later by
duplicating `components/sections/Learning.tsx` once you have real quotes.

## 4. Folder structure

```
app/
  layout.tsx        Fonts, metadata, root HTML shell
  page.tsx           Assembles the 3D scene + all sections, drives the
                      scroll-linked camera via GSAP ScrollTrigger
  globals.css        Base styles, film-grain overlay, scrollbar

components/
  canvas/             Everything inside the R3F <Canvas>
    Scene.tsx          Canvas setup, lighting, postprocessing stack
    CameraRig.tsx       Scroll-driven camera flythrough (waypoints)
    HeroFigure.tsx      The 2D cutout + rim-glow, billboarded to camera
    FloatingForms.tsx   Background wireframe geometric forms
    Embers.tsx          Ambient particle system
  sections/           One file per page section (Hero, About, Skills,
                      Projects, Learning) — plain DOM, scrolls
                      on top of the fixed 3D canvas
  ui/
    Loader.tsx          Full-screen loading screen (asset load progress)
    SceneHeading.tsx     "SCENE 0X" heading used at the top of sections
    ProgressRail.tsx     Fixed bottom-left timecode/progress readout

lib/
  data.ts             ALL editable content — start here
  gsap.ts             GSAP + ScrollTrigger registration (client-only)
  scrollProgress.ts   Shared scroll-progress store (see below)
  useScrollReveal.ts  Reusable fade-up-on-scroll hook for section text

public/
  hero-figure.png     Placeholder hero cutout — replace this
```

## 5. How the scroll-driven camera works

`app/page.tsx` creates a single `ScrollTrigger` spanning the whole
document. On every scroll tick it writes a 0→1 progress value into a
plain object in `lib/scrollProgress.ts` (not React state — see the
comment in that file for why). `CameraRig.tsx` reads that value every
frame inside the R3F render loop and lerps the camera between six
waypoints, one per section. `ProgressRail.tsx` polls the same value on
`requestAnimationFrame` to drive the on-screen timecode.

To change the camera path, edit the `WAYPOINTS` array in
`components/canvas/CameraRig.tsx`.

## 6. Performance notes (especially mobile)

- `Canvas` caps `dpr` at `[1, 1.75]` — full retina pixel ratio combined
  with Bloom + grain post-processing is the single biggest mobile GPU
  cost, so this is intentionally capped rather than left at device max.
- Post-processing (`EffectComposer`) runs with `multisampling={0}` — MSAA
  and a heavy Bloom pass together are redundant and expensive; this
  relies on Bloom's own blur instead.
- The film-grain texture is CSS-only (`.film-grain` in `globals.css`) for
  the DOM layer, layered with a lightweight postprocessing `Noise` pass
  for the canvas — cheaper than a second full-screen WebGL grain layer.
- Particle count (`Embers.tsx`) and floating-form count
  (`FloatingForms.tsx`) are both modest by default; reduce `COUNT` /
  `FORMS` further if you see frame drops on low-end devices.
- All scroll-triggered text reveals respect `prefers-reduced-motion`
  (see `globals.css`).

## 7. Customizing the look

- **Colors**: `tailwind.config.ts` → `colors.crimson.*`, `colors.void`,
  `colors.ash`, `colors.bone`. Every red in the site traces back to these
  four tokens.
- **Fonts**: `app/layout.tsx` — currently Anton (display), Sora (body),
  JetBrains Mono (labels/timecode). Swap any of the three via
  `next/font/google`.
- **Bloom / grain intensity**: `components/canvas/Scene.tsx` →
  `<Bloom intensity>`, `<Noise opacity>`, `<Vignette darkness>`.
