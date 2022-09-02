import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import L from 'leaflet';
import {} from 'leaflet.fullscreen';
import maplibregl from 'maplibre-gl';
import { useRouter } from 'next/router';
import React from 'react';

import { useActivity } from 'src/services/useActivity';
import { primaryColor } from 'src/styles/variables.const';
import type { User } from 'types/user.type';

type Position = {
  lat: number;
  lng: number;
};
type MapMarker = {
  position: Position;
  label?: string;
  onDragEnd?: (newPos: Position) => void;
  activityCreatorMascotte: User['mascotteId'];
};

type MapProps = {
  position: Position;
  zoom: number;
  markers?: MapMarker[];
};

const Map = ({ position, zoom, markers = [] }: MapProps) => {
  const router = useRouter();
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const initialPosition = React.useRef(position);
  const initialMarkers = React.useRef(markers);
  const { activity: userMascotte } = useActivity(markers[0].activityCreatorMascotte || -1);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // ---- WebGL MAP ----
    if (maplibregl.supported()) {
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
      map.addControl(new maplibregl.ScaleControl({}));
      map.addControl(new maplibregl.FullscreenControl({}));

      initialMarkers.current.forEach((m) => {
        const marker = new maplibregl.Marker({
          color: primaryColor,
          draggable: m.onDragEnd !== undefined,
        })
          .setLngLat(m.position)
          .addTo(map);
        if (userMascotte?.id) {
          marker.getElement().addEventListener('click', () => {
            router.push(`/activite/${userMascotte?.id}`);
          });
        }
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
    }

    // ---- Leaflet MAP (fallback if webgl is not supported) ----
    const map = L.map(mapRef.current, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft',
      },
    }).setView(initialPosition.current, zoom + 2);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ecMNwc4xNgcrvp2RH6cr', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution:
        '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
      crossOrigin: true,
    }).addTo(map);

    initialMarkers.current.forEach((m) => {
      const marker = L.marker(m.position, {
        icon: new L.Icon({
          iconUrl: '/marker.svg',
          iconSize: [25, 41],
          iconAnchor: [13.5, 41],
        }),
        draggable: m.onDragEnd !== undefined,
      }).addTo(map);
      if (m.onDragEnd !== undefined) {
        const func = m.onDragEnd;
        const onMarkerDragEnd = () => {
          const newPos = marker.getLatLng();
          func(newPos);
        };
        marker.on('dragend', onMarkerDragEnd);
      }
    });

    return () => {
      map.remove();
    };
  }, [router, userMascotte?.id, zoom]);

  return <div ref={mapRef}></div>;
};

export default Map;
