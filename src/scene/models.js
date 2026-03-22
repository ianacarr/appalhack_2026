import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function loadModels(scene, fireplace_pos) {
  loader.load("/models/stylized_campfire/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.traverse(function (child) {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
    scene.add(model);
  });

  loader.load("/models/signpost/SignPostglb.glb", (gltf) => {
    const model = gltf.scene;
    model.position.set(0.075, 0.005, 0);
    model.scale.set(0.01, 0.01, 0.01);
    model.rotation.set(0, Math.PI / 2 - 0.45, 0);
    scene.add(model);
  });
}
