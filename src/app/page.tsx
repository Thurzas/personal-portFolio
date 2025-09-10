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

  return (
    <div className={Style.header} style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        className={Style.header}
        ref={cameraRef}
        shadows
        camera={{ position: [0, 3, 10], fov: 42 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#350223ff");
          }}
          >
      <CinematicCamera />
      </Canvas>
      <ScifiScreen
        title="à propos de moi :"
      >
        <p>
          Je suis développeur web React / R3F, ma formation à commencé en novembre 2024, je suis sur le marché de l'emploi depuis Juin 2025. 
        </p>
      </ScifiScreen>
      <ScifiScreen
        title="Compétences :"        
      >
          <p>Développer la partie Front :</p>
          <ul>
            <li>
              Maquetter une application.
            </li>
            <li>
              Réaliser une interface utilisateur web statique et adaptable.
            </li>
            <li>
              Développer une interface utilisateur web dynamique.
            </li>
            <li>
              Réaliser une interface utilisateur avec une solution de gestion de contenu ou e-commerce.
            </li>
          </ul> 
          
        </ScifiScreen>

    </div>
  );
}
