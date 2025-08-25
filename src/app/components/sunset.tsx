'use client';
import { useRef } from "react";
import { invalidate, useFrame } from "@react-three/fiber";
import { Color, Mesh, PointLight, ShaderMaterial, Vector2, Vector3 } from "three";
import fragmentShader from "../shaders/striped.fragment.glsl";
import vertexShader from "../shaders/striped.vertex.glsl";
import { forwardRef } from "react";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";
interface pos{
  position?: Vector3;
}
const Sunset = forwardRef<Mesh, { position: Vector3 }>(({ position }, ref) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const sunRef =  useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      invalidate();
    }
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]} position={position?position:new Vector3(0)} >
      <sphereGeometry args={[3, 32, 32]}/>        
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={2} />
        {sunRef.current && ( // Vérifie que `sunRef.current` est défini
          <GodRays
            sun={sunRef}
            samples={60}
            density={0.96}
            decay={0.9}
            weight={0.4}
            exposure={0.8}
            clampMax={1}
            blur
            />
          )}        
      </EffectComposer>
      <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader} 
            uniforms= {{
              time: { value: 0 },
              uSize: { value: new Vector2(10.0, 10.0) }, // Taille du motif
              uColorA: { value: new Color(1.0, 0.8, 0) }, // orange
              uColorB: { value: new Color(1.0, 0, 0) }, // rouge
              uStripeWidth: { value: 0.5 }, // Largeur des rayures
              uTransparency: { value: 1.0 }, // 1.0 = totalement transparent
              uSpeed: { value: 1.0 },
            }}
            transparent={true} 
        />
    </mesh>
  );
});

export default Sunset;
