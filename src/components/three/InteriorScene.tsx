"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Group } from "three";
import SceneBoundary from "../SceneBoundary";

type Props = { interactive?: boolean; spin?: boolean };

const COL = {
  floor: "#caa56f",
  wallCream: "#efe7d6",
  navy: "#1f2a44",
  navySoft: "#26324f",
  rug: "#26324f",
  gold: "#c6a75e",
  fabric: "#ddcbb0",
  fabric2: "#cdb89a",
  cushion: "#c2a98a",
  cream: "#e8dcc8",
  plant: "#6f8163",
  plantDk: "#5c6e52",
  glass: "#cfe0ee",
  terra: "#a9663f",
};

// A real interior photo, mapped onto the back-wall artwork.
const ART_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=70";

function WallArt() {
  const tex = useTexture(ART_IMG);
  tex.colorSpace = SRGBColorSpace;
  return (
    <mesh position={[-0.55, 1.55, -2.11]}>
      <planeGeometry args={[0.92, 0.62]} />
      <meshStandardMaterial map={tex} roughness={0.55} metalness={0} />
    </mesh>
  );
}

function PlainArt() {
  return (
    <mesh position={[-0.55, 1.55, -2.12]}>
      <boxGeometry args={[0.9, 0.6, 0.03]} />
      <meshStandardMaterial color={COL.navySoft} roughness={0.7} />
    </mesh>
  );
}

