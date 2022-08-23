import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import L from 'leaflet';
import {} from 'leaflet.fullscreen';
import { useRouter } from 'next/router';
import * as React from 'react';
import ReactDOM from 'react-dom';
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
  Vector2,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, ButtonGroup, CircularProgress } from '@mui/material';

import { UserPopover } from './UserPopover';
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
import { useVillageUsers } from 'src/services/useVillageUsers';
import { clamp, debounce, throttle } from 'src/utils';
import { UserType } from 'types/user.type';

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

const WorldMap = () => {
  const router = useRouter();
  const { users } = useVillageUsers();

  const leafletRef = React.useRef<HTMLDivElement | null>(null);
  const leafletMapRef = React.useRef<L.Map | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const threeData = React.useRef<{
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;
    raycaster: Raycaster;
  } | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [useLeafletFallback, setUseLeafletFallback] = React.useState(false);
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

  const onPinClick = React.useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      const raycaster = new Raycaster();
      const pointer = new Vector2();
      if (!threeData.current) {
        return;
      }
      const { scene, camera } = threeData.current;
      // First we need to map the mouse coordinates to the rectangle
      // between (1,1) (1, -1) (-1, -1) and (-1, 1)
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // Then we use the mapped mouse coordinates to setFromCamera the raycaster
      // raycaster is used to detect interaction with a 3D model, in this case a pin
      raycaster.setFromCamera(pointer, camera);
      // After that we use the raycaster to find all objects that intersect
      // with the ray raycaster.intersectObjects(scene.children, true)
      const intersects = raycaster.intersectObjects(scene.children, true);
      const pins = scene.children.find((child) => child.name === 'pins');

      if (intersects.length > 0 && pins) {
        if (pins.children.find((child) => child.userData.user.country.name === intersects[0].object.userData.countryName)) {
          router.push('/ma-classe');
        }
      }
    },
    [router],
  );

  const init = React.useCallback(async () => {
    if (!isWebGLAvailable()) {
      setUseLeafletFallback(true);
      return;
    }

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
      renderer.domElement.addEventListener('click', onPinClick, false);
      setTimeout(() => {
        setIsInitialized(true);
      }, 100);
    }
  }, [render, onCameraChangeThrottled, onResizeDebounced, onPinClick]);

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

  //display globe with countries and capitals
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

  //add leaflet fallback if webgl is not available
  React.useEffect(() => {
    if (useLeafletFallback) {
      if (leafletRef.current) {
        const map = L.map(leafletRef.current, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: 'topleft',
          },
        }).setView([51.505, -0.09], 2);
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ecMNwc4xNgcrvp2RH6cr', {
          tileSize: 512,
          zoomOffset: -1,
          minZoom: 1,
          attribution:
            '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          crossOrigin: true,
        }).addTo(map);
        leafletMapRef.current = map;
        setIsInitialized(true);

        return () => {
          map.remove();
        };
      }
    }
    return;
  }, [useLeafletFallback]);

  // add 3D pin models to leaflet map
  const addPins = React.useCallback(async () => {
    if (!isInitialized) {
      return;
    }

    if (useLeafletFallback && leafletMapRef.current !== null) {
      const map = leafletMapRef.current;
      users
        .filter((u) => u.type === UserType.TEACHER)
        .forEach((u) => {
          const marker = L.marker(u.position, {
            icon: new L.Icon({
              iconUrl: '/marker.svg',
              iconSize: [25, 41],
              iconAnchor: [13.5, 41],
            }),
          }).addTo(map);

          const $div = document.createElement('div');
          ReactDOM.render(<UserPopover user={u} />, $div, () => {
            marker.bindPopup($div.innerHTML);
          });
        });
    }

    if (!threeData.current) {
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
  }, [isInitialized, useLeafletFallback, users, setHoverableObjects]);
  React.useEffect(() => {
    addPins().catch();
  }, [addPins]);

  if (useLeafletFallback) {
    return <div ref={leafletRef} style={{ position: 'relative', height: '100%', width: '100%', maxHeight: 'calc(100vh - 90px)' }}></div>;
  }

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
