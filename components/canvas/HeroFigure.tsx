"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollProgress";

// Builds a soft radial-gradient texture at runtime for the rim-glow disc
// behind the portrait — cheaper than an image asset, and tintable in code.
function useGlowTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,60,80,0.9)");
    gradient.addColorStop(0.4, "rgba(255,30,55,0.45)");
    gradient.addColorStop(1, "rgba(255,30,55,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// How much the square crop is nudged upward inside the photo, so the face
// sits nicely inside the circle for typical portrait compositions. Tweak
// (or set to 0 for a pure center crop) to taste.
const CROP_BIAS = 0.06;

export default function HeroFigure({ imageUrl }: { imageUrl: string }) {
  const group = useRef<THREE.Group>(null);
  const glowTex = useGlowTexture();

  // useTexture suspends until the image loads — wrap this component
  // in <Suspense> (done in Scene.tsx) so the rest of the scene isn't blocked.
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Derive the photo aspect ratio so the circle can show a square
  // center-crop of the portrait without stretching it.
  const image = texture.image as { width?: number; height?: number } | undefined;
  const aspect = image?.width && image?.height ? image.width / image.height : 0.75;

  const { circleGeo, frameGeo } = useMemo(() => {
    // Circle in the XY plane (radius 1) — UVs are remapped below from the
    // full texture to a square crop, so the circular portrait never distorts.
    const circle = new THREE.CircleGeometry(1, 128);
    const uv = circle.attributes.uv as THREE.BufferAttribute;

    // Square crop region in UV space: u always spans 0..1, v is cropped for
    // portrait photos (aspect < 1); a landscape photo (aspect > 1) crops u.
    let u0 = 0;
    let u1 = 1;
    let v0 = (1 - Math.min(aspect, 1)) / 2 - CROP_BIAS;
    let v1 = 1 - (1 - Math.min(aspect, 1)) / 2 - CROP_BIAS;

    if (aspect > 1) {
      u0 = (1 - 1 / aspect) / 2;
      u1 = 1 - u0;
      v0 = 0;
      v1 = 1;
    }

    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
    }
    uv.needsUpdate = true;

    // Thin crimson ring — the "perfect circular frame" around the portrait.
    const frame = new THREE.RingGeometry(1.045, 1.12, 128);

    return { circleGeo: circle, frameGeo: frame };
  }, [aspect]);

  // Fixed visual weight (same height as the previous cutout), circle fits
  // the portrait's shorter side so nothing is stretched.
  const diameter = 4.4;
  const scale = diameter / 2;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle idle float, independent of scroll.
    group.current.position.y = Math.sin(t * 0.6) * 0.12;

    // Subtle scale-up as the user scrolls into the hero — the "dramatic
    // reveal" beat called out in the brief, then settles as they scroll past.
    const heroProgress = THREE.MathUtils.clamp(scrollState.progress * 6, 0, 1);
    const s = 1 + heroProgress * 0.06;
    group.current.scale.setScalar(s);
  });

  return (
    <Billboard follow position={[0, -0.3, 0]}>
      <group ref={group}>
        {/* Rim-glow disc, sits slightly behind the portrait, additive blend */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[diameter * 1.9, diameter * 1.9]} />
          <meshBasicMaterial
            map={glowTex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* The circular portrait itself */}
        <mesh geometry={circleGeo} scale={scale}>
          <meshBasicMaterial map={texture} transparent depthWrite={false} />
        </mesh>

        {/* The circular frame — crimson ring, picked up by the bloom pass */}
        <mesh geometry={frameGeo} scale={scale} position={[0, 0, 0.01]}>
          <meshBasicMaterial
            color="#ff2f47"
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Billboard>
  );
}
