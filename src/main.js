import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import "./style/main.css";
import downloadMenuInit from "./ui/downloadMenu";
import seedMenuInit from "./ui/seedMenu";
import settingMenuInit from "./ui/settingsMenu";
import WebTorrent from "webtorrent";

// RENDERING CODE BELOW
const scene = new THREE.Scene();
const client = new WebTorrent();

downloadMenuInit(client);
seedMenuInit(client);
settingMenuInit();

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
const gltf = await loader.loadAsync("/models/stylized_campfire/scene.gltf");
gltf.scene.traverse(function (child) {
  if (child.isMesh) {
    child.receiveShadow = true;
    child.castShadow = true;
  }
});
let fireplace_pos = new THREE.Vector3(0.075, 0.005, 0.04);
scene.add(gltf.scene);

const font_loader = new FontLoader();
const text_font = await font_loader.loadAsync("fonts/helvetiker_regular.typeface.json");
//renderer.setClearColor(0xffffff, 1);
//camera.position = fireplace_pos + THREE.Vector3
// setup camera
const camera = new THREE.PerspectiveCamera(30, 1, 0.0001, 1);
camera.position.set(0.2, 0.05, 0.07);
camera.lookAt(fireplace_pos.x, fireplace_pos.y + 0.01, fireplace_pos.z - 0.001);

// lighting
const light = new THREE.PointLight(0xf05000, 0.1);
light.distance = 0.11;
light.castShadow = true;
light.position.set(fireplace_pos.x, fireplace_pos.y + 0.005, fireplace_pos.z);
scene.add(light);

// fireplace particles
let fire_material = new THREE.PointsMaterial({
  size: 0.008,
  sizeAttenuation: true,
  color: new THREE.Color(1, 0.1, 0, 0),
  transparent: true,
  opacity: 0.5,
});

class Particle {
	constructor () {
		this.pos = new THREE.Vector3(
			Math.random() * 0.001 - 0.0005, 
			Math.random() * 0.0 - 0, 
			Math.random() * 0.001 - 0.0005
		);
		this.pos.add(fireplace_pos);
		this.vel = new THREE.Vector3(
			Math.random() / 1000- 1 / 2000, 
			Math.random() * 0.0005 + 0.0005, 
			Math.random() / 1000 - 1 / 2000
		);
	}
}

let num_particles = 200;
let particles = [];
for (let i = 0; i < num_particles; i++) {
  particles.push(new Particle());

  // on startup (so particles dont spawn ugly)
  particles[i].pos.y += Math.random() * 0.05;
} 

// figure out log positions for people to sit on
let logA = new THREE.Vector3(0.08, 0.01, 0.081);
let logA_dir = (new THREE.Vector3(0.05, 0.01, 0.048)).sub(logA);
logA_dir.multiplyScalar(1 / 4);

let logB = new THREE.Vector3(0.055, 0.012, 0.015);
let logB_dir = (new THREE.Vector3(0.1, 0.012, 0.004)).sub(logB);
logB_dir.multiplyScalar(1 / 4);

let num_loggers = 0;
function add_logger(ip) {
	num_loggers += 1;

	// select log
	let pos;
	if (num_loggers <= 5) {
		pos = logA.clone().add(logA_dir.clone().multiplyScalar(num_loggers - 1));
	} else {
		pos = logB.clone().add(logB_dir.clone().multiplyScalar(num_loggers - 6));
	}

	// body
	let geometry = new THREE.CapsuleGeometry(0.005, 0.01, 10, 10, 1);
	let material = new THREE.MeshLambertMaterial({color : 0x00FF00});
	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(pos.x, pos.y + 0.005, pos.z);
	scene.add(mesh);

	// text (ip)
	let text_geometry = new TextGeometry(ip, {
		font: text_font,
		size: 0.01,
		depth: 0.01
	});
	let text_material = new THREE.MeshBasicMaterial({color : 0xFFFFFF});
	let text_mesh = new THREE.Mesh(text_geometry, text_material);
	text_mesh.position.set(pos.x, pos.y + 0.01, pos.z);
	scene.add(text_mesh);
}

//for (let i = 0; i < 10; i++) {
	add_logger("192.168.0.1");
//}

// DRAW FUNCTION.. RUNS EVERY FRAME
var prev_time = 0.0;
function animate(time) {
	let delta_time = (time - prev_time) / 50;
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
	let vertices = [];
	particles.forEach(function(p, i) {
		p.vel.x *= 0.995; // x/z dampening
		p.vel.z *= 0.995; // x/z dampening
		p.pos.add(p.vel.clone().multiplyScalar(delta_time));
		if (p.pos.y > 0.05) {
			p = new Particle();
			particles[i] = p;
		}
		//console.log("penis");
		//console.log(particles[i].pos);
		vertices.push(p.pos.x);
		vertices.push(p.pos.y);
		vertices.push(p.pos.z);
	});
	
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute(
		"position", 
		new THREE.BufferAttribute(new Float32Array(vertices), 3)
	);

  const mesh = new THREE.Points(geometry, fire_material);
  scene.add(mesh);

  renderer.render(scene, camera);

  // fireplace
  scene.remove(mesh);
}

renderer.setAnimationLoop(animate);
