precision highp float;

attribute float aGlyphIndex;
attribute float aYOffset;

varying vec2 vUv;
varying float vGlyphIndex;
varying float vYOffset;

void main() {
    vUv = uv;
    vGlyphIndex = aGlyphIndex;
    vYOffset = aYOffset;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
