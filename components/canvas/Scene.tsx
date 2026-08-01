"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  EffectComposer,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Embers from "./Embers";
import FloatingForms from "./FloatingForms";

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      className="!fixed inset-0 !h-screen !w-screen"
    >
      <color attach="background" args={["#050208"]} />
      <fog attach="fog" args={["#050208", 6, 14]} />

      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#fbeaec" />
      <pointLight position={[-3, 1, -2]} intensity={12} color="#ff2f47" distance={10} />
      <pointLight position={[2, -2, -1]} intensity={4} color="#7a0d1f" distance={8} />
      <ambientLight intensity={0.08} />

      <CameraRig />
      <FloatingForms />
      <Embers />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0009, 0.0009)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.15} darkness={1.1} />
        <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.06} />
      </EffectComposer>
    </Canvas>
  );
}
