precision mediump float;

uniform sampler2D uGlyphs;
uniform float uCols;
uniform float uRows;
uniform float uTime;
uniform float uTrailLength;
uniform float uTrailFade;
uniform float uGlyphSpacing; 
uniform float uGlyphWidth;
uniform float uGlyphHeight;
varying vec2 vUv;
varying float vGlyphIndex;

vec2 glyphUV(float glyph, vec2 uv) {
    float col = mod(glyph, uCols);
    float row = floor(glyph / uCols);

    vec2 base = vec2(col, row) / vec2(uCols, uRows);
    vec2 cell = uv / vec2(uCols, uRows);

    return base + cell;
}

void main() {
    float gIndex = vGlyphIndex;
    vec4 col = vec4(0.0);

    // hauteur d’un seul glyphe en UV
    //float glyphHeight = 1.0 / uRows;

    vec3 glyphColor = vec3(0.0, 1.0, 0.0);

    for (int i = 0; i < 64; i++) {
        if (float(i) >= uTrailLength) break;

        float offset = float(i) * (uGlyphSpacing + uGlyphHeight);
        float fade = pow(1.0 - (float(i) / uTrailLength), uTrailFade);

        vec2 uv = glyphUV(gIndex, vUv + vec2(0.0, -offset));

        vec4 tex = texture2D(uGlyphs, uv);
        col += vec4(glyphColor * tex.a, tex.a) * fade;
    }

    gl_FragColor = clamp(col, 0.0, 1.0);
}
