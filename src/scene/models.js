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
}
