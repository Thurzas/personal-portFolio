'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { ShaderText3DMatrix } from './shaderText3D'

export default function ShaderPlayground() {
  // 🎛️ On expose ici quelques uniforms de ton composant
  const { intensity, uSpeed, uTrailLen, uFlicker, uMatrixScale } = useControls({
    intensity: { value: 1.2, min: 0, max: 3, step: 0.1 },
    uSpeed: { value: 10, min: 0, max: 20, step: 0.5 },
    uTrailLen: { value: 10, min: 1, max: 50, step: 1 },
    uFlicker: { value: 20, min: 0, max: 50, step: 1 },
    uMatrixScale: { value: 10, min: 1, max: 30, step: 1 },
  })

  return (
    <>
      {/* GUI visible */}
      <Leva collapsed />
        <ShaderText3DMatrix
          text="MATRIX"
          texturePath={"/textures/matrix_glyph_atlas.png"}
          fontPath={"/fonts/Orbitron_Regular.json"}
          intensity={intensity}
          speed={uSpeed}
          // tu pourrais aussi faire un mapping direct si tu exposes d’autres uniforms dans ton composant
        />
        <OrbitControls />
    </>
  )
}
