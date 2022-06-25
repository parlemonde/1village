import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const LOADER = new GLTFLoader();

export const loadGLB = async (path: string): Promise<Group> => {
  return new Promise((resolve) => {
    LOADER.load(
      path,
      (gltf) => {
        resolve(gltf.scene);
      },
      () => {},
      (error) => {
        console.error('An error happened loading the model...');
        console.error(error);
        resolve(new Group());
      },
    );
  });
};
