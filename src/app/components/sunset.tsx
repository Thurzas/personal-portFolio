'use client';
import { useMemo, useRef, useState } from "react";
import { invalidate, useFrame } from "@react-three/fiber";
import { Color, Mesh, NearestFilter, PointLight, ShaderMaterial, TextureLoader, Vector2, Vector3 } from "three";
import fragmentShader from "../shaders/matrix.fragment.glsl";
import vertexShader from "../shaders/matrix.vertex.glsl";
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
  const [texturePath,setTexturePath] = useState<string>("/textures/matrix_glyph_atlas.png");
  const texture = useMemo(() => {
    const t = new TextureLoader().load(texturePath);
    t.generateMipmaps = false;
    t.magFilter = NearestFilter;
    t.minFilter = NearestFilter;
    return t;
  }, [texturePath]);

   useFrame(({ clock, size }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.resolution.value.set(size.width, size.height);
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
              resolution: { value: new Vector2(0.5,0.5) },
              uGlyphs: { value: texture },
              uAtlasSide:  { value: 9.0 },
              uCols: { value: 16.0 },
              uRows: { value: 64.0 },
              uFlicker: { value: 10.0 },
              uTrailLen: { value: 25.0 },
              uSpeed: { value: 50.0 },
              uMinUv: { value: 0 },
              uMaxUv: { value: 50 },
              uMatrixScale: { value: 5 },
              uIntensity: { value: 2.0},
            }}
            transparent={true} 
        />
    </mesh>
  );
});

export default Sunset;
