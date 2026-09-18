"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { tickScene } from "@/lib/scene";
import PhotoStage from "./PhotoStage";
import MistPlane from "./MistPlane";
import EmberField from "./EmberField";

function SceneTicker() {
  useFrame((_, delta) => tickScene(Math.min(delta, 0.05)));
  return null;
}

let webglSupport: boolean | null = null;

/** Probed once and cached, so the store snapshot stays referentially stable. */
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl"))
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

/**
 * The persistent stage. Every chapter shares this one canvas — the plates
 * dissolve into each other and the grade shifts as you scroll, so the site
 * reads as a single continuous take rather than a stack of sections.
 */
export default function VFXCanvas() {
  // Capability detection has to happen on the client only; the server always
  // renders the static fallback so hydration stays consistent.
  const enabled = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);

  if (!enabled) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, color-mix(in srgb, var(--accent) 34%, transparent) 0%, transparent 60%), #040404",
        }}
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          // Compositing happens directly on the stored sRGB values, so the
          // renderer is told not to apply an output transform.
          outputColorSpace: THREE.LinearSRGBColorSpace,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
      >
        <SceneTicker />
        <Suspense fallback={null}>
          <PhotoStage />
        </Suspense>
        <MistPlane />
        <EmberField />
      </Canvas>
    </div>
  );
}
