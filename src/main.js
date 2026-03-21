import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"
import "./style/main.css";

// RENDERING CODE BELOW 
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	30,
	window.innerWidth / window.innerHeight,
	0.0001,
	10,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
const gltf = await loader.loadAsync("/models/stylized_campfire/scene.gltf");
gltf.scene.traverse(function(child) {
	if (child.isMesh) {
		child.receiveShadow = true;
		child.castShadow = true;
	}
});
//
let fireplace_pos = new THREE.Vector3(0.075, 0.005, 0.04);

scene.add(gltf.scene);
//renderer.setClearColor(0xffffff, 1);
//camera.position = fireplace_pos + THREE.Vector3
camera.position.set(0.2, 0.05, 0.07);

camera.lookAt(fireplace_pos.x, fireplace_pos.y + 0.01, fireplace_pos.z - 0.001);

const light = new THREE.PointLight(0xF05000 * 1, 0.1);
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
	opacity: 0.5
});

class Particle {
	constructor () {
		this.pos = new THREE.Vector3(
			Math.random() * 0.01 - 0.005, 
			Math.random() * 0.0 - 0, 
			Math.random() * 0.01 - 0.005
		);
		this.pos.add(fireplace_pos);
		this.vel = new THREE.Vector3(
			Math.random() / 4000 - 1 / 8000, 
			Math.random() * 0.0001 + 0.0002, 
			Math.random() / 4000 - 1 / 8000
		);
	}
}

let num_particles = 200;
let particles = [];
for (let i = 0; i < num_particles; i++) {
	particles.push(new Particle());

	// on startup
	particles[i].pos.y += Math.random() * 0.05;
}

function animate(time) {
	// SLOWWWW LMFAO!!!!!!!!!!!
	let vertices = [];
	for (let i = 0; i < num_particles; i++) {
		let p = particles[i];
		p.vel.x *= 0.99; // x/z dampening
		p.vel.z *= 0.99; // x/z dampening
		p.pos.add(p.vel);
		if (p.pos.y > 0.05) {
			p = new Particle();
			particles[i] = p;
		}
		//console.log("penis");
		//console.log(particles[i].pos);
		vertices.push(p.pos.x);
		vertices.push(p.pos.y);
		vertices.push(p.pos.z);
	}
	
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute(
		"position", 
		new THREE.BufferAttribute(new Float32Array(vertices), 3)
	);

	const mesh = new THREE.Points(geometry, fire_material);
	scene.add(mesh);
	renderer.render(scene, camera);
	scene.remove(mesh);
}

renderer.setAnimationLoop(animate);