import Globe, { GlobeInstance } from 'globe.gl';
import React from 'react';
import * as THREE from 'three';

import { Capitals, Countries, Decors, DataClass } from './data';

const GLOBE_IMAGE_URL = '/static-images/earth-blue-marble.jpg';
const BACKGROUND_IMAGE_URL = '/static-images/night-sky.png';
const START_ALTITUDE = 2.5;
const DECORS_BREAKPOINT = 1.5;

const WorldMap: React.FC = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const worldRef = React.useRef<GlobeInstance | null>(null);
  const dataRef = React.useRef<DataClass[]>([]);
  const showDecorsRef = React.useRef<boolean | null>(null);

  const onZoom = React.useCallback(({ altitude }: { altitude: number }) => {
    if (!worldRef.current) {
      return;
    }
    dataRef.current.forEach((d) => d.onZoom(worldRef.current, altitude));
    const showDecors = altitude >= DECORS_BREAKPOINT;
    if (showDecorsRef.current !== showDecors) {
      showDecorsRef.current = showDecors;
      dataRef.current.forEach((d) => d.updateData(worldRef.current, showDecors));
    }
  }, []);

  const init = React.useCallback(async () => {
    if (canvasRef.current) {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      dataRef.current = [new Countries(), new Capitals(), new Decors()];
      await Promise.all(dataRef.current.map((d) => d.getData()));

      // init world
      worldRef.current = Globe({
        rendererConfig: { failIfMajorPerformanceCaveat: true },
      })(canvasRef.current)
        .width(width)
        .height(height)
        .globeImageUrl(GLOBE_IMAGE_URL)
        .backgroundImageUrl(BACKGROUND_IMAGE_URL)
        .atmosphereAltitude(0.25)
        .onZoom(onZoom);

      worldRef.current.renderer().outputEncoding = THREE.sRGBEncoding;
      worldRef.current.renderer().shadowMap.enabled = false;

      dataRef.current.forEach((d) => d.showData(worldRef.current, START_ALTITUDE, START_ALTITUDE >= DECORS_BREAKPOINT));

      // clear scene
      return () => {
        if (worldRef.current) {
          worldRef.current.customLayerData([]);
        }
        dataRef.current.forEach((d) => d.dispose());
        if (worldRef.current) {
          worldRef.current.renderer().renderLists.dispose();
          worldRef.current.renderer().dispose();
        }
      };
    }
    return () => {};
  }, [onZoom]);

  React.useEffect(() => {
    init().catch();
  }, [init]);

  return <div ref={canvasRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default WorldMap;
