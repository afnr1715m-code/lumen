"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * The real 3D evolution of the flat network-diagram SVG that used to sit
 * here: the same "hub + orbiting nodes" shape, now an actual floating,
 * glowing constellation — Lumen's light motif rendered as light, not just
 * implied by a blurred CSS blob. This is the one deliberately expensive
 * effect on the site; everywhere else stays quiet by comparison.
 */

const GLOW_COLOR = "#34d399"; // brighter emerald than the flat UI accent — bloom needs headroom to read as "glowing," not just "green"
const HUB_GLOW_COLOR = "#6ee7b7";
const LINE_COLOR = "#0a6e3d";

type Node = { position: [number, number, number]; isHub?: boolean };

const NODES: Node[] = [
  { position: [0, 0, 0], isHub: true },
  { position: [0, 1.9, -0.3] },
  { position: [-1.8, 0.5, 0.4] },
  { position: [1.8, 0.5, -0.4] },
  { position: [-1.0, -1.4, 0.5] },
  { position: [1.0, -1.4, -0.5] },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [2, 4],
  [3, 5],
];

function useReducedMotion() {
  // This component only ever renders client-side (dynamic import, ssr:
  // false), so matchMedia is safe even during the lazy initializer.
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function NodeSphere({ node }: { node: Node }) {
  const ref = useRef<THREE.Mesh>(null);
  const reduceMotion = useReducedMotion();

  useFrame(({ clock }) => {
    if (!node.isHub || !ref.current || reduceMotion) return;
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 2.2) * 0.12;
    ref.current.scale.setScalar(s);
  });

  const size = node.isHub ? 0.16 : 0.09;

  return (
    <mesh ref={ref} position={node.position}>
      <sphereGeometry args={[size, 20, 20]} />
      <meshBasicMaterial color={node.isHub ? HUB_GLOW_COLOR : GLOW_COLOR} toneMapped={false} />
    </mesh>
  );
}

function Constellation({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion = useReducedMotion();

  const edgePairs = useMemo(
    () =>
      EDGES.map(([a, b]) => [
        new THREE.Vector3(...NODES[a].position),
        new THREE.Vector3(...NODES[b].position),
      ] as [THREE.Vector3, THREE.Vector3]),
    []
  );

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (!reduceMotion) {
      g.rotation.y += delta * 0.12;
    }
    const targetX = pointer.current.y * 0.25;
    const targetZ = -pointer.current.x * 0.25;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
    g.rotation.z += (targetZ - g.rotation.z) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {edgePairs.map((points, i) => (
        <Line key={i} points={points} color={LINE_COLOR} transparent opacity={0.5} lineWidth={1} />
      ))}
      {NODES.map((node, i) => (
        <NodeSphere key={i} node={node} />
      ))}
    </group>
  );
}

export default function HeroScene3D() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <Constellation pointer={pointer} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={1.1} mipmapBlur radius={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
