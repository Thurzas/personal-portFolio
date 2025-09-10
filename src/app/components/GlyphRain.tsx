// GlyphRainSafe.tsx
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, NearestFilter, InstancedBufferAttribute } from "three";

export type Props = {
  texturePath: string;
  count?: number;
  areaSize?: number;
  height?: number;
  speed?: number;
  glyphCols?: number;
  glyphRows?: number;
  glyphCount?: number;
  size?: number;
  glyphTrail?: number;
  trailFade?: number;
  opacity?: number;
};

const vertexShader = /* glsl */ `
  precision highp float;

  attribute float aGlyphIndex;

  varying vec2 vUv;
  varying float vGlyphIndex;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vGlyphIndex = aGlyphIndex;

    vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;


const fragmentShader = /* glsl */ `
uniform sampler2D uGlyphs;
uniform float uCols;
uniform float uRows;
uniform float uGlyphCount;
uniform float uOpacity;
uniform float uTime;
uniform float uTrailLength;   // nombre de glyphes dans la colonne
uniform float uTrailFade;     // atténuation par glyph

varying vec2 vUv;
varying float vGlyphIndex;

void main() {
  vec3 color = vec3(0.0);

  // Fraction de la colonne [0..1] selon la hauteur du quad
  float v = vUv.y;

  // Position "globale" qui défile avec le temps
  float globalOffset = uTime * 5.0;

  // Découpe la colonne en uTrailLength segments
  for (int i = 0; i < 20; i++) {
    if (float(i) >= uTrailLength) break;

    // Position locale de ce segment (0 en haut → 1 en bas)
    float segTop = float(i) / uTrailLength;
    float segBottom = (float(i) + 1.0) / uTrailLength;

    // Est-ce que le fragment courant est dans ce segment ?
    if (v >= segTop && v < segBottom) {
      // Interpolation locale
      float t = (v - segTop) * uTrailLength;

      // Quel glyph pour ce segment ?
      float glyphIndex = mod(vGlyphIndex + globalOffset + float(i), uGlyphCount);
      float gx = mod(glyphIndex, uCols);
      float gy = floor(glyphIndex / uCols);

      vec2 tileSize = vec2(1.0 / uCols, 1.0 / uRows);
      vec2 glyphUV = vec2(vUv.x, t) * tileSize + vec2(gx, gy) * tileSize;

      vec4 tex = texture2D(uGlyphs, glyphUV);

      if (tex.a > 0.05) {
        float fade = pow(uTrailFade, float(i)); // atténuation par segment
        color += vec3(0.0, 1.0, 0.15) * tex.a * fade;
      }
    }
  }

  if (length(color) < 0.001) discard;

  gl_FragColor = vec4(color, uOpacity);
}
`;


export default function GlyphRain({
  texturePath,
  count = 5000,
  areaSize = 200,
  height = 50,
  speed = 60,
  glyphCols = 9,
  glyphRows = 8,
  glyphCount = 67,
  size = 0.7,
  glyphTrail = 15,
  trailFade = 0.8,
  opacity = 1.0,
}: Props) {
  const { camera } = useThree();

  // --- Texture ---
  const glyphTexture = useLoader(TextureLoader, texturePath);

  useEffect(() => {
    if (!glyphTexture) return;
    glyphTexture.generateMipmaps = false;
    glyphTexture.magFilter = NearestFilter;
    glyphTexture.minFilter = NearestFilter;
    glyphTexture.wrapS = THREE.RepeatWrapping;
    glyphTexture.wrapT = THREE.RepeatWrapping;
  }, [glyphTexture]);

  // --- CPU state for particles (spawn + velocity + glyph index) ---
  const particles = useMemo(() => {
    const arr: { pos: THREE.Vector3; vy: number; glyph: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * areaSize,
          Math.random() * height,
          (Math.random() - 0.5) * areaSize
        ),
        vy: -(Math.random() * 0.3 + 0.1) * (speed / 10),
        glyph: Math.floor(Math.random() * glyphCount),
      });
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, areaSize, height, speed, glyphCount]);

  // --- Instanced attribute: glyph index ---
  const glyphIndexAttr = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = particles[i].glyph;
    return new InstancedBufferAttribute(arr, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, particles]);

  // --- Shader material (memoized) ---
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const material = useMemo(() => {
    if (!glyphTexture) return null;
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uGlyphs: { value: glyphTexture },
        uCols: { value: glyphCols },
        uRows: { value: glyphRows },
        uGlyphCount: { value: glyphCount },
        uOpacity: { value: opacity },
        uTime: { value: 0.0 },
        uTrailLength: { value: glyphTrail },
        uTrailFade: { value: trailFade },
        uScale: { value: 0.3 }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    materialRef.current = mat;
    return mat;
  }, [glyphTexture, glyphCols, glyphRows, glyphCount, glyphTrail, trailFade, opacity]);

  // --- Geometry (memoized!) ---
  // IMPORTANT FIX: memoize the geometry instead of constructing it inline in JSX.
  // Constructing new geometry in render can cause dispose/recreate thrash in Next.js dev (strict mode),
  // which breaks the r3f render loop and triggers the error you saw.
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, glyphTrail);
    return g;
  }, [glyphTrail]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // --- Instanced mesh refs ---
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // --- Populate instances and attach attributes ---
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !material) return;

    // avoid culling issues for tall trails
    mesh.frustumCulled = false;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      dummy.position.copy(p.pos);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    const geo = mesh.geometry as THREE.BufferGeometry;
    geo.setAttribute("aGlyphIndex", glyphIndexAttr);

    mesh.instanceMatrix.needsUpdate = true;
  }, [material, glyphIndexAttr, particles, size, count, dummy]);

  // --- Frame update ---
  useFrame((_, delta) => {
    const mesh = meshRef.current;

    // advance shader time safely
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }

    if (!mesh || !material) return;

    const camQuat = camera.quaternion;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.pos.y += p.vy * delta * 60.0;

      if (p.pos.y < 0) {
        p.pos.set(
          (Math.random() - 0.5) * areaSize,
          height,
          (Math.random() - 0.5) * areaSize
        );
        p.vy = -(Math.random() * 0.3 + 0.1) * (speed / 10);
        p.glyph = Math.floor(Math.random() * glyphCount);
        // update instanced buffer attribute safely (avoid referencing an undefined variable)
        const geo = mesh.geometry as THREE.BufferGeometry;
        const glyphAttr = geo.getAttribute("aGlyphIndex") as InstancedBufferAttribute | null;
        if (glyphAttr) {
          glyphAttr.setX(i, p.glyph);
          glyphAttr.needsUpdate = true;
        }
      }

      dummy.position.copy(p.pos);
      //dummy.quaternion.copy(camQuat); // billboarding
      dummy.quaternion.set(0, 0, 0, 1);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  if (!material) return null;

  return (
    <instancedMesh
      ref={(r) => {
        if (!r) return;
        meshRef.current = r;
      }}
      // IMPORTANT FIX: use memoized geometry & material in args to avoid recreating per render
      args={[geometry, material, count]}
      castShadow={false}
      receiveShadow={false}
    />
  );
}
