import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderGLTF } from "./shaderGLTF";
import { ShaderText3DMatrix } from "./shaderText3D";
import GlyphRain from "./GlyphRain";
import Sunset from "./sunset";
import { Vector3 } from "three";

gsap.registerPlugin(ScrollTrigger);

interface CinematicCameraProps {
  viewType: string;
}

export function CinematicCamera({ viewType }: CinematicCameraProps) {
  const { camera } = useThree();
  const carRef = useRef<any>(null);
  const nameRef = useRef<any>(null);
  const [titleVisible, setTitleVisible] = useState(false);
useEffect(() => {
  const ctx = gsap.context(() => {
    // Étape 1
    gsap.to(camera.position, {
      x: 0,
      y: 3,
      z: -40,
      scrollTrigger: {
        trigger: "#section-1",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (self.progress < 0.8) {
            setTitleVisible(false);
          }
        },
      },
    });

    // Étape 2
    gsap.to(camera.position, {
      x: viewType === "mobile" ? -5 : -10,
      y: 3,
      z: -20,
      scrollTrigger: {
        trigger: "#section-2",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (self.progress > 0.2) {
            setTitleVisible(true);
          } else {
            setTitleVisible(false);
          }
        },
      },
    });

    gsap.ticker.add(() => {
      if (carRef.current) {
        camera.lookAt(carRef.current.position);
      }
    });
  });

  return () => ctx.revert();
}, [camera, viewType]);

  return (
    <>
      <ShaderGLTF
        ref={carRef}
        gltfPath="/delorean.glb"
        texturePath="/textures/matrix_glyph_atlas.png"
        position={[0, 0, -50]}
        scale={[0.25, 0.25, 0.25]}
      />
      {titleVisible && (
        <>
          <ShaderText3DMatrix
            text={"Welcome on my site"}
            texturePath={"/textures/matrix_glyph_atlas.png"}
            position={[1, 7, -55]}
            rotation={[0, 0, 0]}
            fontPath={"/fonts/Orbitron_Regular.json"}
            intensity={5}
          />

          <ShaderText3DMatrix
            ref={nameRef}
            text={"Mathieu Miot"}
            texturePath={"/textures/matrix_glyph_atlas.png"}
            position={[9, 5, -49]}
            rotation={[0, 0, 0]}
            fontPath={"/fonts/Orbitron_Regular.json"}
            intensity={5}
          />          
        </>
      )}
      {/* Effets */}
      <GlyphRain
        texturePath={"/textures/matrix_glyph_atlas.png"}
        count={1000}
        speed={30}
      />
      <Sunset position={new Vector3(0, 50, 30)} />
    </>
  );
}