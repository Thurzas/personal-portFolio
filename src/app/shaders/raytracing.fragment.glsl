#version 300 es

precision highp float;
out vec4 FragColor;

uniform mat4 uCameraToWorld;       // Matrice de transformation caméra vers monde
uniform mat4 uCameraInverseProjection; // Matrice d'inverse de projection
uniform vec2 uResolution;         // Résolution de l'écran

struct Ray {
    vec3 origin;
    vec3 direction;
};

Ray CreateRay(vec3 origin, vec3 direction) {
    Ray ray;
    ray.origin = origin;
    ray.direction = normalize(direction);
    return ray;
}

Ray CreateCameraRay(vec2 uv) {
    // Transforme l'origine de la caméra dans l'espace monde
    vec3 origin = (uCameraToWorld * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    // Inverse la projection perspective pour récupérer la direction
    vec3 direction = (uCameraInverseProjection * vec4(uv, 0.0, 1.0)).xyz;
    direction = normalize((uCameraToWorld * vec4(direction, 0.0)).xyz);

    return CreateRay(origin, direction);
}

void main() {
    // Calcul des coordonnées UV
    vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
    uv.y *= uResolution.y / uResolution.x; // Correction d'aspect ratio

    // Création du rayon depuis la caméra
    Ray ray = CreateCameraRay(uv);

    // Coloration du rayon en fonction de la direction
    FragColor = vec4(ray.direction * 0.5 + 0.5, 1.0);
}
