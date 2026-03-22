import * as THREE from "three";

export function setupLighting(scene, fireplace_pos) {
  const fireLight = new THREE.PointLight(0xf05000, 0);
  fireLight.distance = 0.11;
  fireLight.castShadow = true;
  fireLight.position.set(
    fireplace_pos.x,
    fireplace_pos.y + 0.005,
    fireplace_pos.z,
  );
  scene.add(fireLight);

  const moonLight = new THREE.AmbientLight(0x4466aa, 1.0);
  scene.add(moonLight);

  return { fireLight, moonLight };
}
