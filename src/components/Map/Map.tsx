import CameraControls from 'camera-controls';
import React from 'react';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

import { getCountries } from './lib/drawGeoJSON';

CameraControls.install({ THREE: THREE });
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

const renderScene = async () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 2, 0.01, 1000);
  camera.position.z = 10;

  const [earth, decors] = await Promise.all([loadGLB('/earth/EARTH_HighPoly.glb'), loadGLB('/earth/Decors.glb')]);
  scene.add(earth);
  scene.add(decors);

  scene.add(new THREE.AmbientLight(0x888888));
  scene.add(new THREE.AmbientLight(0x888888));
  const light1 = new THREE.SpotLight(0x888888, 0.6, 0, 1);
  light1.position.set(20, 0, 0);
  scene.add(light1);
  const light2 = new THREE.SpotLight(0x888888, 0.6, 0, 1);
  light2.position.set(-20, 0, 0);
  scene.add(light2);

  const light3 = new THREE.SpotLight(0x888888, 0.6, 0, 1);
  light3.position.set(0, 20, 0);
  scene.add(light3);
  const light4 = new THREE.SpotLight(0x888888, 0.6, 0, 1);
  light4.position.set(0, -20, 0);
  scene.add(light4);

  const countries = getCountries(5.06);
  countries.forEach((c) => {
    c.rotateY((192 * Math.PI) / 180);
    scene.add(c);
  });

  return {
    scene,
    camera,
  };
};

const clock = new THREE.Clock();

const Map: React.FC = () => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const cameraControlRef = React.useRef<CameraControls | null>(null);
  const dataRef = React.useRef<{ scene: THREE.Scene; camera: THREE.Camera } | null>(null);
  const animationFrame = React.useRef<number | null>(null);

  const render = React.useCallback(() => {
    if (rendererRef.current && cameraControlRef.current && dataRef.current) {
      const { scene, camera } = dataRef.current;
      const delta = clock.getDelta();
      const hasControlsUpdated = cameraControlRef.current.update(delta);
      if (hasControlsUpdated) {
        rendererRef.current.render(scene, camera);
      }
      animationFrame.current = requestAnimationFrame(render);
    }
  }, []);

  const init = React.useCallback(async () => {
    if (ref.current) {
      const { scene, camera } = await renderScene();
      dataRef.current = { scene, camera };

      const canvas = ref.current;
      rendererRef.current = new THREE.WebGLRenderer({ canvas });
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      rendererRef.current.setSize(width, height, false);
      rendererRef.current.render(scene, camera);
      rendererRef.current.outputEncoding = THREE.sRGBEncoding;

      cameraControlRef.current = new CameraControls(camera, rendererRef.current.domElement);
    }
  }, []);

  React.useEffect(() => {
    init()
      .then(() => {
        animationFrame.current = requestAnimationFrame(render);
      })
      .catch();
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [init, render]);

  return <canvas ref={ref} style={{ width: '100%', height: '500px' }}></canvas>;
};

export default Map;
