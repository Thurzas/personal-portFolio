#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 uSize;
uniform vec3 uColorA;  // Couleur du haut (ex: orange)
uniform vec3 uColorB;  // Couleur du bas (ex: rouge)
uniform float uStripeWidth;
uniform float uTransparency;
uniform float uSpeed;
varying vec2 vUv;

void main() {
    vec2 st = vUv * uSize;

    // Dégradé sur tout le fond (du bas vers le haut)
    float gradientFactor = smoothstep(0.0, 1.0, st.y*0.12);
    vec3 gradientColor = mix(uColorB, uColorA, gradientFactor); 

    // Animation : déplacement des rayures
    float stripes = step(uStripeWidth, mod(st.y + time * uSpeed, 1.0));

    // Appliquer la transparence aux rayures
    float alpha = mix(1.0, 0.0, stripes * uTransparency);

    gl_FragColor = vec4(gradientColor, alpha);
}
