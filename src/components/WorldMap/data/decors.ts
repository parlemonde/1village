import type { GlobeInstance } from 'globe.gl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

import { disposeNode } from '../lib/clear-scene';

import { DataClass } from './data.types';

const loader = new GLTFLoader();

const loadGLB = async (path: string): Promise<THREE.Group> => {
  return new Promise((resolve) => {
    loader.load(
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

export class Decors extends DataClass {
  public id = 'decors';
  private decors: THREE.Object3D | null = null;
  private data: THREE.Object3D[] = [];

  public getData = async (): Promise<void> => {
    this.decors = await loadGLB('/earth/decors.glb');
    this.decors.rotateY((76 * Math.PI) / 180);
    const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(140, 140, 0);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-140, 140, 0);
    this.data = [this.decors, light1, light2];
  };

  public showData(globe: GlobeInstance, _zoom: number, showDecors: boolean): void {
    globe
      .customLayerData(this.data)
      .customLayerLabel(() => '')
      .customThreeObject((o: THREE.Object3D) => o);
    this.updateData(globe, showDecors);
  }

  public updateData(_globe: GlobeInstance, showDecors: boolean): void {
    if (this.decors === null) {
      return;
    }

    this.decors.visible = showDecors;
    if (showDecors) {
      this.decors.scale.set(20, 20, 20);
    } else {
      this.decors.scale.set(1, 1, 1);
    }
  }

  public onZoom(): void {}
  public dispose(): void {
    this.data.forEach(disposeNode);
  }
}
