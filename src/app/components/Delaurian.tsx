import { useMemo, useRef, useEffect } from "react";
import { ShaderMaterial, TextureLoader, NearestFilter, Vector2, Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import vertexShader from "../shaders/matrix.vertex.glsl";
import fragmentShader from "../shaders/matrix.fragment.glsl";
import { useFrame } from "@react-three/fiber";

export const Delaurian = () => {
  const materialRef = useRef<ShaderMaterial>(null);
  const cols = 16;
  const rows = 64;

  const texture = useMemo(() => {
    const t = new TextureLoader().load("/textures/matrix_glyph_atlas.png");
    t.generateMipmaps = false;
    t.magFilter = NearestFilter;
    t.minFilter = NearestFilter;
    return t;
  }, []);

  const { scene } = useGLTF("/betterDelaurian.glb");

  // Crée le shaderMaterial une fois
  const shaderMat = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time:        { value: 0 },
        resolution:  { value: new Vector2(1, 1) },
        uGlyphs:     { value: texture },
        uAtlasSide:  { value: 9.0 },
        uCols:       { value: cols },
        uRows:       { value: rows },
        uFlicker:    { value: 2.0 },
        uTrailLen:   { value: 10.0 },
        uSpeed:      { value: 25.0 },
      },
      transparent: false,
    });
  }, [texture]);

  // Applique le shaderMaterial à tous les meshes du modèle
  useEffect(() => {
    scene.traverse((child: any) => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).material = shaderMat;
      }
    });
  }, [scene, shaderMat]);

  useFrame(({ clock }) => {
    if (!shaderMat) return;
    shaderMat.uniforms.time.value = clock.getElapsedTime();
  });

  return (  
    <primitive
      object={scene}
      position={[-9, -0.85, 2]}
      scale={[0.75, 0.75, 0.75]}
      rotation={[0, -Math.PI / 2, 0]}
    />
  );
};
