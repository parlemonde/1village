import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const LOADER = new GLTFLoader();

export const loadGLB = async (path: string): Promise<THREE.Group> => {
  return new Promise((resolve) => {
    LOADER.load(
      path,
      (gltf) => {
        resolve(gltf.scene);
      },
      (xhr) => {
        // eslint-disable-next-line no-console
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened loading the map...');
        console.error(error);
        resolve(new THREE.Group());
      },
    );
  });
};
