uniform float time;
uniform vec2 resolution;

// Atlas de glyphes
uniform sampler2D uGlyphs;
uniform float uAtlasSide;

// Paramètres du "Matrix Rain"
uniform float uCols;     
uniform float uRows;     
uniform float uFlicker;  
uniform float uTrailLen; 
uniform float uSpeed;    
uniform float uMatrixScale;
uniform float uIntensity;
varying vec3 vPosition;

// Hash simple pour randomiser la vitesse et les glyphes
float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Fonction utilitaire pour calculer le motif de la matrice
vec4 getMatrixPattern(vec2 st, float time) {
    vec2 grid = floor(st);
    vec2 uv = fract(st);

    // Vitesse et position de la traînée
    float speed = -uSpeed * (0.5 + 1.5 * hash(vec2(grid.x, 0.0)));
    float head = mod(time * speed, uRows);
    float distToHead = mod(grid.y - head + uRows, uRows);
    float intensity = 0.0;
    
    if(distToHead < uTrailLen){
        intensity = (uTrailLen - distToHead) / uTrailLen + uIntensity;
    }

    // Glyphes
    float tJitter = floor(time * uFlicker);
    float totalGlyphs = uAtlasSide * uAtlasSide;
    float glyphIndex = floor(hash(grid + tJitter) * totalGlyphs);
    float gx = mod(glyphIndex, uAtlasSide);
    float gy = floor(glyphIndex / uAtlasSide);
    vec2 glyphUV = (uv + vec2(gx, gy)) / uAtlasSide;

    vec4 g = texture2D(uGlyphs, glyphUV);

    vec3 glyphColor = vec3(0.0, 1.0, 0.2) * intensity;

    return vec4(glyphColor, g.a);
}

void main() {
    // Projection simple (pluie sur XY)
    vec2 st = vPosition.xy * uMatrixScale;
    vec4 color = getMatrixPattern(st, time);
    
    gl_FragColor = color;
}
