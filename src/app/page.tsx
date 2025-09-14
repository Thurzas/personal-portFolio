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
import useScreenType from "./components/useScrenType";

export default function Home() {
  const cameraRef = useRef<HTMLCanvasElement>(null);
  const screenType = useScreenType();

  let cameraPosition: [number, number, number] = [0, 3, 4]; // desktop default
  let fov = 42;

if (screenType === "tablet") {
  cameraPosition = [0, 2.5, -8] as const;
  fov = 50;
} else if (screenType === "mobile") {
  cameraPosition = [0, 2, 10] as const;
  fov = 55;
} else {
  cameraPosition = [0, 3, 15] as const;
  fov = 42;
}
  return (
    <>
      <div className={Style.header} style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          className={Style.header}
          ref={cameraRef}
          shadows
          camera={{ position: cameraPosition as [number, number, number], fov }}
          onCreated={({ gl }) => {
            gl.setClearColor("#350223ff");
            }}
            >
        <CinematicCamera viewType={screenType}/>
        </Canvas>
      </div>
      <div className={Style.subWrapper}>
        <ScifiScreen title="À propos de moi :" delay={32000}>
          <p>
            Je m'appelle Matt, développeur passionné par les technologies et la créativité. 
          </p>
          <p>
            À côté du code, je m'intéresse aux jeux de rôle sur papier (Donjons & Dragons, Cyberpunk), à l'impression 3D et à l'intelligence artificielle générative. 
          </p>
          <p>
            Actuellement, j'approfondis mes compétences en Python afin de mieux comprendre des frameworks tels que TensorFlow et Xformers.
          </p>
          <p>
            Je sors d'une formation commencée en novembre 2024 et je suis sur le marché de l'emploi depuis juin 2025.
          </p>               
        </ScifiScreen>

        <ScifiScreen title="mes réseaux :" delay={32500}>
          <p>
            <a href={"https://github.com/Thurzas"}>
            <img className={Style.icon} alt={"lien github vers mon profil"} src={"img/github-icon.svg"} /> Mon profil
            </a>
          </p>
          <p>
            <a href={"https://www.linkedin.com/in/mathieu-miot-15a065177/"}>
              <img className={Style.icon} alt={"lien linkedin "} src={"img/linkedin.svg"}/> Mon réseau
            </a>
          </p>
        </ScifiScreen>
        <ScifiScreen title="mon travail :" delay={33000}>
          <div className={Style.articles}>
            <article>
              <h4>le Cookie du patron</h4>
              <p>
                boutique en ligne d'une "dark kitchen" faite en équipe durant ma formation. Le front est codé avec React, et le back est une API managé par node.
              </p>
              <a href={"https://github.com/WildCodeSchool/nov24-RemFR-Vert-FullStackAlchemist-G2-P3"}>
                <img className={Style.icon} alt={"lien github vers le cookie du patron"} src={"img/github-icon.svg"} />
              </a>
              <img className={Style.photo} alt="image du site <le cookie du patron>" src="img/CookiPatron.png" />              
            </article>
            <article>
              <h4>maquette : La gazette du sorcier</h4>
              <p>
                forum écris en PHP ( et en équipe ).
              </p>
              <a href={"https://github.com/WildCodeSchool-2024-02/PHP-REM-POEC-05-Gazette-Sorciers"}>
                <img className={Style.icon} alt={"lien github vers le forum de la gazette du sorcier"} src={"img/github-icon.svg"} />
              </a>
              <img className={Style.photo} alt={"image du site <La gazette du sorcier>"} src={"img/forumGazetteDuSorcier.png"} />              
            </article>
            <article>
              <h4>prototype 1</h4>
              <p>blackhole project: teste de collision (inspiré du problème à n corps) </p>
              <img className={Style.photo} alt={"trou noir test de collision avec un quadtreee"} src={"img/blackhole.png"} />
              <a href={"https://codepen.io/Thurzas/pen/dyJzOLe"}>demonstration sur codepen</a>
            </article>
            <article>
              <h4>prototype 2</h4>
              <img className={Style.photo} alt={"image du prototype donjon procedural"} src={"img/procedural.png"} />
              <p><a href={"https://github.com/Thurzas/ProceduralDungeon"}>(Processing) Procedural Dungeon challenge</a></p>
            </article>
            <article>
              <h4>Prototype 3</h4>
              <img className={Style.photo} alt={"image de la simulation de colonie de fournie"} src={"img/ants.jpg"} />
              <p><a href={"https://github.com/Thurzas/ants"}>(Processing) Ant Colony Simulation</a></p>
            </article>
          </div>
        </ScifiScreen>

      </div>
    </>
  );
}
