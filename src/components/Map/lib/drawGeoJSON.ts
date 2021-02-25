import * as THREE from 'three';

import json from './countries.geojson.json';

export function getCountries(radius?: number): THREE.Object3D[] {
  const countries = json.features;
  const countryObjects: THREE.Object3D[] = [];
  countries.forEach((country) => {
    if (country.geometry.type === 'Polygon') {
      countryObjects.push(getCountry(country.geometry.coordinates[0] as number[][], radius));
    } else {
      (country.geometry.coordinates as number[][][][]).forEach((part: number[][][]) => {
        countryObjects.push(getCountry(part[0], radius));
      });
    }
  });
  return countryObjects;
}

function coordsToPos([longitude, latitude]: number[], radius = 1): THREE.Vector3 {
  const lambda = (longitude * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;
  return new THREE.Vector3(radius * Math.cos(phi) * Math.cos(lambda), radius * Math.sin(phi), -radius * Math.cos(phi) * Math.sin(lambda));
}

function getCountry(coords: number[][], radius?: number): THREE.Line {
  const points = coords.map((c) => coordsToPos(c, radius));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  return new THREE.Line(geometry, material);
}
