import * as React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereBufferGeometry,
  MeshBasicMaterial,
  AmbientLight,
  DirectionalLight,
  TextureLoader,
  BackSide,
  Raycaster,
  Mesh,
} from 'three';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, ButtonGroup, CircularProgress } from '@mui/material';

import { useVillageUsers } from 'src/services/useVillageUsers';
import { clamp, debounce, throttle } from 'src/utils';
import { UserType } from 'types/user.type';

import { getCapitals } from './data/capitals';
import { getCountries } from './data/countries';
import type { HoverablePin } from './data/pin';
import { getPins } from './data/pin';
import { useFullScreen } from './hooks/use-full-screen';
import { useObjectHover } from './hooks/use-object-hover';
import { cartesian2Polar, polar2Cartesian } from './lib/coords-utils';
import { disposeNode } from './lib/dispose-node';
import { getAtmosphereGlow } from './lib/get-atmosphere-glow';
import { GLOBE_IMAGE_URL, BACKGROUND_IMAGE_URL, SKY_RADIUS, MAX_DISTANCE, MIN_DISTANCE, GLOBE_RADIUS } from './world-map.constants';

const WorldMap: React.FC = () => {
  const { users } = useVillageUsers();

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const threeData = React.useRef<{
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;
    raycaster: Raycaster;
  } | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const altitudeRef = React.useRef<number>(MAX_DISTANCE);
  const animationFrameRef = React.useRef<number | null>(null);
  const showDecorsRef = React.useRef(true);

  const {
    setHoverableObjects,
    onClick: onHoverClick,
    onUpdateHover,
    onMouseMove,
    onMouseLeave,
    resetCanvasBoundingRect,
    popover,
    cursorStyle,
  } = useObjectHover();

  const { containerRef, fullScreenButton } = useFullScreen();

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

  const onCameraChangeThrottled = React.useMemo(() => {
    const onCameraChange = () => {
      if (threeData.current === null) {
        return;
      }
      const { scene, camera, controls } = threeData.current;
      const altitude = cartesian2Polar(camera.position).altitude;
      altitudeRef.current = altitude;
      controls.rotateSpeed = altitude * 0.001363 - 0.109;

      const pins = scene.children.find((child) => child.name === 'pins');
      if (pins) {
        for (const pin of pins.children) {
          (pin as HoverablePin).update(camera.position, altitude);
        }
      }

      if ((showDecorsRef.current === true && altitude < 240) || (showDecorsRef.current === false && altitude >= 240)) {
        showDecorsRef.current = altitude >= 240;
        for (const child of scene.children) {
          if (child.name === 'countries' || child.name === 'capitals') {
            child.visible = !showDecorsRef.current;
          }
        }
        setHoverableObjects(scene, showDecorsRef.current);
      }
    };
    return throttle(onCameraChange, 50);
  }, [setHoverableObjects]);

  const onZoom = (delta: number) => {
    if (threeData.current === null) {
      return;
    }
    const cameraPosition = threeData.current.camera.position;
    const { lat, lng, altitude } = cartesian2Polar(cameraPosition);
    const { x, y, z } = polar2Cartesian(lat, lng, clamp(altitude + delta, MIN_DISTANCE, MAX_DISTANCE) - GLOBE_RADIUS);
    cameraPosition.x = x;
    cameraPosition.y = y;
    cameraPosition.z = z;
    onCameraChangeThrottled();
  };

  const init = React.useCallback(async () => {
    if (canvasRef.current) {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      // [1] Init scene, camera and renderer.
      const scene = new Scene();
      const camera = new PerspectiveCamera(50, width / height, 0.1, SKY_RADIUS * 2.5);
      const renderer = new WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      const textureLoader = new TextureLoader();
      camera.position.z = MAX_DISTANCE;
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(width, height, false);

      // [2] Add globe to the scene.
      const globeGeometry = new SphereBufferGeometry(GLOBE_RADIUS, 75, 75);
      const defaultGlobeMaterial = new MeshBasicMaterial({ map: textureLoader.load(GLOBE_IMAGE_URL), transparent: true });
      const globeObj = new Mesh(globeGeometry, defaultGlobeMaterial);
      globeObj.rotation.y = -Math.PI / 2; // face prime meridian along Z axis
      globeObj.name = 'globe';
      const glowObj = getAtmosphereGlow();
      const skyGeometry = new SphereBufferGeometry(50000, 75, 75);
      const defaultSkyMaterial = new MeshBasicMaterial({ map: textureLoader.load(BACKGROUND_IMAGE_URL), side: BackSide });
      const skyObj = new Mesh(skyGeometry, defaultSkyMaterial);
      scene.add(skyObj);
      scene.add(globeObj);
      scene.add(glowObj);
      scene.add(new AmbientLight(0xbbbbbb));
      scene.add(new DirectionalLight(0xffffff, 0.6));

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
      controls.enableDamping = false;
      // controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.4;
      controls.zoomSpeed = 0.25;
      controls.addEventListener('change', onCameraChangeThrottled);
      controls.update();

      // [5] Start the animation loop.
      threeData.current = {
        scene,
        camera,
        renderer,
        controls,
        raycaster: new Raycaster(),
      };
      requestAnimationFrame(render);
      window.addEventListener('resize', onResizeDebounced);
      setTimeout(() => {
        setIsInitialized(true);
      }, 100);
    }
  }, [render, onCameraChangeThrottled, onResizeDebounced]);

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
    setIsInitialized(false);
    init().catch();
    return clearScene;
  }, [init, clearScene]);

  const onClick = React.useCallback(() => {
    if (!threeData.current) {
      return;
    }
    onHoverClick(threeData.current.camera, altitudeRef.current);
    onCameraChangeThrottled();
  }, [onHoverClick, onCameraChangeThrottled]);

  const addPins = React.useCallback(async () => {
    if (!isInitialized || !threeData.current) {
      return;
    }
    const { scene, camera } = threeData.current;

    // remove previous pins
    for (const child of scene.children) {
      if (child.name === 'pins') {
        scene.remove(child);
        disposeNode(child);
      }
    }

    // add pins
    const pins = await getPins(
      users.filter((u) => u.type === UserType.TEACHER),
      camera.position,
    );
    scene.add(pins);
    setHoverableObjects(scene, showDecorsRef.current);
  }, [isInitialized, users, setHoverableObjects]);
  React.useEffect(() => {
    addPins().catch();
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '100%', width: '100%', maxHeight: 'calc(100vh - 90px)' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', cursor: cursorStyle }}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      ></canvas>
      {popover}
      <div style={{ position: 'absolute', left: '0.5rem', top: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        <ButtonGroup
          orientation="vertical"
          sx={{
            '& .MuiButtonGroup-grouped:hover': {
              borderColor: '#c5c5c5',
            },
          }}
        >
          <Button
            color="inherit"
            sx={{
              color: (theme) => theme.palette.text.primary,
              border: '1px solid #c5c5c5',
              padding: '5px',
              minWidth: 0,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={() => onZoom(-20)}
          >
            <AddIcon />
          </Button>
          <Button
            color="inherit"
            sx={{
              color: (theme) => theme.palette.text.primary,
              border: '1px solid #c5c5c5',
              padding: '5px',
              minWidth: 0,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={() => onZoom(20)}
          >
            <RemoveIcon />
          </Button>
        </ButtonGroup>
        {fullScreenButton}
      </div>
      {!isInitialized && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </div>
      )}
    </div>
  );
};

export default WorldMap;
