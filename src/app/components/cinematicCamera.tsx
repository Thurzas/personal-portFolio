import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ShaderGLTF } from "./shaderGLTF";
import { ShaderText3DMatrix } from "./shaderText3D";
import GlyphRain from "./GlyphRain";
import Sunset from "./sunset";
import { PlaneGeometry, ShaderMaterial, Vector3 } from "three";

export function CinematicCamera() {
  const { camera } = useThree();
  const [carVisible, setCarVisible] = useState(true);
  const [titleVisible, setTitleVisible] = useState(true);
  const [rainDensity, setRainDensity] = useState(1000);
  const [titleIntensity, setTitleIntensity] = useState(5);
  const carRef = useRef<any>(null);
  const titleRef = useRef<any>(null);

  // --- Timeline / animation ---
  useEffect(() => {
    if (carRef.current) {
      gsap.to(carRef.current.position, {
        z: 100,
        duration: 2,
        ease: "power2.inOut",
        delay: 25,
        onComplete: () => {
          setCarVisible(false);
          setTitleVisible(true);
          
        },
      });      
    }    

    setTitleVisible(false);
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    timeline.to(camera.position, { x: 2, y: 3, z: -40, duration: 15 });
    timeline.to(camera.position, { x: -10, y: 7, z: -80, duration: 15 });
    timeline.to(camera.position, { x: -7, y: 5, z: -72, duration: 5 });

    gsap.ticker.add(() => {
      camera.lookAt(0, 0, -50);
    });
  }, [camera]);

  return (
    <>
      {carVisible && (
        <ShaderGLTF
          ref={carRef}
          gltfPath="/delorean.glb"
          texturePath="/textures/matrix_glyph_atlas.png"
          position={[0, 0, -50]}
          scale={[0.25, 0.25, 0.25]}
        />
      )}

      {titleVisible && (
        <ShaderText3DMatrix
          ref={titleRef}
          text={"Welcome on my site"}
          texturePath={"/textures/matrix_glyph_atlas.png"}
          position={[1, 7, -55]}
          rotation={[0, Math.PI * 1.1, 0]}
          fontPath={"/fonts/Orbitron_Regular.json"}
          intensity={titleIntensity}
        />               
      )
      }
      {titleVisible && (
        <ShaderText3DMatrix
          ref={titleRef}
          text={"Mathieu Miot"}
          texturePath={"/textures/matrix_glyph_atlas.png"}
          position={[ 9, 5, -49]}
          rotation={[0, Math.PI * 1.1, 0]}
          fontPath={"/fonts/Orbitron_Regular.json"}
          intensity={5}

        />               
      )}


      <GlyphRain
        texturePath={"/textures/matrix_glyph_atlas.png"}
        count={rainDensity}
        speed={30}
      />
      <Sunset position={new Vector3(0,50,30)} />
    </>
  );
}
