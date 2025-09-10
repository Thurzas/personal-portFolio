'use client';
import { useRef, forwardRef } from "react";
import { invalidate, useFrame } from "@react-three/fiber";
import { Mesh, ShaderMaterial, TextureLoader, Vector2, NearestFilter } from "three";
import fragmentShader from "../shaders/2Dmatrix.fragment.glsl";
import vertexShader from "../shaders/2Dmatrix.vertex.glsl";

const MatrixVision = forwardRef<Mesh, {
  width?: number;
  height?: number;
  cols?: number;
  rows?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  matrixScale?:number;
  intensity?:number;
}>(({ width = 2, height = 2, cols = 8, rows = 64, position=[0, 0, 0], rotation=[0,0,0], matrixScale=1, intensity=0.5}, ref) => {
  const materialRef = useRef<ShaderMaterial>(null);

  // Charge l’atlas une fois
  const texture = new TextureLoader().load("/textures/matrix_glyph_atlas.png");
  texture.generateMipmaps = false;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  useFrame(({ clock, size }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.time.value = clock.getElapsedTime();
    materialRef.current.uniforms.resolution.value.set(size.width, size.height);
    invalidate();
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time:        { value: 0 },
          resolution:  { value: new Vector2(0.5, 0.5) },
          uGlyphs:     { value: texture },
          uAtlasSide:  { value: 9.0 },
          uCols:       { value: cols },
          uRows:       { value: rows },
          uFlicker:    { value: 2.0 },
          uTrailLen:   { value: 8.0 }, 
          uSpeed:      { value: 15.0 },           
          uMatrixScale: { value: matrixScale },
          uIntensity: { value: intensity}
        }}
        transparent= {true}
        depthWrite= {false} // Ajout pour ignorer l'écriture dans le z-buffer
        depthTest= {true} // Pour que l'objet soit toujours visible
      />
    </mesh>
  );
});

MatrixVision.displayName = "MatrixVision";
export default MatrixVision;
