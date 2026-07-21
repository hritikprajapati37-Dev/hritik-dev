"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollProgress";

// Builds a soft radial-gradient texture at runtime for the rim-glow disc
// behind the cutout — cheaper than an image asset, and tintable in code.
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

export default function HeroFigure({ imageUrl }: { imageUrl: string }) {
  const group = useRef<THREE.Group>(null);
  const glowTex = useGlowTexture();

  // useTexture suspends until the image loads — wrap this component
  // in <Suspense> (done in Scene.tsx) so the rest of the scene isn't blocked.
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Derive a sane plane aspect ratio from the loaded image so the cutout
  // doesn't stretch, whatever size PNG gets dropped in /public.
  const image = texture.image as { width?: number; height?: number } | undefined;
  const aspect = image?.width && image?.height ? image.width / image.height : 0.75;
  const height = 4.4;
  const width = height * aspect;

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
        {/* Rim-glow disc, sits slightly behind the cutout, additive blend */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[width * 1.8, height * 1.8]} />
          <meshBasicMaterial
            map={glowTex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* The cutout itself */}
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} transparent depthWrite={false} />
        </mesh>
      </group>
    </Billboard>
  );
}
