import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import "./style/main.css";
import downloadMenuInit from "./ui/downloadMenu";
import seedMenuInit from "./ui/seedMenu";
import WebTorrent from "webtorrent";

import { setupCamera } from "./scene/camera";
import { setupLighting } from "./scene/lighting";
import { loadModels } from "./scene/models";
import {
  fire_material,
  initParticles,
  updateParticles,
} from "./scene/particles";
import { add_logger } from "./scene/loggers";
import { transferState } from "./state";
import { setupPostProcessing } from "./scene/postProcessing";

const scene = new THREE.Scene();
const client = new WebTorrent();

const onWire = (ip) => add_logger(ip, scene, camera, text_font);

downloadMenuInit(client, onWire);
seedMenuInit(client, onWire);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const fireplace_pos = new THREE.Vector3(0.075, 0.005, 0.04);

loadModels(scene, fireplace_pos);

const font_loader = new FontLoader();
const text_font = await font_loader.loadAsync(
  "fonts/helvetiker_regular.typeface.json",
);

const camera = setupCamera(fireplace_pos);
const { fireLight, moonLight } = setupLighting(scene, fireplace_pos);

const particles = initParticles(fireplace_pos);

const { composer, ditherPass } = setupPostProcessing(renderer, scene, camera);

var prev_time = 0.0;
function animate(time) {
  let delta_time = Math.min((time - prev_time) / 50, 100 / 50);
  prev_time = time;

  // fix camera/viewport
  const w = window.innerWidth,
    h = window.innerHeight;
  renderer.setSize(w, h);
  composer.setSize(w, h);
  ditherPass.uniforms.resolution.value.set(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  // fade lights based on transfer state
  const targetFire = transferState.active ? 0.1 : 0;
  const targetMoon = transferState.active ? 0 : 1.0;
  const t = 0.03 * delta_time;
  fireLight.intensity += (targetFire - fireLight.intensity) * t;
  moonLight.intensity += (targetMoon - moonLight.intensity) * t;

  // fade particle opacity with fire, skip rendering when invisible
  fire_material.opacity = (fireLight.intensity / 0.1) * 0.5;
  if (fireLight.intensity > 0.002) {
    // SLOWWWW !!!!!!!!!!!
    const vertices = updateParticles(particles, fireplace_pos, delta_time);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3),
    );

    const mesh = new THREE.Points(geometry, fire_material);
    scene.add(mesh);
    composer.render();
    scene.remove(mesh);
  } else {
    composer.render();
  }
}

renderer.setAnimationLoop(animate);
