import type { GlobeInstance } from 'globe.gl';

import { axiosRequest } from 'src/utils/axiosRequest';

import { GeoPolygon, GeoJSONCountryData, DataClass } from './data.types';

const COLORS: { [key: string]: string[] } = {
  Americas: ['#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7'],
  Asia: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4'],
  Africa: ['#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107'],
  Oceania: ['#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#fbe9e7'],
  Europe: ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63'],
};

export class Countries extends DataClass {
  public id = 'coutries';
  private data: GeoPolygon[] = [];

  public getData = async (): Promise<void> => {
    const response = await axiosRequest({
      method: 'GET',
      baseURL: '',
      url: '/earth/countries.geo.json',
    });
    if (response.error) {
      this.data = [];
    }
    this.data = (response.data as GeoJSONCountryData).features.map((f, index) => ({ ...f, index }));
  };

  public showData(globe: GlobeInstance, _zoom: number, showDecors: boolean): void {
    globe.polygonsData(this.data).polygonAltitude(0.01).polygonsTransitionDuration(200);
    this.updateData(globe, showDecors);
  }

  public updateData(globe: GlobeInstance, showDecors: boolean): void {
    const polygonsAlpha = showDecors ? '00' : 'FF'; // hide polygons when showing decors.
    globe
      .polygonCapColor((d: GeoPolygon) => `${COLORS[d.properties.region_un][d.index % 6]}${polygonsAlpha}`)
      .polygonSideColor((d: GeoPolygon) => `${COLORS[d.properties.region_un][d.index % 6]}${polygonsAlpha}`)
      .polygonStrokeColor(() => `#111111${polygonsAlpha}`)
      .polygonLabel(({ properties: d }: GeoPolygon) => (showDecors ? '' : `<div style="color: #000;">${d.adminFR}</div>`))
      .onPolygonHover((hoverD: GeoPolygon) => {
        globe
          ? globe
              .polygonAltitude((d: GeoPolygon) => (d === hoverD ? 0.02 : 0.01))
              .polygonCapColor((d: GeoPolygon) =>
                d === hoverD ? `#3f51b5${polygonsAlpha}` : `${COLORS[d.properties.region_un][d.index % 6]}${polygonsAlpha}`,
              )
          : null;
      });
  }

  public onZoom(): void {}
  public dispose(): void {}
}
