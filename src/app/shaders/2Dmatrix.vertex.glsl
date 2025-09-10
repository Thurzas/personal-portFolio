attribute float glyphIndex;
varying vec2 vUv;
varying float vGlyphIndex;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vGlyphIndex = glyphIndex;
  // Position en espace monde
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
