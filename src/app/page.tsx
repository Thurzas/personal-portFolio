"use client";
import { Canvas, invalidate, useFrame, } from "@react-three/fiber";
import { OrbitControls, useGLTF, } from "@react-three/drei";
import { useMemo, useRef } from "react";
import Track from "./components/Track";
import Sunset from "./components/sunset";
import { Color, ShaderMaterial, Vector2, Vector3 } from "three";
import VignetteEffect from "./components/VignetteShader";
import fragmentShader from "./shaders/striped.fragment.glsl";
import vertexShader from "./shaders/striped.vertex.glsl";
import MatrixVision from "./components/matrix";
import { Delaurian } from "./components/Delaurian";
import { ShaderGLTF } from "./components/shaderGLTF";
export default function Home() {
  const cameraRef = useRef<HTMLCanvasElement>(null); 
  const vignette = useMemo(() => new VignetteEffect(1.5), []);
  return (
    <Canvas
      ref={cameraRef} 
      shadows
      camera={{ position: [0, 3, 10], fov: 42 }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor("#350223ff");
      }}
    >      
      <ambientLight intensity={105} />
      <ShaderGLTF
        gltfPath="/delorean.glb"
        texturePath="/textures/matrix_glyph_atlas.png"
        position={[0, 1, 0]}
        rotation={[0,0,0]}
        scale={[0.25, 0.25, 0.25]}
      />
      <MatrixVision/>
      <OrbitControls />      
    </Canvas>
  );
}
