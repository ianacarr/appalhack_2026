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
  Particle,
} from "./scene/particles";
import { add_logger } from "./scene/loggers";

// --- Setup ---
const scene = new THREE.Scene();
const client = new WebTorrent();

downloadMenuInit(client);
seedMenuInit(client);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const fireplace_pos = new THREE.Vector3(0.075, 0.005, 0.04);

loadModels(scene, fireplace_pos);

const font_loader = new FontLoader();
const text_font = await font_loader.loadAsync(
  "fonts/helvetiker_regular.typeface.json",
);

const camera = setupCamera(fireplace_pos);
setupLighting(scene, fireplace_pos);

const particles = initParticles(fireplace_pos);

for (let i = 0; i < 10; i++) {
  add_logger("192.168.0." + i, scene, camera, text_font);
}

// --- Animation Loop ---
var prev_time = 0.0;
function animate(time) {
  let delta_time = Math.min((time - prev_time) / 50, 100 / 50);
  prev_time = time;

  // fix camera/viewport
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // PESUDOCODE FOR SIGN BUTTONS
  /*
	// take worldspace position and "project" it to screen (3d -> 2d)
	let position_of_sign = new THREE.Vector4(
		fireplace_pos.x + 0.01,
		fireplace_pos.y + 0.01,
		fireplace_pos.z + 0.01,
		1 // this '1' is important. Dont change it
	);
	let position_onscreen = position_of_sign * camera.projectionMatrix;
	// IMPORTANT! screen location must be normalized!
	position_onscreen.x /= position_onscreen.w;
	position_onscreen.y /= position_onscreen.w;
	// ^these values will range from -1 to 1
	MY_BUTTON.setLocation(position_onscreen.x, position_onscreen.y);
	*/

  // SLOWWWW !!!!!!!!!!!
  const vertices = updateParticles(particles, fireplace_pos, delta_time);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  );

  const mesh = new THREE.Points(geometry, fire_material);
  scene.add(mesh);

  renderer.render(scene, camera);
  scene.remove(mesh);
}

renderer.setAnimationLoop(animate);
