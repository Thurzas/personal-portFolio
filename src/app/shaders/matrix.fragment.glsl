uniform float time;
uniform vec2 resolution;

// Atlas de glyphes
uniform sampler2D uGlyphs;
uniform float uAtlasSide;

// Paramètres du "Matrix Rain"
uniform float uCols;     // nb de colonnes
uniform float uRows;     // nb de lignes
uniform float uFlicker;  // vitesse de changement de glyphe
uniform float uTrailLen; // longueur max de la traînée (ici 5)
uniform float uSpeed; // longueur max de la traînée (ici 5)
uniform float uMatrixScale;

varying vec3 vNormal;
varying vec2 vUv;
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
    // Si la cellule est dans la traînée
    if(distToHead < uTrailLen){
        // Tête très brillante, traînée décroissante
        intensity = (uTrailLen - distToHead)*4.0 / uTrailLen;

        // Option 1: Puissance (recommandé)
        // Rend le haut de la traînée plus intense. Ajustez la puissance (2.0)
        // pour contrôler la luminosité du haut.
        intensity = pow(intensity, 1.5); // Ou une autre valeur, comme 1.5, 3.0, etc.
        
        // Option 2: Ajout d'une constante (plus simple)
        // Ajoute un boost de luminosité constant à la traînée
        // intensity = (uTrailLen - distToHead) / uTrailLen + 0.2; // Ajustez la valeur (0.2)
    }

    // Glyphes
    float tJitter = floor(time * uFlicker);
    float totalGlyphs = uAtlasSide * uAtlasSide;
    float glyphIndex = floor(hash(grid + tJitter) * totalGlyphs);
    float gx = mod(glyphIndex, uAtlasSide);
    float gy = floor(glyphIndex / uAtlasSide);
    vec2 glyphUV = (uv + vec2(gx, gy)) / uAtlasSide;

    // Échantillonnage du glyphe (blanc sur alpha)
    vec4 g = texture2D(uGlyphs, glyphUV);

    // Couleur verte classique Matrix
    vec3 glyphColor = vec3(0.0, 1.0, 0.2) * intensity;

    //vec3 outColor = mix(vec3(0.0), glyphColor, g.a);

    return vec4(glyphColor, g.a);
}

void main() {
    // Projections pour chaque axe
    vec2 stX = vPosition.yz * uMatrixScale;
    vec2 stY = vPosition.xz * uMatrixScale;
    vec2 stZ = vPosition.xy * uMatrixScale;

    // Calcul des couleurs pour chaque projection
    vec4 colorX = getMatrixPattern(stX, time);
    vec4 colorY = getMatrixPattern(stY, time);
    vec4 colorZ = getMatrixPattern(stZ, time);

    // Normales absolues pour le mélange
    vec3 blendWeights = abs(vNormal);
    // Assurez-vous que la somme des poids est 1
    blendWeights = blendWeights / (blendWeights.x + blendWeights.y + blendWeights.z);

    // Mélange des couleurs et de l'alpha
    vec4 finalColor = colorX * blendWeights.x + colorY * blendWeights.y + colorZ * blendWeights.z;

    // Mélange des couleurs
    gl_FragColor = finalColor;
}
