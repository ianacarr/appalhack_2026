import * as THREE from "three";

export function setupLighting(scene, fireplace_pos) {
  const light = new THREE.PointLight(0xf05000, 0.1);
  light.distance = 0.11;
  light.castShadow = true;
  light.position.set(fireplace_pos.x, fireplace_pos.y + 0.005, fireplace_pos.z);
  scene.add(light);
}
