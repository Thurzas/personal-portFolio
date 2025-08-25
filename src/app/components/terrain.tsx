"use client";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, ShaderMaterial, Vector2, Vector3, WebGLRenderTarget, PerspectiveCamera, Mesh } from "three";
import fragmentShader from "../shaders/gridShader.fragment.glsl";
import vertexShader from "../shaders/roadShader.vertex.glsl";

interface pos {
  position?: Vector3;
}

const Terrain = ({ position }: pos) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const planeRef = useRef<Mesh>(null);
  const { scene, gl, camera } = useThree();

  // Création du render target et de la caméra miroir
  const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight);
  const reflectionCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

  useFrame(() => {
    if (materialRef.current && planeRef.current) {
      // Mise à jour de l'uniforme "time"
      materialRef.current.uniforms.time.value += 0.01;

      // Positionner la caméra miroir sous le plan
      reflectionCamera.position.set(camera.position.x, -camera.position.y, camera.position.z);
      reflectionCamera.lookAt(new Vector3(0, 0, 0));

      // Rendu de la scène sur le render target
      gl.setRenderTarget(renderTarget);
      gl.render(scene, reflectionCamera);
      gl.setRenderTarget(null);

      // Mise à jour de la texture de réflexion
      materialRef.current.uniforms.reflectionTexture.value = renderTarget.texture;
    }
  });

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={position || new Vector3(0)}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          uSize: { value: new Vector2(10, 10) },
          alpha: { value: 1.0 },
          uColorLines: { value: new Color(0, 0.5, 0.5) },
          uColorBackground: { value: new Color(0, 0, 0.05) },
          u_resolution: { value: new Vector2(20.0, 20.0) },
          uNeonColor: { value: new Color(0.0, 0.5, 0.5) },
          reflectionTexture: { value: null }, // Uniform pour la réflexion
        }}
      />
    </mesh>
  );
};

export default Terrain;
