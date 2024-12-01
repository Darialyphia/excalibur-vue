#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_graphic_resolution;
uniform sampler2D u_graphic;
uniform vec4 uInputClamp;

const float DOUBLE_PI = 2.f * 3.14159265358979323846264f;

// Inigo Quilez pixel art filter https://jorenjoestar.github.io/post/pixel_art_filtering/
vec2 uv_iq(in vec2 uv, in vec2 texture_size) {
  vec2 pixel = uv * texture_size;

  vec2 seam = floor(pixel + .5f);
  vec2 dudv = fwidth(pixel);
  pixel = seam + clamp((pixel - seam) / dudv, -.5f, .5f);

  return pixel / texture_size;
}

void main() {
  vec2 newUv = uv_iq(v_uv, u_graphic_resolution);

  const float TAU = 6.28318530f;
  const float steps = 4.0f; // up/down/left/right pixels
  float radius = 1.0f;

  vec3 outlineColor = vec3(1.0f, 1.0f, 1.0f);

  vec2 aspect = 1.0f / vec2(textureSize(u_graphic, 0));

  for (float i = 0.0f; i < TAU; i += TAU / steps) {
    // Sample image in a circular pattern
    vec2 offset = vec2(sin(i), cos(i)) * aspect * radius;
    vec4 col = texture(u_graphic, newUv + offset);
    // Mix outline with background
    float alpha = col.a;
    fragColor = mix(fragColor, vec4(outlineColor, 1.0f), alpha); // apply outline
  }
  // Overlay original texture
  vec4 sourceColor = texture(u_graphic, newUv);
  float factor = sourceColor.a;
  fragColor = mix(fragColor, sourceColor, factor);
}