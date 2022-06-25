import type { FeatureCollection, Point } from 'geojson';
import { CircleBufferGeometry, Group, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import { Text } from 'troika-three-text';

import { polar2Cartesian } from '../lib/coords-utils';
import { GLOBE_RADIUS } from '../world-map.constants';
import { axiosRequest } from 'src/utils/axiosRequest';

export type GeoJSONCityData = FeatureCollection<Point, { cityNameFR: string; iso2: string }>;
export type GeoLabel = GeoJSONCityData['features'][0];

const pxPerDeg = (2 * Math.PI * GLOBE_RADIUS) / 360;

export const getCapitals = async (): Promise<Group> => {
  const capitals = new Group();
  capitals.name = 'capitals';

  const response = await axiosRequest({
    method: 'GET',
    baseURL: '',
    url: '/earth/capitals.geo.json',
  });
  if (response.error) {
    return capitals;
  }

  const features = (response.data as GeoJSONCityData).features;
  for (let i = 0; i < features.length; i++) {
    const capitalObj = getCapital(features[i]);
    if (capitalObj !== null) {
      capitals.add(capitalObj);
    }
  }
  return capitals;
};

function getCapital(geojson: GeoLabel): Group | null {
  const capitalObj = new Group();

  const circleGeometry = new CircleBufferGeometry(1, 16);
  const material = new MeshLambertMaterial({ color: '#000' });

  // dot
  const dotObj = new Mesh(circleGeometry, material);
  const dotRadius = 0.1 * pxPerDeg;
  dotObj.scale.x = dotObj.scale.y = dotRadius;

  // text
  const textHeight = 0.4 * pxPerDeg;
  const labelObj = new Text();
  labelObj.name = 'Text';
  labelObj.text = geojson.properties.cityNameFR;
  labelObj.fontSize = textHeight;
  labelObj.color = 0x000000;
  labelObj.anchorX = 'center';
  labelObj.position.y = -dotRadius * 1.1;
  labelObj.sync(); // Update the rendering

  capitalObj.add(dotObj);
  capitalObj.add(labelObj);

  // place
  const pos = polar2Cartesian(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0], 1);
  capitalObj.position.x = pos.x;
  capitalObj.position.y = pos.y;
  capitalObj.position.z = pos.z;

  // rotate
  capitalObj.lookAt(new Vector3(0, 0, 0)); // face globe (local) center
  capitalObj.rotateY(Math.PI); // face outwards

  return capitalObj;
}
