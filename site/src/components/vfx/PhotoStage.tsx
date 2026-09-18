"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";
import { plateList } from "@/lib/plates";
import { useConst } from "@/lib/useConst";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec2  uSizeA;
  uniform vec2  uSizeB;
  uniform vec2  uResolution;

  uniform float uTime;
  uniform float uMix;       // crossfade from plate A to plate B
  uniform float uReveal;    // photograph (0) to schematic (1)
  uniform float uVelocity;
  uniform float uPush;      // slow scroll-driven push-in
  uniform float uParallax;
  uniform float uExposure;

  uniform vec3 uAccent;
  uniform vec3 uMist;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      total += valueNoise(p) * amp;
      p *= 2.03;
      amp *= 0.5;
    }
    return total;
  }

  /** CSS background-size: cover, in UV space. */
  vec2 cover(vec2 uv, vec2 plane, vec2 image) {
    vec2 ratio = vec2(
      min((plane.x / plane.y) / (image.x / image.y), 1.0),
      min((plane.y / plane.x) / (image.y / image.x), 1.0)
    );
    return uv * ratio + (1.0 - ratio) * 0.5;
  }

  float lum(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  /** Samples with a velocity-driven chromatic split, strongest at the edges. */
  vec3 plate(sampler2D tex, vec2 size, vec2 uv, float ab) {
    vec2 st = cover(uv, uResolution, size);
    vec2 dir = st - 0.5;
    return vec3(
      texture2D(tex, clamp(st + dir * ab, 0.0, 1.0)).r,
      texture2D(tex, clamp(st, 0.0, 1.0)).g,
      texture2D(tex, clamp(st - dir * ab, 0.0, 1.0)).b
    );
  }

  void main() {
    vec2 uv = vUv;

    // Slow push-in and drift, so a still photograph never sits completely still.
    uv = (uv - 0.5) * (1.0 - uPush * 0.07) + 0.5;
    uv.y += uParallax * 0.035;
    uv.x += sin(uTime * 0.06) * 0.004;

    float ab = 0.002 + uVelocity * 0.018;

    vec3 a = plate(uTexA, uSizeA, uv, ab);
    vec3 b = plate(uTexB, uSizeB, uv, ab);

    // Noisy dissolve rather than a straight crossfade.
    float dn = fbm(uv * 3.1 + 11.0);
    float dEdge = uMix * 1.6 - 0.3;
    float dMask = smoothstep(dn - 0.3, dn + 0.3, dEdge);
    vec3 photo = mix(a, b, dMask);

    // The dissolve boundary burns.
    float burn = 1.0 - abs(dMask - 0.5) * 2.0;
    burn = pow(max(burn, 0.0), 5.0) * step(0.001, uMix) * step(uMix, 0.999);

    // ---- The schematic pass ----
    float L = lum(photo);

    // Contour lines at fixed luminance intervals, width-corrected by derivatives.
    float levels = 13.0;
    float v = L * levels;
    float f = min(fract(v), 1.0 - fract(v));
    float w = max(fwidth(v), 0.0001);
    float contour = 1.0 - smoothstep(0.0, w * 1.4, f);

    // Screen-space gradient magnitude picks out cables, ridges and skylines.
    float edge = clamp(length(vec2(dFdx(L), dFdy(L))) * 55.0, 0.0, 1.0);

    vec3 schematic = uMist * 0.5;
    schematic += uAccent * contour * 0.85;
    schematic += vec3(1.0) * edge * 0.6;
    schematic += photo * 0.16; // a ghost of the original keeps it half-real

    // Noisy wipe between photograph and schematic.
    float rn = fbm(uv * 2.4 - uTime * 0.015);
    float rEdge = uReveal * 1.6 - 0.3;
    float rMask = smoothstep(rn - 0.3, rn + 0.3, rEdge);

    vec3 col = mix(photo, schematic, rMask);

    // Bright seam where the two treatments meet.
    float seam = 1.0 - abs(rMask - 0.5) * 2.0;
    seam = pow(max(seam, 0.0), 4.0) * step(0.001, uReveal) * step(uReveal, 0.999);
    col += uAccent * seam * 0.7;
    col += vec3(1.0, 0.65, 0.3) * burn * 1.3;

    col *= uExposure;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** A 1x1 black texture, so the uniforms are always bound to something. */
function makePlaceholder(): THREE.Texture {
  const tex = new THREE.DataTexture(new Uint8Array([6, 6, 6, 255]), 1, 1);
  tex.needsUpdate = true;
  return tex;
}

export default function PhotoStage() {
  const { size, gl } = useThree();

  const placeholder = useConst(makePlaceholder);
  // Mutable store rather than state: swapping a texture must not re-render.
  const store = useConst(() => ({ textures: [] as THREE.Texture[] }));

  const uniforms = useConst(() => ({
    uTexA: { value: placeholder },
    uTexB: { value: placeholder },
    uSizeA: { value: new THREE.Vector2(1800, 1350) },
    uSizeB: { value: new THREE.Vector2(1800, 1350) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uMix: { value: 0 },
    uReveal: { value: 0 },
    uVelocity: { value: 0 },
    uPush: { value: 0 },
    uParallax: { value: 0 },
    uExposure: { value: 1 },
    uAccent: { value: new THREE.Color(1, 0.37, 0.12) },
    uMist: { value: new THREE.Color(0.18, 0.08, 0.04) },
  }));

  useEffect(() => {
    // Loading through the default manager is what lets the preloader report
    // real progress for these plates.
    const loader = new THREE.TextureLoader(THREE.DefaultLoadingManager);
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    const loaded: THREE.Texture[] = [];
    let cancelled = false;

    plateList.forEach((src, i) => {
      loader.load(src, (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        // Colour management is deliberately bypassed: this is a 2D compositing
        // pass, so sampled values are treated as-is and written straight out.
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.anisotropy = Math.min(maxAniso, 8);
        tex.needsUpdate = true;
        loaded[i] = tex;
      });
    });

    store.textures = loaded;

    return () => {
      cancelled = true;
      for (const tex of loaded) tex?.dispose();
    };
  }, [gl, store]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uResolution.value.set(size.width, size.height);

    const a = store.textures[scene.plateA] ?? placeholder;
    const b = store.textures[scene.plateB] ?? placeholder;
    uniforms.uTexA.value = a;
    uniforms.uTexB.value = b;

    const imgA = a.image as { width?: number; height?: number } | undefined;
    const imgB = b.image as { width?: number; height?: number } | undefined;
    uniforms.uSizeA.value.set(imgA?.width || 1800, imgA?.height || 1350);
    uniforms.uSizeB.value.set(imgB?.width || 1800, imgB?.height || 1350);

    uniforms.uMix.value += (scene.plateMix - uniforms.uMix.value) * 0.14;
    uniforms.uReveal.value += (scene.reveal - uniforms.uReveal.value) * 0.09;
    uniforms.uVelocity.value += (scene.velocity - uniforms.uVelocity.value) * 0.1;
    uniforms.uPush.value += (scene.push - uniforms.uPush.value) * 0.06;
    uniforms.uParallax.value += (scene.parallax - uniforms.uParallax.value) * 0.07;
    uniforms.uExposure.value += (scene.exposure - uniforms.uExposure.value) * 0.06;
    uniforms.uAccent.value.setRGB(scene.ember[0], scene.ember[1], scene.ember[2]);
    uniforms.uMist.value.setRGB(scene.mist[0], scene.mist[1], scene.mist[2]);
  });

  return (
    <mesh renderOrder={-2} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
