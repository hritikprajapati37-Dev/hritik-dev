"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollProgress";

// One waypoint per section. Position is where the camera sits,
// look is what it points at. Add/remove entries to match your section count —
// CameraRig interpolates smoothly between whichever waypoints exist.
const WAYPOINTS: { position: [number, number, number]; look: [number, number, number] }[] = [
  { position: [0, 0, 6], look: [0, 0, 0] },        // Hero
  { position: [1.4, -0.3, 5], look: [-0.4, 0, 0] }, // About
  { position: [-1.6, 0.4, 5.4], look: [0.5, -0.2, 0] }, // Skills
  { position: [0.8, 0.8, 6.2], look: [-0.3, 0.1, 0] },  // Projects
  { position: [-1, -0.6, 5.6], look: [0.4, 0.3, 0] },   // Learning
];

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const currentLook = new THREE.Vector3(0, 0, 0);

export default function CameraRig() {
  const { camera } = useThree();
  const eased = useRef(0);

  useFrame(() => {
    // Smooth the raw scroll progress so camera motion never feels stepped.
    eased.current += (scrollState.progress - eased.current) * 0.06;
    const p = eased.current * (WAYPOINTS.length - 1);
    const i = Math.min(Math.floor(p), WAYPOINTS.length - 2);
    const t = p - i;

    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];

    tmpPos.set(
      THREE.MathUtils.lerp(a.position[0], b.position[0], t),
      THREE.MathUtils.lerp(a.position[1], b.position[1], t),
      THREE.MathUtils.lerp(a.position[2], b.position[2], t)
    );
    tmpLook.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], t),
      THREE.MathUtils.lerp(a.look[1], b.look[1], t),
      THREE.MathUtils.lerp(a.look[2], b.look[2], t)
    );

    camera.position.lerp(tmpPos, 0.15);
    currentLook.lerp(tmpLook, 0.15);
    camera.lookAt(currentLook);
  });

  return null;
}
