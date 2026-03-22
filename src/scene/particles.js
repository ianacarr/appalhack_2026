import * as THREE from "three";

export const fire_material = new THREE.PointsMaterial({
  size: 0.008,
  sizeAttenuation: true,
  color: new THREE.Color(1, 0.1, 0, 0),
  transparent: true,
  opacity: 0.5,
});

export class Particle {
  constructor(fireplace_pos) {
    this.pos = new THREE.Vector3(
      Math.random() * 0.001 - 0.0005,
      Math.random() * 0.0 - 0,
      Math.random() * 0.001 - 0.0005,
    );
    this.pos.add(fireplace_pos);
    this.vel = new THREE.Vector3(
      Math.random() / 1000 - 1 / 2000,
      Math.random() * 0.0005 + 0.0005,
      Math.random() / 1000 - 1 / 2000,
    );
  }
}

export function initParticles(fireplace_pos) {
  const num_particles = 200;
  const particles = [];
  for (let i = 0; i < num_particles; i++) {
    particles.push(new Particle(fireplace_pos));
    // on startup (so particles dont spawn ugly)
    particles[i].pos.y += Math.random() * 0.05;
  }
  return particles;
}

export function updateParticles(particles, fireplace_pos, delta_time) {
  let vertices = [];
  particles.forEach(function (p, i) {
    p.vel.x *= 0.995; // x/z dampening
    p.vel.z *= 0.995; // x/z dampening
    p.pos.add(p.vel.clone().multiplyScalar(delta_time));
    if (p.pos.y > 0.05) {
      p = new Particle(fireplace_pos);
      particles[i] = p;
    }
    vertices.push(p.pos.x);
    vertices.push(p.pos.y);
    vertices.push(p.pos.z);
  });
  return vertices;
}
