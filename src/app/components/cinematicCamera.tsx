import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ShaderGLTF } from "./shaderGLTF";
import { ShaderText3DMatrix } from "./shaderText3D";
import GlyphRain from "./GlyphRain";
import Sunset from "./sunset";
import { Vector3 } from "three";

interface CinematicCameraProps{
  viewType: string;
}
export function CinematicCamera( {viewType} : CinematicCameraProps ) {
  const { camera } = useThree();
  const [carVisible, setCarVisible] = useState(true);
  const [titleVisible, setTitleVisible] = useState(true);
  const [rainDensity, setRainDensity] = useState(1000);
  const [titleIntensity, setTitleIntensity] = useState(5);
  const [titleRotation, setTitleRotation] = useState([0,Math.PI,0] as [number, number, number]);
  const carRef = useRef<any>(null);
  const welcomeRef = useRef<any>(null);
  const nameRef = useRef<any>(null);

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
      if (welcomeRef.current) {
      gsap.to(welcomeRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.inOut",
        delay: 31,
        onComplete: () =>{
          setTitleRotation([0,0,0] as [number,number, number]);
        }
      });     
    }  
    setTitleVisible(false);  
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    timeline.to(camera.position, { x: 2, y: 3, z: -40, duration: 15 });
    switch(viewType)
    {
      case "mobile":
        timeline.to(camera.position, { x: -5, y: 7, z: -80, duration: 15 }); 
      break;

      default:
        timeline.to(camera.position, { x: -10, y: 7, z: -80, duration: 15 });
      break;
    }
    switch(viewType)
    {
      case "mobile":
        timeline.to(camera.position, { x: welcomeRef.current.position.x, y: welcomeRef.current.position.y+5, z: welcomeRef.current.position.z-30 , duration: 5 });

      break;

      default:
        timeline.to(camera.position, { x: welcomeRef.current.position.x+5, y: welcomeRef.current.position.y+15, z: welcomeRef.current.position.z-25, duration: 5 });        
      break;
    }
    
    gsap.ticker.add(() => {
      if(carVisible)
      {
        camera.lookAt(0,0,-50);
      } 
      else
      {
        camera.lookAt(welcomeRef.current.position);
      }
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
          ref={welcomeRef}
          text={"Welcome on my site"}
          texturePath={"/textures/matrix_glyph_atlas.png"}
          position={[1, 7, -55]}
          rotation={titleRotation}
          fontPath={"/fonts/Orbitron_Regular.json"}
          intensity={titleIntensity}
        />               
      )
      }
      {titleVisible && (
        <ShaderText3DMatrix
          ref={nameRef}
          text={"Mathieu Miot"}
          texturePath={"/textures/matrix_glyph_atlas.png"}
          position={[ 9, 5, -49]}
          rotation={titleRotation}
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
