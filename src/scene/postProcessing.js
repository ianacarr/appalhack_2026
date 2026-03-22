import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const PixelDitherShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) },
    pixelSize: { value: 2.0 },
    colorLevels: { value: 8.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    uniform float colorLevels;
    varying vec2 vUv;

    // 4x4 Bayer ordered dithering matrix, values in [0, 1)
    float bayer4x4(vec2 pos) {
      const float bayer[16] = float[16](
         0.0,  8.0,  2.0, 10.0,
        12.0,  4.0, 14.0,  6.0,
         3.0, 11.0,  1.0,  9.0,
        15.0,  7.0, 13.0,  5.0
      );
      int x = int(mod(pos.x, 4.0));
      int y = int(mod(pos.y, 4.0));
      return bayer[y * 4 + x] / 16.0;
    }

    void main() {
      // Snap UV to pixel grid, sample from block center
      vec2 pixelCoord = floor(vUv * resolution / pixelSize) * pixelSize;
      vec2 snappedUv = (pixelCoord + pixelSize * 0.5) / resolution;
      vec4 color = texture2D(tDiffuse, snappedUv);

      // brighten before quantizing cause too dark
      color.rgb = pow(color.rgb, vec3(0.6));

      // Centered Bayer threshold [-0.5, 0.4375] so it nudges equally up and down
      float t = bayer4x4(pixelCoord / pixelSize) - 0.5;
      color.r = clamp(floor(color.r * colorLevels + t + 0.5) / colorLevels, 0.0, 1.0);
      color.g = clamp(floor(color.g * colorLevels + t + 0.5) / colorLevels, 0.0, 1.0);
      color.b = clamp(floor(color.b * colorLevels + t + 0.5) / colorLevels, 0.0, 1.0);

      gl_FragColor = color;
    }
  `,
};

export function setupPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const ditherPass = new ShaderPass(PixelDitherShader);
  composer.addPass(ditherPass);

  composer.setSize(window.innerWidth, window.innerHeight);
  ditherPass.uniforms.resolution.value.set(
    window.innerWidth,
    window.innerHeight,
  );

  return { composer, ditherPass };
}
