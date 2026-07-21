// A plain mutable object, not React state. GSAP's ScrollTrigger writes to it
// on every scroll tick; the R3F render loop (useFrame) reads it every frame.
// Keeping this outside React state avoids re-rendering the whole component
// tree 60x/second while scrolling — the Canvas reads it directly instead.
export const scrollState = {
  progress: 0, // 0 → 1 across the whole page
};
