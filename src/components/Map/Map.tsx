import L from 'leaflet';
// eslint-disable-next-line arca/import-ordering
import {} from 'leaflet-fullscreen';
import 'leaflet/dist/leaflet.css';
import {} from 'mapbox-gl-leaflet';
import 'mapbox-gl/dist/mapbox-gl.css';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Popup, MapConsumer } from 'react-leaflet';
import React from 'react';

const ICON = divIcon({
  iconSize: [44, 44],
  iconAnchor: [44 / 2, 44],
  className: 'mymarker',
  html: `<svg class="MuiSvgIcon-root MuiSvgIcon-colorPrimary" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: 100%; height: auto;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>`,
});

const enterFullScreenIcon = `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align: middle;"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>`;
const exitFullScreenIcon = `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align: middle;"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path></svg>`;

type MapMarker = {
  position: [number, number];
  label?: string;
};

type MapProps = {
  position: [number, number];
  zoom: number;
  markers?: MapMarker[];
};

const Map = ({ position, zoom, markers = [] }: MapProps) => {
  const init = React.useRef<boolean>(false);

  return (
    <MapContainer
      className="leaflet"
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ position: 'relative', width: '100%', height: '100%', zIndex: 50 }}
    >
      <MapConsumer>
        {(map) => {
          if (!init.current) {
            init.current = true;

            // 1- Add vector maps
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            L.mapboxGL({
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              attribution:
                '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
              style: 'https://api.maptiler.com/maps/0ad2ffc3-1725-4a16-ae2f-8b77e5839593/style.json?key=ecMNwc4xNgcrvp2RH6cr',
            }).addTo(map);

            // 2- add fullscreen plugin
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const fullScreenControl = new L.Control.Fullscreen();
            map.addControl(fullScreenControl);
            const $link = fullScreenControl.link;
            $link.innerHTML = enterFullScreenIcon;

            map.on('fullscreenchange', function () {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              if (map.isFullscreen()) {
                $link.innerHTML = exitFullScreenIcon;
              } else {
                $link.innerHTML = enterFullScreenIcon;
              }
            });
          }
          return null;
        }}
      </MapConsumer>
      {markers.map((marker, index) => (
        <Marker position={marker.position} icon={ICON} key={index}>
          {marker.label && <Popup>{marker.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