/* A small stack of colourful books. */
function Books({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const cols = [COL.navy, COL.gold, COL.cream, COL.terra, COL.navySoft];
  return (
    <group position={position} rotation={rotation}>
      {cols.map((c, i) => (
        <mesh key={i} position={[i * 0.07, 0.11, 0]} rotation={[0, 0, i % 2 ? 0.04 : -0.03]} castShadow>
          <boxGeometry args={[0.055, 0.22, 0.17]} />
          <meshStandardMaterial color={c} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* Four gold furniture legs at the corners of a w×d footprint. */
function GoldLegs({ w, d, h, y = 0 }: { w: number; d: number; h: number; y?: number }) {
  const x = w / 2 - 0.06;
  const z = d / 2 - 0.06;
  return (
    <>
      {[
        [-x, z],
        [x, z],
        [-x, -z],
        [x, -z],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, y + h / 2, pz]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, h, 12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
    </>
  );
}

/**
 * A detailed isometric "dollhouse" living room — floor + two cutaway walls with
 * a full furniture set, window, mirror, lighting and décor, in the brand palette.
 * Slow auto-rotates + leans to the cursor (unless OrbitControls drives it).
 */
export default function InteriorScene({ interactive = true, spin = true }: Props) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { pointer, clock } = state;
    if (spin) {
      // Sway back and forth within a limited arc — never spins to the wall backs.
      const targetY = Math.sin(clock.elapsedTime * 0.3) * 0.45;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.04;
      const tiltX = interactive ? -pointer.y * 0.12 : 0;
      const tiltZ = interactive ? pointer.x * 0.08 : 0;
      group.current.rotation.x += (tiltX - group.current.rotation.x) * 0.05;
      group.current.rotation.z += (tiltZ - group.current.rotation.z) * 0.05;
    }
    void delta;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* ===================== Shell ===================== */}
      {/* Floor — larger than the walls so wall faces are never coplanar with floor edges */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.12, 4.8]} />
        <meshStandardMaterial color={COL.floor} roughness={0.9} metalness={0} />
      </mesh>
      {/* Back wall (cream) — sits ON the floor (bottom at y=0), inset from floor edges */}
      <mesh position={[0, 1.3, -2.24]} receiveShadow>
        <boxGeometry args={[4.5, 2.6, 0.12]} />
        <meshStandardMaterial color={COL.wallCream} roughness={0.95} />
      </mesh>
      {/* Left wall (navy) — butts the back wall's front face, no overlap */}
      <mesh position={[-2.24, 1.3, 0.035]} receiveShadow>
        <boxGeometry args={[0.12, 2.6, 4.43]} />
        <meshStandardMaterial color={COL.navy} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Gold baseboards (in front of the walls, on the floor) */}
      <mesh position={[0, 0.06, -2.15]}>
        <boxGeometry args={[4.4, 0.12, 0.04]} />
        <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-2.15, 0.06, 0.05]}>
        <boxGeometry args={[0.04, 0.12, 4.3]} />
        <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ===================== Window (back wall, right) ===================== */}
      <group position={[1.15, 1.55, -2.16]}>
        {/* sky/view */}
        <mesh>
          <planeGeometry args={[1.45, 1.5]} />
          <meshStandardMaterial color={COL.glass} emissive={COL.glass} emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
        {/* gold frame + mullions */}
        {[
          [0, 0.78, 1.6, 0.06],
          [0, -0.78, 1.6, 0.06],
          [-0.76, 0, 0.06, 1.62],
          [0.76, 0, 0.06, 1.62],
          [0, 0, 1.5, 0.04],
          [0, 0, 0.04, 1.5],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.03]}>
            <boxGeometry args={[w, h, 0.05]} />
            <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ===================== Wall art (left of window) ===================== */}
      <mesh position={[-0.55, 1.55, -2.14]}>
        <boxGeometry args={[1.06, 0.76, 0.04]} />
        <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
      </mesh>
      <SceneBoundary fallback={<PlainArt />}>
        <Suspense fallback={<PlainArt />}>
          <WallArt />
        </Suspense>
      </SceneBoundary>
      {/* small framed print above */}
      <mesh position={[0.35, 2.18, -2.14]}>
        <boxGeometry args={[0.42, 0.34, 0.04]} />
        <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Round mirror on the left wall */}
      <group position={[-2.12, 1.45, 0.85]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[0.42, 0.04, 20, 60]} />
          <meshStandardMaterial color={COL.gold} roughness={0.25} metalness={0.95} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.42, 48]} />
          <meshStandardMaterial color={COL.glass} metalness={0.6} roughness={0.15} emissive={COL.navySoft} emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* ===================== Pendant light (over coffee table) ===================== */}
      <group position={[0.0, 0, -0.1]}>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.1, 8]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.42, 0]}>
          <coneGeometry args={[0.26, 0.3, 24, 1, true]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} side={2} />
        </mesh>
        <mesh position={[0, 1.34, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={COL.cream} emissive={COL.cream} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ===================== Rug ===================== */}
      <mesh position={[0.1, 0.02, 0.2]} receiveShadow>
        <boxGeometry args={[3.1, 0.02, 2.2]} />
        <meshStandardMaterial color={COL.gold} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.035, 0.2]} receiveShadow>
        <boxGeometry args={[2.8, 0.02, 1.9]} />
        <meshStandardMaterial color={COL.rug} roughness={0.95} />
      </mesh>

      {/* ===================== Sofa (back, against wall) ===================== */}
      <group position={[-0.1, 0, -1.5]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.32, 0.95]} />
          <meshStandardMaterial color={COL.fabric} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.66, -0.36]} castShadow>
          <boxGeometry args={[2.2, 0.6, 0.22]} />
          <meshStandardMaterial color={COL.fabric} roughness={0.9} />
        </mesh>
        {[-1.02, 1.02].map((x, i) => (
          <mesh key={i} position={[x, 0.54, 0]} castShadow>
            <boxGeometry args={[0.2, 0.5, 0.95]} />
            <meshStandardMaterial color={COL.fabric} roughness={0.9} />
          </mesh>
        ))}
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0.55, 0.04]} castShadow>
            <boxGeometry args={[0.78, 0.18, 0.74]} />
            <meshStandardMaterial color={COL.fabric2} roughness={0.85} />
          </mesh>
        ))}
        {/* throw cushions */}
        <mesh position={[-0.65, 0.68, -0.1]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.32, 0.32, 0.13]} />
          <meshStandardMaterial color={COL.gold} roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0.7, 0.68, -0.1]} rotation={[0, 0, -0.25]} castShadow>
          <boxGeometry args={[0.32, 0.32, 0.13]} />
          <meshStandardMaterial color={COL.navySoft} roughness={0.8} />
        </mesh>
        <GoldLegs w={2.2} d={0.95} h={0.16} />
      </group>

      {/* ===================== Armchair (front-right, angled) ===================== */}
      <group position={[1.45, 0, 1.0]} rotation={[0, -0.7, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.9, 0.32, 0.85]} />
          <meshStandardMaterial color={COL.cream} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.62, -0.33]} castShadow>
          <boxGeometry args={[0.9, 0.55, 0.18]} />
          <meshStandardMaterial color={COL.cream} roughness={0.9} />
        </mesh>
        {[-0.42, 0.42].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0]} castShadow>
            <boxGeometry args={[0.16, 0.42, 0.85]} />
            <meshStandardMaterial color={COL.cream} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.52, 0.03]} castShadow>
          <boxGeometry args={[0.62, 0.16, 0.66]} />
          <meshStandardMaterial color={COL.fabric2} roughness={0.85} />
        </mesh>
        <GoldLegs w={0.9} d={0.85} h={0.16} />
      </group>

      {/* Pouf / ottoman */}
      <mesh position={[0.85, 0.18, 1.35]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.34, 24]} />
        <meshStandardMaterial color={COL.gold} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* ===================== Coffee table + décor ===================== */}
      <group position={[-0.1, 0, -0.1]}>
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.08, 0.7]} />
          <meshStandardMaterial color={COL.cream} roughness={0.6} metalness={0.1} />
        </mesh>
        <GoldLegs w={1.25} d={0.7} h={0.44} />
        {/* tray */}
        <mesh position={[-0.28, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.03, 0.32]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <Books position={[-0.36, 0.4, 0]} rotation={[0, 0.2, 0]} />
        {/* vase */}
        <mesh position={[0.32, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.05, 0.26, 18]} />
          <meshStandardMaterial color={COL.gold} roughness={0.25} metalness={0.95} />
        </mesh>
        <mesh position={[0.32, 0.78, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={COL.plant} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* ===================== Console along the left wall + books/décor ===================== */}
      <group position={[-1.9, 0, -0.3]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.7, 2.0]} />
          <meshStandardMaterial color={COL.navySoft} roughness={0.85} metalness={0.05} />
        </mesh>
        <GoldLegs w={0.55} d={2.0} h={0.12} />
        <Books position={[-0.05, 0.77, -0.55]} rotation={[0, Math.PI / 2, 0]} />
        <mesh position={[0, 0.92, 0.2]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.34, 18]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.86, 0.7]} castShadow>
          <boxGeometry args={[0.26, 0.22, 0.26]} />
          <meshStandardMaterial color={COL.cream} roughness={0.8} />
        </mesh>
      </group>

      {/* ===================== Side table + table lamp (by armchair) ===================== */}
      <group position={[1.95, 0, 0.15]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial color={COL.cream} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        {/* lamp */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 10]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.13, 0.16, 0.2, 24, 1, true]} />
          <meshStandardMaterial color={COL.cream} emissive={COL.cream} emissiveIntensity={0.4} roughness={0.85} side={2} />
        </mesh>
      </group>

      {/* ===================== Floor lamp (back corner) ===================== */}
      <group position={[1.95, 0, -1.75]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 20]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.7, 12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.72, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.32, 24, 1, true]} />
          <meshStandardMaterial color={COL.cream} roughness={0.85} side={2} emissive={COL.cream} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ===================== Plants ===================== */}
      {/* tall plant (front-left corner) */}
      <group position={[-1.55, 0, 1.55]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.17, 0.56, 22]} />
          <meshStandardMaterial color={COL.cream} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.6, 8]} />
          <meshStandardMaterial color={COL.plantDk} roughness={0.9} />
        </mesh>
        {[
          [0, 1.2, 0, 0.34],
          [0.22, 1.45, 0.06, 0.26],
          [-0.18, 1.5, -0.1, 0.24],
          [0.08, 1.72, 0.04, 0.22],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={i % 2 ? COL.plant : COL.plantDk} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
      {/* small plant on the coffee-table side */}
      <group position={[1.0, 0.45, -0.1]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.16, 16]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        {[
          [0, 0.22, 0, 0.12],
          [0.08, 0.3, 0.03, 0.09],
          [-0.07, 0.31, -0.04, 0.08],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <icosahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={COL.plant} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>

      {/* ===================== Finishing details ===================== */}
      {/* Curtains flanking the window */}
      {[0.33, 1.97].map((x, i) => (
        <mesh key={`cur${i}`} position={[x, 1.45, -2.08]} castShadow>
          <boxGeometry args={[0.2, 2.2, 0.06]} />
          <meshStandardMaterial color={COL.cream} roughness={0.92} />
        </mesh>
      ))}

      {/* Wall sconces beside the artwork */}
      {[-1.2, 0.08].map((x, i) => (
        <group key={`sc${i}`} position={[x, 1.95, -2.08]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.05, 0.14, 12]} />
            <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color={COL.cream} emissive={COL.cream} emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}

      {/* Gold wall clock */}
      <group position={[-1.6, 2.05, -2.09]}>
        <mesh>
          <torusGeometry args={[0.17, 0.02, 16, 40]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.17, 32]} />
          <meshStandardMaterial color={COL.cream} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0.01]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.014, 0.1, 0.005]} />
          <meshStandardMaterial color={COL.navy} />
        </mesh>
        <mesh position={[0.03, 0, 0.01]} rotation={[0, 0, 1.2]}>
          <boxGeometry args={[0.012, 0.07, 0.005]} />
          <meshStandardMaterial color={COL.navy} />
        </mesh>
      </group>

      {/* Blanket draped over the sofa's right arm */}
      <mesh position={[0.92, 0.62, -1.35]} rotation={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[0.46, 0.5, 0.5]} />
        <meshStandardMaterial color={COL.terra} roughness={0.92} />
      </mesh>

      {/* Fruit bowl on the coffee table */}
      <group position={[0.1, 0.52, -0.22]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.09, 0.07, 20]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        {[
          [-0.05, 0.08, 0],
          [0.05, 0.08, 0.03],
          [0, 0.1, -0.05],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={i ? COL.terra : COL.plant} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Framed prints leaning against the left wall */}
      {[0, 1].map((i) => (
        <mesh
          key={`lf${i}`}
          position={[-1.8, 0.5, -1.0 + i * 0.14]}
          rotation={[0, 0.5, -0.08]}
          castShadow
        >
          <boxGeometry args={[0.5, 0.7, 0.04]} />
          <meshStandardMaterial
            color={i ? COL.gold : COL.navySoft}
            roughness={i ? 0.4 : 0.6}
            metalness={i ? 0.8 : 0}
          />
        </mesh>
      ))}

      {/* Small round stool */}
      <group position={[-0.9, 0, 1.5]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
          <meshStandardMaterial color={COL.fabric2} roughness={0.85} />
        </mesh>
        {[
          [-0.15, -0.15],
          [0.15, -0.15],
          [-0.15, 0.15],
          [0.15, 0.15],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.13, z]}>
            <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
            <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ===================== Extra détail ===================== */}
      {/* Floating wall shelf with décor */}
      <group position={[-1.25, 1.85, -2.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.04, 0.22]} />
          <meshStandardMaterial color={COL.cream} roughness={0.8} />
        </mesh>
        <mesh position={[-0.2, 0.12, 0]} castShadow>
          <boxGeometry args={[0.12, 0.2, 0.12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0.08, 0.11, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.18, 16]} />
          <meshStandardMaterial color={COL.navySoft} roughness={0.7} />
        </mesh>
        <mesh position={[0.25, 0.09, 0]} castShadow>
          <sphereGeometry args={[0.07, 18, 18]} />
          <meshStandardMaterial color={COL.terra} roughness={0.6} />
        </mesh>
      </group>

      {/* Bar cart */}
      <group position={[-0.25, 0, 1.8]}>
        <mesh position={[0, 0.66, 0]} castShadow>
          <boxGeometry args={[0.62, 0.03, 0.42]} />
          <meshStandardMaterial color={COL.cream} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.62, 0.03, 0.42]} />
          <meshStandardMaterial color={COL.cream} roughness={0.6} />
        </mesh>
        {[
          [-0.28, -0.18],
          [0.28, -0.18],
          [-0.28, 0.18],
          [0.28, 0.18],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.34, z]}>
            <cylinderGeometry args={[0.014, 0.014, 0.66, 10]} />
            <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
          </mesh>
        ))}
        <mesh position={[-0.13, 0.79, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 12]} />
          <meshStandardMaterial color={COL.plantDk} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0.77, 0.05]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
          <meshStandardMaterial color={COL.terra} roughness={0.4} />
        </mesh>
        <mesh position={[0.17, 0.75, -0.05]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.14, 12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Arc floor lamp (over the armchair) */}
      <group position={[2.0, 0, 1.55]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.06, 20]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 1.8, 12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[-0.45, 1.75, 0]} rotation={[0, 0, 1.25]}>
          <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
          <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[-0.85, 1.55, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.24, 20, 1, true]} />
          <meshStandardMaterial color={COL.cream} side={2} emissive={COL.cream} emissiveIntensity={0.35} roughness={0.85} />
        </mesh>
      </group>

      {/* Runner rug by the console */}
      <mesh position={[-1.75, 0.012, -0.3]} receiveShadow>
        <boxGeometry args={[0.55, 0.02, 2.0]} />
        <meshStandardMaterial color={COL.terra} roughness={0.95} />
      </mesh>

      {/* Magazine stack on the floor */}
      <group position={[0.7, 0, 0.62]} rotation={[0, 0.3, 0]}>
        {[COL.navy, COL.gold, COL.cream].map((c, i) => (
          <mesh key={i} position={[0, 0.02 + i * 0.018, 0]} rotation={[0, i * 0.12, 0]} castShadow>
            <boxGeometry args={[0.3, 0.015, 0.22]} />
            <meshStandardMaterial color={c} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Globe on the console */}
      <mesh position={[-1.9, 0.9, -0.9]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial color={COL.gold} roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}
