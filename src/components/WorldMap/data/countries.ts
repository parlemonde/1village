import type { FeatureCollection, Geometry, Position } from 'geojson';
import { ConicPolygonBufferGeometry } from 'three-conic-polygon-geometry';
import type { Object3D } from 'three';
import { Group, MeshBasicMaterial, DoubleSide, Mesh, Line, LineBasicMaterial } from 'three';

import { axiosRequest } from 'src/utils/axiosRequest';

import { GeoJsonGeometry } from '../lib/geo-json-geometry';
import type { HoverableObject } from '../lib/hoverable-object';
import { GLOBE_RADIUS } from '../world-map.constants';

// eslint-disable-next-line camelcase
export type GeoJSONCountriesData = FeatureCollection<Geometry, { iso2: string; name: string; nameFR: string; continent: string }>;
export type GeoJSONCountryData = GeoJSONCountriesData['features'][number];

const COLORS: { [key: string]: string[] } = {
  'North America': ['#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7'],
  Asia: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4'],
  Africa: ['#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107'],
  Oceania: ['#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#fbe9e7'],
  Europe: ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63'],
  'South America': ['#BBF7D0', '#99F6E4', '#047857', '#059669', '#34D399', '#6EE7B7'],
};

export const getCountries = async (): Promise<Group> => {
  const countries = new Group();
  countries.name = 'countries';

  const response = await axiosRequest({
    method: 'GET',
    baseURL: '',
    url: '/earth/countries.geo.json',
  });
  if (response.error) {
    return countries;
  }

  const features = (response.data as GeoJSONCountriesData).features;
  for (let i = 0; i < features.length; i++) {
    const countryObj = getCountry(features[i], i);
    if (countryObj !== null) {
      countries.add(countryObj);
    }
  }
  return countries;
};

const hoverMaterial = new MeshBasicMaterial({ side: DoubleSide, color: '#3f51b5' });

function getCountry(geoJson: GeoJSONCountryData, index: number): Object3D | null {
  const polygons: Position[][][] = [];

  if (geoJson.geometry.type === 'Polygon') {
    polygons.push(geoJson.geometry.coordinates);
  } else if (geoJson.geometry.type === 'MultiPolygon') {
    polygons.push(...geoJson.geometry.coordinates);
  }

  const countryObj = new Group();
  countryObj.name = 'country';
  const sideMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    color: COLORS[geoJson.properties.continent][index % 6],
  });
  const capMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    color: COLORS[geoJson.properties.continent][index % 6],
  });
  const lineMaterial = new LineBasicMaterial({ color: 'white' });

  for (const polygon of polygons) {
    const coneObj = new HoverableCountry(polygon, geoJson.properties, [sideMaterial, capMaterial]);

    // add polygon
    countryObj.add(coneObj);

    // add strokes
    countryObj.add(new Line(new GeoJsonGeometry({ type: 'Polygon', coordinates: polygon }, 1), lineMaterial));
  }
  return countryObj;
}

export class HoverableCountry
  extends Mesh
  implements
    HoverableObject<{
      countryName: string;
    }>
{
  private initMaterials: MeshBasicMaterial[];
  public userData: HoverableObject<{
    countryName: string;
  }>['userData'];

  constructor(coords: Position[][], geojsonProperties: GeoJSONCountryData['properties'], materials: MeshBasicMaterial[]) {
    super(new ConicPolygonBufferGeometry(coords as unknown as number[][], GLOBE_RADIUS + 0.5, GLOBE_RADIUS + 1, false, true, true, 5), materials);

    this.initMaterials = materials;
    this.userData = {
      isHoverable: true,
      isClickable: false,
      type: 'country',
      countryName: geojsonProperties.nameFR,
    };
    this.name = 'countryPolygon';
  }

  public getType(): string {
    return this.userData.type;
  }

  public getData(): { countryName: string } {
    return this.userData;
  }

  public onHover(): void {
    this.material = hoverMaterial;
  }

  public onReset(): void {
    this.material = this.initMaterials;
  }

  public onClick(): void {}
}
