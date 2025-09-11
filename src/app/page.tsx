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
    cameraPosition = [0, 2.5, -8];
    fov = 50;
  } else if (screenType === "mobile") {
    cameraPosition = [0, 2, 6];
    fov = 55;
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
        <CinematicCamera cameraPos={cameraPosition as [number, number, number]}/>
        </Canvas>
      </div>
      <div className={Style.subWrapper}>
        <ScifiScreen title="À propos de moi :" delay={30000}>
          <p>
            Je suis développeur web React / R3F, ma formation a commencé en novembre
            2024, je suis sur le marché de l'emploi depuis juin 2025.
          </p>
        </ScifiScreen>

        <ScifiScreen title="Compétences :" delay={30500}>
          <h3>Développer la partie Front :</h3>
          <ul>
            <li>Maquetter une application.</li>
            <li>Réaliser une interface utilisateur web statique et adaptable.</li>
            <li>Développer une interface utilisateur web dynamique.</li>
            <li>
              Réaliser une interface utilisateur avec une solution de gestion de
              contenu ou e-commerce.
            </li>
          </ul>
          <h3>Développer la partie Back :</h3>
          <ul>
            <li>Créer une base de donnée.</li>
            <li>Développer les composants d'accès aux données.</li>
            <li>
              Développer la partie back-end d'une application web ou web mobile.
            </li>
            <li>
              Élaborer et mettre en œuvre des composants dans une application de
              gestion de contenu ou e-commerce.
            </li>
          </ul>
        </ScifiScreen>
        <ScifiScreen title="mon travail :" delay={31000}>
          <div className={Style.articles}>
            <article>
              <h4>prototype 1</h4>
              <p>blackhole project: teste de collision (inspiré du problème à n corps) </p>
              <img className={Style.photo} alt="Preuve N°1" src="img/blackhole.png" />
              <a href="https://codepen.io/Thurzas/pen/dyJzOLe">demonstration sur codepen</a>
            </article>
            <article>
              <h4>vieille maquette</h4>
              <img className={Style.photo} alt="Preuve N°2" src="img/null.png" />
              <p><a href="https://thurzas.github.io/DP001/index.html">Objectif : null</a></p>
            </article>
            <article>
              <h4>prototype 2</h4>
              <img className={Style.photo} alt="Preuve N°3" src="img/procedural.png" />
              <p><a href="https://github.com/Thurzas/ProceduralDungeon">(Processing) Procedural Dungeon challenge</a></p>
            </article>
            <article>
              <h4>Prototype 3</h4>
              <img className={Style.photo} alt="Preuve N°3" src="img/ants.jpg" />
              <p><a href="https://github.com/Thurzas/ants">(Processing) Ant Colony Simulation</a></p>
            </article>
          </div>
        </ScifiScreen>

      </div>
    </>
  );
}
