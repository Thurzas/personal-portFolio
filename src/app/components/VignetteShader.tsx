import { Uniform } from "three";
import { Effect } from "postprocessing";

class VignetteEffect extends Effect {
  constructor(strength = 1.5) {
    super("VignetteEffect", fragmentShader, {
      uniforms: new Map([["uStrength", new Uniform(strength)]]),
    });
  }
}

const fragmentShader = /* glsl */ `
  uniform float uStrength;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float dist = distance(uv, vec2(0.5)); // Distance du centre
    float vignette = smoothstep(0.8, uStrength, dist); // Ajustement progressif
    outputColor = inputColor * (1.0 - vignette); // Applique l'effet de masquage
  }
`;

export default VignetteEffect;
