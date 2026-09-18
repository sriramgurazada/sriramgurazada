"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";
import { useConst } from "@/lib/useConst";

const COUNT = 1400;

/**
 * Seeded PRNG. The ember layout wants to look random but be identical on every
 * render and every machine, so it is generated rather than sampled.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertex = /* glsl */ `
  attribute vec3 aSeed; // x: rise speed, y: sway rate, z: size

  uniform float uTime;
  uniform vec2  uHalf;
  uniform float uVelocity;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vFlicker;

  void main() {
    // Faster scrolling drags the embers upward with the camera.
    float speed = aSeed.x * (0.9 + uVelocity * 3.2);
    float span = uHalf.y * 2.0 + 2.0;

    float y = position.y * uHalf.y + uTime * speed;
    y = mod(y + uHalf.y + 1.0, span) - uHalf.y - 1.0;

    float sway = sin(uTime * 0.7 * aSeed.y + aSeed.z * 12.0) * 0.45;
    vec3 pos = vec3(position.x * uHalf.x + sway, y, position.z);

    // Born at the floor, burn out before the ceiling.
    float rise = smoothstep(-uHalf.y * 1.1, -uHalf.y * 0.45, y);
    float die  = 1.0 - smoothstep(uHalf.y * 0.15, uHalf.y * 1.02, y);
    vAlpha = rise * die;

    vFlicker = 0.5 + 0.5 * sin(uTime * 6.0 * aSeed.y + aSeed.z * 30.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSeed.z * uPixelRatio * (34.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform vec3  uEmber;
  uniform float uIntensity;

  varying float vAlpha;
  varying float vFlicker;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 2.4) * vAlpha * uIntensity;
    if (alpha < 0.005) discard;

    // Hot centre, cooler edge.
    vec3 col = mix(uEmber, vec3(1.0, 0.95, 0.85), pow(core, 6.0) * 0.7);
    col *= 0.55 + vFlicker * 0.75;

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function EmberField() {
  const { viewport, gl } = useThree();

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT * 3);
    const rand = mulberry32(0x5f1f);

    for (let i = 0; i < COUNT; i++) {
      // Normalised placement; the shader scales x/y to the live viewport.
      positions[i * 3 + 0] = rand() * 2 - 1;
      positions[i * 3 + 1] = rand() * 2 - 1;
      positions[i * 3 + 2] = rand() * 6 - 4;

      seeds[i * 3 + 0] = 0.15 + rand() * 0.75;
      seeds[i * 3 + 1] = 0.4 + rand() * 1.6;
      // A few large embers read as close to camera; most stay as fine sparks.
      seeds[i * 3 + 2] = rand() < 0.08 ? 3.2 + rand() * 3.5 : 0.7 + rand() * 1.8;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    return g;
  }, []);

  // Written through the material — see the note in PhotoStage.
  const material = useRef<THREE.ShaderMaterial>(null);

  const initialUniforms = useConst(() => ({
    uTime: { value: 0 },
    uHalf: { value: new THREE.Vector2(8, 5) },
    uVelocity: { value: 0 },
    uPixelRatio: { value: 1 },
    uIntensity: { value: 0 },
    uEmber: { value: new THREE.Color(1.0, 0.37, 0.12) },
  }));

  useFrame((_, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;

    u.uTime.value += delta;
    u.uHalf.value.set(viewport.width / 2, viewport.height / 2);
    u.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    u.uVelocity.value += (scene.velocity - u.uVelocity.value) * 0.1;
    u.uIntensity.value += (scene.intensity - u.uIntensity.value) * 0.04;
    u.uEmber.value.setRGB(scene.ember[0], scene.ember[1], scene.ember[2]);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={initialUniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
