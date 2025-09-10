'use client';
import { useMemo, useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh, ShaderMaterial, TextureLoader, NearestFilter, Scene, Object3D, Vector2, Vector3, Camera } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";
import fragmentShader from "../shaders/matrix.fragment.glsl";
import vertexShader from "../shaders/matrix.vertex.glsl";
import { forwardRef } from "react";

interface ShaderGLTFProps {
  gltfPath: string;
  texturePath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  intensity?:number;
} 

export const ShaderGLTF = forwardRef<Object3D, ShaderGLTFProps>(
  ({ gltfPath, texturePath, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], intensity = 1.2 }, ref) => {
  const { viewport } = useThree(); // Hook pour obtenir la résolution

  const { scene } = useGLTF(gltfPath) as GLTF & { scene: Object3D };
  const shaderMat  = useRef<ShaderMaterial | null>(null);

  const texture = useMemo(() => {
    const t = new TextureLoader().load(texturePath);
    t.generateMipmaps = false;
    t.magFilter = NearestFilter;
    t.minFilter = NearestFilter;
    return t;
  }, [texturePath]);


  // Ajoutez ces uniformes
  useMemo(() => {
    const minUv = new Vector3(Infinity, Infinity,Infinity);
    const maxUv = new Vector3(-Infinity, -Infinity,-Infinity);

    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const uvs = (child as Mesh).geometry.attributes.uv;
        if (uvs) {
          for (let i = 0; i < uvs.count; i++) {
            const u = uvs.getX(i);
            const v = uvs.getY(i);
            const w = uvs.getZ(i);
            minUv.x = Math.min(minUv.x, u);
            minUv.y = Math.min(minUv.y, v);
            minUv.z = Math.min(minUv.z, w);
            maxUv.x = Math.max(maxUv.x, u);
            maxUv.y = Math.max(maxUv.y, v);
            maxUv.z = Math.max(maxUv.z, w);
          }
        }
      }
    });

    const mat = new ShaderMaterial({
      vertexShader:vertexShader,
      fragmentShader:fragmentShader,
      uniforms: {
        // Uniformes du shader
        time: { value: 0 },
        resolution: { value: new Vector2(0.5,0.5) },
        uGlyphs: { value: texture },
        uAtlasSide:  { value: 9.0 },
        uCols: { value: 16.0 },
        uRows: { value: 64.0 },
        uFlicker: { value: 10.0 },
        uTrailLen: { value: 25.0 },
        uSpeed: { value: 50.0 },
        uMinUv: { value: minUv },
        uMaxUv: { value: maxUv },
        uMatrixScale: { value: 5 },
        uIntensity: { value: intensity},
      },
      transparent: true, 
      depthWrite: false, 
      depthTest: true,
    });
    shaderMat.current = mat;
    return mat;
  }, [texture, viewport,scene]); // Ajout de viewport dans les dépendances

  useEffect(() => {
    if (shaderMat.current) {
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          // L'assignation est maintenant sûre car le type est vérifié
          (child as Mesh).material = shaderMat.current;
        }
      });
    }
  }, [scene, shaderMat]);

  useFrame(({ clock, size }) => {
    if (shaderMat.current) {
      // La ligne ci-dessous n'est normalement pas nécessaire
      shaderMat.current.uniforms.time.value = clock.getElapsedTime();
      shaderMat.current.uniforms.resolution.value.set(size.width, size.height);
    }
  });

  return (
    <primitive
      ref={ref} 
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
  
});