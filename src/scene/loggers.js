import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// log positions for people to sit on
const logA = new THREE.Vector3(0.08, 0.01, 0.081);
const logA_dir = new THREE.Vector3(0.05, 0.01, 0.048).sub(logA);
logA_dir.multiplyScalar(1 / 4);

const logB = new THREE.Vector3(0.055, 0.012, 0.015);
const logB_dir = new THREE.Vector3(0.1, 0.012, 0.004).sub(logB);
logB_dir.multiplyScalar(1 / 4);

let num_loggers = 0;

export function add_logger(ip, scene, camera, text_font) {
  num_loggers += 1;

  // select log
  let pos;
  let dir;
  if (num_loggers <= 5) {
    pos = logA.clone();
    dir = logA_dir.clone().multiplyScalar(num_loggers - 1);
  } else {
    pos = logB.clone();
    dir = logB_dir.clone().multiplyScalar(num_loggers - 6);
  }
  pos.add(dir);

  // body
  let geometry = new THREE.CapsuleGeometry(0.005, 0.01, 10, 10, 1);
  let material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y + 0.005, pos.z);
  scene.add(mesh);

  // text (ip)
  let text_geometry = new TextGeometry(ip, {
    font: text_font,
    size: 0.002,
    depth: 0.001,
  });
  let text_material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let text_mesh = new THREE.Mesh(text_geometry, text_material);
  text_mesh.position.set(pos.x, pos.y + 0.017, pos.z);
  let dir_to_camera = pos.clone().sub(camera.position);
  text_mesh.setRotationFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    Math.atan(-dir_to_camera.z / dir_to_camera.x) + Math.PI / 2,
  );
  text_geometry.computeBoundingBox();
  const bb = text_geometry.boundingBox;
  const cox = -0.5 * (bb.max.x - bb.min.x);
  const coy = -0.5 * (bb.max.y - bb.min.y);
  text_geometry.translate(cox, coy, 0);
  scene.add(text_mesh);

  // add whatever
}
