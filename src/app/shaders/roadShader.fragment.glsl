#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 uSize;  
uniform vec3 uColorLines;
uniform vec3 uColorBackground;
uniform vec3 uNeonColor;
uniform float alpha;
varying vec2 vUv;

// Fonction pour dessiner un carré
float drawSquare(vec2 st, vec2 size) {
    vec2 bl = smoothstep(size - 0.01, size, st);
    vec2 tr = smoothstep(size - 0.01, size, 1.0 - st);
    return bl.x * bl.y * tr.x * tr.y;
}

float neonGlow(vec2 st, vec2 size, float glowStrength) {
    vec2 distToEdge = min(st, 1.0 - st);
    float edgeFactor = min(distToEdge.x, distToEdge.y);
    return smoothstep(0.0, glowStrength, edgeFactor);
}

void main() {
    vec2 st = vUv; 
    st *= uSize;  
    st = fract(st);  

    // Appliquer le motif du carré
    float pct = drawSquare(st, vec2(0.02));  
    float NeonPct = drawSquare(st, vec2(0.01));  
    float glow = neonGlow(st, vec2(0.4),0.5);    
    vec3 color = mix(uColorLines,uColorBackground, pct);  
    vec3 color2 = mix(vec3(1.0), color, NeonPct)*2.0;
    color += (1.0-glow)*0.5;
    gl_FragColor = vec4(color*color2, alpha);    
}