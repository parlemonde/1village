import type { FeatureCollection, Geometry, Point } from 'geojson';
import type { GlobeInstance } from 'globe.gl';

export type GeoJSONCountryData = FeatureCollection<Geometry, { adminFR: string; iso_a2: string; iso_a3: string; region_un: string }>;
export type GeoJSONCityData = FeatureCollection<Point, { cityFR: string; iso3: string }>;
export type GeoPolygon = GeoJSONCountryData['features'][0] & { index: number };
export type GeoLabel = GeoJSONCityData['features'][0];

export abstract class DataClass {
  public id: string;
  public abstract getData(): Promise<void>;
  public abstract showData(globe: GlobeInstance | null, zoom: number, showDecors: boolean): void;
  public abstract updateData(globe: GlobeInstance | null, showDecors: boolean): void;
  public abstract onZoom(globe: GlobeInstance | null, zoom: number): void;
  public abstract dispose(): void;
}
