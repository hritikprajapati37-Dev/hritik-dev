"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type FormDef = {
  position: [number, number, number];
  geometry: "icosahedron" | "torus" | "octahedron";
  scale: number;
  speed: number;
};

const FORMS: FormDef[] = [
  { position: [-3.2, 1.4, -3], geometry: "icosahedron", scale: 0.55, speed: 0.3 },
  { position: [3.4, -1.2, -4], geometry: "torus", scale: 0.7, speed: 0.22 },
  { position: [-2.6, -1.8, -2.5], geometry: "octahedron", scale: 0.4, speed: 0.4 },
  { position: [2.8, 2, -3.5], geometry: "icosahedron", scale: 0.35, speed: 0.35 },
  { position: [0.5, -2.6, -5], geometry: "octahedron", scale: 0.6, speed: 0.18 },
];

function Form({ def }: { def: FormDef }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * def.speed * 0.4;
    ref.current.rotation.y = t * def.speed;
    ref.current.position.y = def.position[1] + Math.sin(t * def.speed + def.position[0]) * 0.25;
  });

  const geo =
    def.geometry === "icosahedron" ? (
      <icosahedronGeometry args={[1, 0]} />
    ) : def.geometry === "torus" ? (
      <torusGeometry args={[0.8, 0.25, 16, 64]} />
    ) : (
      <octahedronGeometry args={[1, 0]} />
    );

  return (
    <mesh ref={ref} position={def.position} scale={def.scale}>
      {geo}
      <meshStandardMaterial
        color="#3a0710"
        emissive="#b3122b"
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

export default function FloatingForms() {
  return (
    <>
      {FORMS.map((def, i) => (
        <Form key={i} def={def} />
      ))}
    </>
  );
}
