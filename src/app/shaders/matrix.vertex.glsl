// Assurez-vous d'inclure les variables pour la normale et la position
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // La normale doit être transformée dans le même espace que la position
    // Espace de la caméra (view space) ou espace global (world space) sont de bonnes options
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}