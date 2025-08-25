#ifdef GL_ES
precision mediump float;
#endif

// Uniforms
uniform vec2 u_resolution;  // Résolution de l'écran ou du rendu
uniform float time;       // Temps pour l'animation (si tu veux animer le bruit)
uniform float uAmplitude;
uniform float uFrequency;
varying vec2 vUv;
// Fonction pour générer un bruit pseudo-aléatoire 2D
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Fonction de bruit (Perlin-like)
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Quatre coins dans un carré
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f); // Lissage (smoothstep)

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

// Fonction Fractal Brownian Motion (FBM)
#define OCTAVES 4
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    // Loop sur les octaves pour calculer le bruit fractal
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.0;       // Augmenter la fréquence
        amplitude *= 0.5; // Réduire l'amplitude
    }

    return value;
}

void main() {
  vUv = uv;

  // Calcul du bruit fractal
  float distortion = fbm(vUv / uFrequency) * uAmplitude;

  // Calcul du lissage vers les bords (0 aux bords, 1 au centre)
  float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(0.0, 0.2, vUv.y) * 
                   smoothstep(0.0, 0.2, 1.0 - vUv.x) * smoothstep(0.0, 0.2, 1.0 - vUv.y);

  distortion *= edgeFade; // Atténuer la distorsion sur les bords

  // Application à la position
  vec3 newPosition = position + normal * distortion;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}