import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

import { debounce } from 'src/utils';

import { getCapitals } from './data/capitals';
import { getCountries } from './data/countries';
import { useObjectHover } from './hooks/use-object-hover';
import { cartesian2Polar } from './lib/coords-utils';
import { disposeNode } from './lib/dispose-node';
import { getAtmosphereGlow } from './lib/get-atmosphere-glow';
import { GLOBE_IMAGE_URL, BACKGROUND_IMAGE_URL, SKY_RADIUS, MAX_DISTANCE, MIN_DISTANCE, GLOBE_RADIUS } from './world-map.constants';

// adjust controls speed based on altitude
const updateControls = ({ controls, altitude }: { controls: OrbitControls; altitude: number }) => {
  controls.rotateSpeed = altitude * 0.2;
};
const updateControlsDebounced = debounce(updateControls, 50, false);

const WorldMap: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const threeData = React.useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    raycaster: THREE.Raycaster;
  } | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const showDecorsRef = React.useRef(true);

  const { setHoverableObjects, onUpdateHover, onMouseMove, onMouseLeave, resetCanvasBoundingRect, popover } = useObjectHover();

  const render = React.useCallback(() => {
    if (threeData.current === null) {
      return;
    }
    const { renderer, scene, camera, controls, raycaster } = threeData.current;

    onUpdateHover(raycaster, camera, scene);
    controls.update();
    renderer.render(scene, camera);
    animationFrameRef.current = requestAnimationFrame(render);
  }, [onUpdateHover]);

  const onResizeDebounced = React.useMemo(() => {
    const onResize = () => {
      if (canvasRef.current && threeData.current) {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        threeData.current.camera.aspect = width / height;
        threeData.current.camera.updateProjectionMatrix();
        threeData.current.renderer.setSize(width, height, false);
      }
      resetCanvasBoundingRect();
    };
    return debounce(onResize, 250, false);
  }, [resetCanvasBoundingRect]);

  const init = React.useCallback(async () => {
    if (canvasRef.current) {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      // [1] Init scene, camera and renderer.
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, SKY_RADIUS * 2.5);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      camera.position.z = MAX_DISTANCE;
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(width, height, false);

      // [2] Add globe to the scene.
      const globeGeometry = new THREE.SphereBufferGeometry(GLOBE_RADIUS, 75, 75);
      const defaultGlobeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(GLOBE_IMAGE_URL), transparent: true });
      const globeObj = new THREE.Mesh(globeGeometry, defaultGlobeMaterial);
      globeObj.rotation.y = -Math.PI / 2; // face prime meridian along Z axis
      globeObj.name = 'globe';
      const glowObj = getAtmosphereGlow();
      const skyGeometry = new THREE.SphereBufferGeometry(50000, 75, 75);
      const defaultSkyMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(BACKGROUND_IMAGE_URL), side: THREE.BackSide });
      const skyObj = new THREE.Mesh(skyGeometry, defaultSkyMaterial);
      scene.add(skyObj);
      scene.add(globeObj);
      scene.add(glowObj);
      scene.add(new THREE.AmbientLight(0xbbbbbb));
      scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

      // [3] Add countries
      const countries = await getCountries();
      const capitals = await getCapitals();
      countries.visible = false;
      capitals.visible = false;
      scene.add(countries);
      scene.add(capitals);

      // [4] Setup camera controls.
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = MIN_DISTANCE;
      controls.maxDistance = MAX_DISTANCE;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.4;
      controls.zoomSpeed = 0.25;
      controls.addEventListener('change', () => {
        const altitude = cartesian2Polar(camera.position).altitude;
        updateControlsDebounced({ controls, altitude });

        if ((showDecorsRef.current === true && altitude < 1.6) || (showDecorsRef.current === false && altitude >= 1.6)) {
          showDecorsRef.current = altitude >= 1.6;
          countries.visible = !showDecorsRef.current;
          capitals.visible = !showDecorsRef.current;
          setHoverableObjects(scene, showDecorsRef.current);
        }
      });
      controls.update();

      // [5] Start the animation loop.
      threeData.current = {
        scene,
        camera,
        renderer,
        controls,
        raycaster: new THREE.Raycaster(),
      };
      requestAnimationFrame(render);
      window.addEventListener('resize', onResizeDebounced);
    }
  }, [render, setHoverableObjects, onResizeDebounced]);

  const clearScene = React.useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (threeData.current) {
      const { renderer, scene, controls } = threeData.current;
      renderer.renderLists.dispose();
      renderer.dispose();
      controls.dispose();
      scene.children.forEach(disposeNode);
    }
    window.removeEventListener('resize', onResizeDebounced);
  }, [onResizeDebounced]);

  React.useEffect(() => {
    init().catch();
    return clearScene;
  }, [init, clearScene]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}></canvas>
      {popover}
    </div>
  );
};

export default WorldMap;
