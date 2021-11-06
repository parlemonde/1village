import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import React from 'react';

import { primaryColor } from 'src/styles/variables.const';

type Position = {
  lat: number;
  lng: number;
};
type MapMarker = {
  position: Position;
  label?: string;
  onDragEnd?: (newPos: Position) => void;
};

type MapProps = {
  position: Position;
  zoom: number;
  markers?: MapMarker[];
};

const Map = ({ position, zoom, markers = [] }: MapProps) => {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const initialPosition = React.useRef(position);
  const initialMarkers = React.useRef(markers);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://api.maptiler.com/maps/0ad2ffc3-1725-4a16-ae2f-8b77e5839593/style.json?key=ecMNwc4xNgcrvp2RH6cr',
      center: initialPosition.current,
      zoom,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
    );
    map.addControl(new maplibregl.ScaleControl());
    map.addControl(new maplibregl.FullscreenControl());

    initialMarkers.current.forEach((m) => {
      const marker = new maplibregl.Marker({
        color: primaryColor,
        draggable: m.onDragEnd !== undefined,
      })
        .setLngLat(m.position)
        .addTo(map);
      if (m.onDragEnd !== undefined) {
        const func = m.onDragEnd;
        const onMarkerDragEnd = () => {
          const newPos = marker.getLngLat();
          func(newPos);
        };
        marker.on('dragend', onMarkerDragEnd);
      }
    });

    return () => {
      map.remove();
    };
  }, [zoom]);

  return <div ref={mapRef}></div>;
};

export default Map;
