import type { GlobeInstance } from 'globe.gl';

import { axiosRequest } from 'src/utils/axiosRequest';
import { debounce } from 'src/utils';

import { GeoJSONCityData, GeoLabel, DataClass } from './data.types';

const setLabelSize = ({ globe, zoom }: { globe: GlobeInstance; zoom: number }): void => {
  globe.labelSize(Math.max(Math.min(zoom / 2.5, 0.4), 0.2)).labelDotRadius(Math.max(Math.min(zoom / 10 + 0.05, 0.2), 0.1));
};
const setLabelSizeDebounced = debounce(setLabelSize, 100, false);

export class Capitals extends DataClass {
  public id = 'capitals';
  private data: GeoJSONCityData['features'] = [];

  public getData = async (): Promise<void> => {
    const response = await axiosRequest({
      method: 'GET',
      baseURL: '',
      url: '/earth/capitals.geo.json',
    });
    if (response.error) {
      this.data = [];
    }
    this.data = (response.data as GeoJSONCityData).features;
  };

  public showData(globe: GlobeInstance, zoom: number, showDecors: boolean): void {
    globe
      .labelLat((c: GeoLabel) => c.geometry.coordinates[1])
      .labelLng((c: GeoLabel) => c.geometry.coordinates[0])
      .labelText((c: GeoLabel) => c.properties.cityFR ?? '')
      .labelAltitude(0.025)
      .labelColor('#000')
      .labelResolution(2);
    this.onZoom(globe, zoom);
    this.updateData(globe, showDecors);
  }

  public onZoom(globe: GlobeInstance, zoom: number): void {
    setLabelSizeDebounced({
      globe,
      zoom,
    });
  }

  public updateData(globe: GlobeInstance, showDecors: boolean): void {
    if (showDecors) {
      globe.labelsData([]);
    } else {
      globe.labelsData(this.data);
    }
  }

  public dispose(): void {}
}
