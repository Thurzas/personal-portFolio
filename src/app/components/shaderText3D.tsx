'use client';
import { Text3D, Center, FontData } from "@react-three/drei";
import { ShaderMaterial, Color, Vector2, Vector3, Mesh, TextureLoader, NearestFilter, Object3D } from "three";
import { useMemo, useRef, useEffect, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import vertexShader from "../shaders/matrix.vertex.glsl";
import fragmentShader from "../shaders/matrix.fragment.glsl";

interface ShaderText3DMatrixProps {
  text: string;
  texturePath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  intensity?: number;
  speed?:number;
  trailLen?:number;
  flicker?:number;
  matrixScale?:number;
  fontPath: string | FontData;
}

export const ShaderText3DMatrix = forwardRef<Object3D, ShaderText3DMatrixProps>(
  ({ text, texturePath, position = [0, 0, 0], rotation = [0, 0, 0], scale= [ 1, 1, 1],intensity=1.2, speed=25, trailLen=10,flicker=20,matrixScale=10, fontPath },  ref) => {
  const shaderMaterialRef = useRef<ShaderMaterial | null>(null);
  const textRef = useRef<Mesh>(null!);

  const texture = useMemo(() => {
    const t = new TextureLoader().load(texturePath);
    t.generateMipmaps = false;
    t.magFilter = NearestFilter;
    t.minFilter = NearestFilter;
    return t;
  }, [texturePath]);

  //Forward le ref vers le Mesh Text3D, histoire de pouvoir le manipuler
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(textRef.current);
    else ref.current = textRef.current;
  }, [ref]);

  // calculer minUv / maxUv pour la géométrie du texte
  const { minUv, maxUv } = useMemo(() => {
    const min = new Vector3(Infinity, Infinity, Infinity);
    const max = new Vector3(-Infinity, -Infinity, -Infinity);

    if (textRef.current?.geometry) {
      const uvs = textRef.current.geometry.attributes.uv;
      if (uvs) {
        for (let i = 0; i < uvs.count; i++) {
          const u = uvs.getX(i);
          const v = uvs.getY(i);
          min.x = Math.min(min.x, u);
          min.y = Math.min(min.y, v);
          max.x = Math.max(max.x, u);
          max.y = Math.max(max.y, v);
        }
      }
    }
    return { minUv: min, maxUv: max };
  }, [textRef.current?.geometry]);

  const shaderMaterial = useMemo(() => {
    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
        uGlyphs: { value: texture },
        uAtlasSide: { value: 9.0 },
        uCols: { value: 16.0 },
        uRows: { value: 16.0 },
        uFlicker: { value: flicker },
        uTrailLen: { value: trailLen },
        uSpeed: { value: speed },
        uMinUv: { value: minUv },
        uMaxUv: { value: maxUv },
        uMatrixScale: { value: matrixScale },
        uIntensity: { value: intensity},
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });
    shaderMaterialRef.current = mat;
    return mat;
  }, [texture, minUv, maxUv]);

  useFrame(({ clock, size }) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.time.value = clock.getElapsedTime();
      shaderMaterialRef.current.uniforms.resolution.value.set(size.width, size.height);
    }
  });

  
  useEffect(() => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uIntensity.value = intensity;
      shaderMaterialRef.current.uniforms.uFlicker.value = flicker;
      shaderMaterialRef.current.uniforms.uTrailLen.value = trailLen;
      shaderMaterialRef.current.uniforms.uSpeed.value = speed;
      shaderMaterialRef.current.uniforms.uMatrixScale.value = matrixScale;
    }
  }, [intensity,speed,flicker,trailLen,matrixScale]);
  

  useEffect(() => {
    if (textRef.current) {
      textRef.current.material = shaderMaterialRef.current!;
    }
  }, [shaderMaterial]);

  return (
    <Center position={position} rotation={rotation} scale={scale}>
      <Text3D ref={textRef} font={fontPath} size={1} height={0.3}>
        {text}
        <primitive object={shaderMaterialRef.current!} attach="material" />
      </Text3D> 
    </Center>
  );
}
);
