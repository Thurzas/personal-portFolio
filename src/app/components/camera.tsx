import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Uniform } from "three";
import { useEffect, useMemo, useState } from "react";
import fragmentShader from "../shaders/raytracing.fragment.glsl";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

export default function RaytracingCamera() {
const { size } = useThree(); // Récupérer la taille du canvas
const RaytracingShader = {
    uniforms: {
      uCameraToWorld: new Uniform(new Float32Array(16)),
      uCameraInverseProjection: new Uniform(new Float32Array(16)),
      uResolution: new Uniform([size.width, size.height]),
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
     fragmentShader
  };    
  const shaderPass = useMemo(() => new ShaderPass(RaytracingShader), []);

  return (
    <>
      <EffectComposer>
        <primitive object={shaderPass} />
      </EffectComposer>
    </>
  );
}
