'use client';
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3 } from "three";
import fragmentShader from "../shaders/gridShader.fragment.glsl";
import vertexShader from "../shaders/mountainShader.vertex.glsl";
interface pos{
  position?: Vector3;
}
const Mountain = ({position}:pos) => {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position?position:new Vector3(0)}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ time: { value: 0 }, 
        uSize: {value: new Vector2(10, 10)},
        uColorLines: { value: new Color(0, 0.5, 0.5) },
        uColorBackground: { value: new Color(0, 0, 0.05) },
        u_resolution: {value: new Vector2( 20.0, 20.0)},
        uNeonColor: { value: new Color(0.0, 0.5, 0.5) },
        alpha:{value:1.0},
        uAmplitude:{value : 4.0},   // Amplitude du bruit (l'intensité de la distorsion)
        uFrequency:{value : 0.1},    // Fréquence du bruit (la taille des détails)
        uOctaves:{value : 4.0},     // Nombre d'octaves (détermine la complexité du bruit)
        uOffset:{value : new Vector2(0.0,0.0)},      // Offset pour décaler le bruit et éviter une répétition visible
      }}
      />
    </mesh>
  );
};

export default Mountain;
