"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import InteriorScene from "./InteriorScene";

type Props = {
  interactive?: boolean;
  /** Enable click-drag orbit (mouse only). */
  controls?: boolean;
  className?: string;
};

const BASE_AZIMUTH = Math.PI / 4; // camera starts at the open front corner
const SWAY = 0.45; // how far it drifts each way (radians)

type OrbitLike = {
  getAzimuthalAngle(): number;
  setAzimuthalAngle(a: number): void;
  update(): void;
  addEventListener(t: string, f: () => void): void;
  removeEventListener(t: string, f: () => void): void;
};

/** Gently sways the camera back and forth (reversing) while the user isn't dragging. */
function AutoSway() {
  const controls = useThree((s) => s.controls) as unknown as OrbitLike | null;
  const dragging = useRef(false);

  useEffect(() => {
    if (!controls) return;
    const start = () => (dragging.current = true);
    const end = () => (dragging.current = false);
    controls.addEventListener("start", start);
    controls.addEventListener("end", end);
    return () => {
      controls.removeEventListener("start", start);
      controls.removeEventListener("end", end);
    };
  }, [controls]);

  useFrame((state) => {
    if (!controls || dragging.current) return;
    const target = BASE_AZIMUTH + Math.sin(state.clock.elapsedTime * 0.25) * SWAY;
    const cur = controls.getAzimuthalAngle();
    controls.setAzimuthalAngle(cur + (target - cur) * 0.02);
    controls.update();
  });

  return null;
}

/**
 * Transparent, orthographic (isometric) WebGL canvas hosting the dollhouse room.
 * Background is alpha so the navy + kintsugi veins show through.
 */
export default function Scene({
  interactive = true,
  controls = false,
  className,
}: Props) {
  return (
    <Canvas
      className={className}
      orthographic
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [8, 7, 8], zoom: 62, near: 0.1, far: 100 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.6}
        color="#fff2cf"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#6f86c9" />

      <InteriorScene interactive={controls ? false : interactive} spin={!controls} />

      {controls && (
        <>
          <OrbitControls
            makeDefault
            target={[0, 0.6, 0]}
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={0.85}
            maxPolarAngle={1.2}
            minAzimuthAngle={BASE_AZIMUTH - 0.6}
            maxAzimuthAngle={BASE_AZIMUTH + 0.6}
          />
          <AutoSway />
        </>
      )}

      <ContactShadows
        position={[0, -0.42, 0]}
        opacity={0.4}
        scale={9}
        blur={2.6}
        far={4}
        color="#0b1020"
      />

      {/* In-scene environment for subtle gold sheen */}
      <Environment resolution={256}>
        <Lightformer intensity={1.2} position={[0, 4, 2]} scale={[6, 3, 1]} color="#f7eccb" />
        <Lightformer intensity={0.9} position={[-3, 1, 2]} scale={[4, 4, 1]} color="#c6a75e" />
        <Lightformer intensity={0.5} position={[3, 2, -2]} scale={[3, 3, 1]} color="#243150" />
      </Environment>
    </Canvas>
  );
}
