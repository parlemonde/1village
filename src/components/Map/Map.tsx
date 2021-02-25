import CameraControls from 'camera-controls';
import React from 'react';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

import { getCountries } from './lib/drawGeoJSON';

CameraControls.install({ THREE: THREE });

const renderScene = () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 2, 0.01, 1000);
  camera.position.z = 10;

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader(); // provide a DRACOLoader instance to decode compressed mesh data
  dracoLoader.setDecoderPath('/examples/js/libs/draco/');
  loader.setDRACOLoader(dracoLoader);

  // Load a glTF resource
  loader.load(
    '/earth/EARTH_HighPoly.glb',
    (gltf) => {
      scene.add(gltf.scene);
    },
    (xhr) => {
      // eslint-disable-next-line no-console
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.error('An error happened loading the map...');
      console.error(error);
    },
  );
  scene.add(new THREE.AmbientLight(0x888888));
  scene.add(new THREE.AmbientLight(0x888888));

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

  React.useEffect(() => {
    if (ref.current) {
      const { scene, camera } = renderScene();
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
      animationFrame.current = requestAnimationFrame(render);
    }
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [render]);

  return <canvas ref={ref} style={{ width: '100%', height: '500px' }}></canvas>;
};

export default Map;
