"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * A scattered cloud of glowing particles converges into the "</>" code
 * glyph — chaos resolving into structure, which is the whole Lumen pitch
 * (idea -> organized digital product) rendered literally. Once assembled
 * it keeps a small idle drift plus slow rotation and light pointer
 * parallax so it reads as alive, not a static logo.
 */

const GLOW_COLOR = new THREE.Color("#249e6b"); // muted brand emerald, not a saturated neon mint — glows via bloom without looking artificial
const PARTICLE_COUNT = 640;
const CONVERGE_SECONDS = 1.1;
const GLYPH_SCALE = 1.6; // glyph footprint, scaled up now the canvas is full-bleed instead of a small box

/** Evenly-spaced points along a polyline through the given vertices. */
function sampleAlongPath(vertices: [number, number][], count: number): [number, number][] {
  const segments: { a: [number, number]; b: [number, number]; length: number }[] = [];
  let total = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    const a = vertices[i];
    const b = vertices[i + 1];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segments.push({ a, b, length });
    total += length;
  }
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const target = (i / (count - 1)) * total;
    let acc = 0;
    for (const seg of segments) {
      if (target <= acc + seg.length || seg === segments[segments.length - 1]) {
        const t = seg.length === 0 ? 0 : (target - acc) / seg.length;
        points.push([seg.a[0] + (seg.b[0] - seg.a[0]) * t, seg.a[1] + (seg.b[1] - seg.a[1]) * t]);
        break;
      }
      acc += seg.length;
    }
  }
  return points;
}

/** The "</>" glyph as three polylines: left chevron, slash, right chevron. */
function buildCodeGlyphTargets(count: number): Float32Array {
  const leftChevron: [number, number][] = [
    [-0.55 * GLYPH_SCALE, 0.55 * GLYPH_SCALE],
    [-1.35 * GLYPH_SCALE, 0],
    [-0.55 * GLYPH_SCALE, -0.55 * GLYPH_SCALE],
  ];
  const slash: [number, number][] = [
    [-0.28 * GLYPH_SCALE, -0.75 * GLYPH_SCALE],
    [0.28 * GLYPH_SCALE, 0.75 * GLYPH_SCALE],
  ];
  const rightChevron: [number, number][] = [
    [0.55 * GLYPH_SCALE, 0.55 * GLYPH_SCALE],
    [1.35 * GLYPH_SCALE, 0],
    [0.55 * GLYPH_SCALE, -0.55 * GLYPH_SCALE],
  ];

  // Split the particle budget proportional to each stroke's own length so
  // density stays even across the whole glyph instead of bunching up.
  const pathLength = (v: [number, number][]) =>
    v.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - v[i][0], p[1] - v[i][1]), 0);
  const lengths = [pathLength(leftChevron), pathLength(slash), pathLength(rightChevron)];
  const totalLength = lengths.reduce((a, b) => a + b, 0);
  const counts = lengths.map((l) => Math.max(2, Math.round((l / totalLength) * count)));

  const flat2D = [
    ...sampleAlongPath(leftChevron, counts[0]),
    ...sampleAlongPath(slash, counts[1]),
    ...sampleAlongPath(rightChevron, counts[2]),
  ];

  const targets = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y] = flat2D[i % flat2D.length];
    targets[i * 3] = x + (Math.random() - 0.5) * 0.03;
    targets[i * 3 + 1] = y + (Math.random() - 0.5) * 0.03;
    targets[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
  }
  return targets;
}

function randomPhases(count: number): Float32Array {
  return Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2);
}

function scatteredOrigins(count: number): Float32Array {
  // A wide, uniform box roughly matching the 3D band's visible frustum —
  // it's a short, wide strip now rather than a full square viewport, so
  // origins spread further horizontally than vertically.
  const origins = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    origins[i * 3] = (Math.random() - 0.5) * 13;
    origins[i * 3 + 1] = (Math.random() - 0.5) * 4;
    origins[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
  }
  return origins;
}

function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function ParticleGlyph({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const reduceMotion = useReducedMotion();
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const progress = useRef(reduceMotion ? 1 : 0);
  const phases = useMemo(() => randomPhases(PARTICLE_COUNT), []);

  const targets = useMemo(() => buildCodeGlyphTargets(PARTICLE_COUNT), []);
  const origins = useMemo(() => scatteredOrigins(PARTICLE_COUNT), []);
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const start = reduceMotion ? targets : origins;
    arr.set(start);
    return arr;
  }, [origins, targets, reduceMotion]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(({ clock }, delta) => {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / CONVERGE_SECONDS);
      const eased = easeOutExpo(progress.current);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        arr[ix] = origins[ix] + (targets[ix] - origins[ix]) * eased;
        arr[ix + 1] = origins[ix + 1] + (targets[ix + 1] - origins[ix + 1]) * eased;
        arr[ix + 2] = origins[ix + 2] + (targets[ix + 2] - origins[ix + 2]) * eased;
      }
      posAttr.needsUpdate = true;
    } else if (!reduceMotion) {
      // Settled — a livelier drift around each particle's resting spot.
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const jitter = Math.sin(t * 2.2 + phases[i]) * 0.05;
        arr[ix] = targets[ix] + jitter;
        arr[ix + 1] = targets[ix + 1] + Math.cos(t * 1.8 + phases[i]) * 0.05;
        arr[ix + 2] = targets[ix + 2] + jitter;
      }
      posAttr.needsUpdate = true;
    }

    const g = groupRef.current;
    if (!g) return;
    if (!reduceMotion) {
      g.rotation.y += delta * 0.25;
    }
    const targetX = pointer.current.y * 0.22;
    const targetZ = -pointer.current.x * 0.22;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.rotation.z += (targetZ - g.rotation.z) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial color={GLOW_COLOR} size={0.075} sizeAttenuation transparent opacity={1} toneMapped={false} />
      </points>
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
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <ParticleGlyph pointer={pointer} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.65} intensity={1} mipmapBlur radius={0.45} />
      </EffectComposer>
    </Canvas>
  );
}
