"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";
import { useConst } from "@/lib/useConst";

const vertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Bypass the camera entirely: map the unit plane straight to clip space so
    // this always covers the viewport no matter what the camera is doing.
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform float uIntensity;
  uniform float uVelocity;
  uniform float uExpansion;
  uniform vec3  uMist;
  uniform vec3  uEmber;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      total += valueNoise(p) * amplitude;
      p *= 2.02;
      amplitude *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y) * 2.4;

    float t = uTime * 0.045;

    // Domain warping turns plain fbm into something that curls like smoke.
    vec2 q = vec2(
      fbm(p + vec2(0.0, t)),
      fbm(p + vec2(3.2, 1.7) - vec2(0.0, t * 0.8))
    );
    vec2 r = vec2(
      fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.6),
      fbm(p + 2.0 * q + vec2(8.3, 2.8) - t * 0.5)
    );
    float density = fbm(p + 3.0 * r);

    // Smoke gathers toward the floor of the frame.
    density *= mix(0.35, 1.25, pow(1.0 - uv.y, 1.6));

    vec3 col = uMist * density * 1.6;

    // Shafts of light from a source just above the top edge.
    vec2 lightPos = vec2(0.5, 1.02);
    vec2 d = uv - lightPos;
    float ang = atan(d.x, -d.y);
    float dist = length(d);
    float rays = fbm(vec2(ang * 5.0, uTime * 0.05));
    rays = pow(rays, 2.4) * smoothstep(1.25, 0.05, dist);
    col += uEmber * rays * (0.35 + uIntensity * 0.85);

    // Horizon bloom: the fire that is always just out of shot.
    float horizon = pow(max(0.0, 1.0 - uv.y), 4.0);
    col += uEmber * horizon * (0.12 + uIntensity * 0.5);

    // Fast scrolling smears extra light through the frame.
    col += uEmber * uVelocity * 0.10 * density;

    // Before the frame opens up the image is graded darker and flatter.
    col *= mix(0.55, 1.0, uExpansion);

    // Kept deliberately thin: this is atmosphere over the photograph, not a
    // replacement for it.
    float alpha = clamp(density * 0.42 + rays * 0.34 + horizon * 0.30, 0.0, 0.82);
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function MistPlane() {
  // Written through the material — see the note in PhotoStage.
  const material = useRef<THREE.ShaderMaterial>(null);

  const initialUniforms = useConst(() => ({
    uTime: { value: 0 },
    uAspect: { value: 1.7 },
    uIntensity: { value: 0 },
    uVelocity: { value: 0 },
    uExpansion: { value: 0 },
    uMist: { value: new THREE.Color(0.18, 0.08, 0.04) },
    uEmber: { value: new THREE.Color(1.0, 0.37, 0.12) },
  }));

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;

    u.uTime.value += delta;
    u.uAspect.value = state.size.width / Math.max(state.size.height, 1);
    u.uIntensity.value += (scene.intensity - u.uIntensity.value) * 0.05;
    u.uVelocity.value += (scene.velocity - u.uVelocity.value) * 0.1;
    u.uExpansion.value += (scene.expansion - u.uExpansion.value) * 0.08;
    u.uMist.value.setRGB(scene.mist[0], scene.mist[1], scene.mist[2]);
    u.uEmber.value.setRGB(scene.ember[0], scene.ember[1], scene.ember[2]);
  });

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={initialUniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
