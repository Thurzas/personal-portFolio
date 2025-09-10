"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Leva, useControls } from "leva";
import Style from "./components/css/main.module.css";
import { ShaderText3DMatrix } from "./components/shaderText3D";
import { CinematicCamera } from "./components/cinematicCamera";
import { title } from "process";
import { ShaderMaterial } from "three";
import ScifiScreen from "./components/scifiScreen";

export default function Home() {
  const cameraRef = useRef<HTMLCanvasElement>(null);
  {/* 
  // On expose les uniforms à Leva pour pouvoir les piloter directement
  const { intensity, uSpeed, uTrailLen, uFlicker, uMatrixScale } = useControls({
    intensity: { value: 100, min: 0, max: 100, step: 0.1 },
    uSpeed: { value: 10, min: 0, max: 20, step: 0.5 },
    uTrailLen: { value: 10, min: 1, max: 50, step: 1 },
    uFlicker: { value: 20, min: 0, max: 50, step: 1 },
    uMatrixScale: { value: 10, min: 1, max: 30, step: 1 },
  });
  const titleRef = useRef<any>(null);
  const [titleIntensity, setTitleIntensity] = useState(10);
 
    useEffect(() => {    
      console.info(titleRef.current);
      if(titleRef.current){
        gsap.to(titleRef.current!.material.uniforms.uIntensity, {
          value: 0.5,
          duration: 3,
          ease: "power2.inOut",
        });
        gsap.to(titleRef.current!.shader.uniforms.uMatrixScale, {
          value: 1.0,
          duration: 3,
          ease: "power2.inOut",
        })
      }
    }, [titleRef]);
    
  */}

  return (
    <div className={Style.header} style={{ width: "100vw", height: "100vh" }}>
      {/* Leva reste en dehors du Canvas */}

      <Leva collapsed />

      <Canvas
        className={Style.header}
        ref={cameraRef}
        shadows
        camera={{ position: [0, 3, 10], fov: 42 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#350223ff");
          }}
          >
        { /* 
        <ShaderText3DMatrix
          ref={titleRef}
          text="MATRIX"
          texturePath={"/textures/matrix_glyph_atlas.png"}
          fontPath={"/fonts/Orbitron_Regular.json"}
          intensity={intensity}
          speed={uSpeed}
          trailLen={uTrailLen}
          flicker={uFlicker}
          matrixScale={uMatrixScale}
        />

        <OrbitControls />             
        */}        
        <CinematicCamera />
      </Canvas>
      <ScifiScreen
        title="Polingual"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
      />
    </div>
  );
}
