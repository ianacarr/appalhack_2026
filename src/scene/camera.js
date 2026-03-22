import * as THREE from "three";

export function setupCamera(fireplace_pos) {
  const camera = new THREE.PerspectiveCamera(30, 1, 0.0001, 1);
  camera.position.set(0.2, 0.05, 0.07);
  camera.lookAt(
    fireplace_pos.x,
    fireplace_pos.y + 0.01,
    fireplace_pos.z - 0.001,
  );
  return camera;
}
