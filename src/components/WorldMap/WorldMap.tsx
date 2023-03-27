import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import L from 'leaflet';
import {} from 'leaflet.fullscreen';
import { useRouter } from 'next/router';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useQuery } from 'react-query';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, ButtonGroup, IconButton, Typography } from '@mui/material';

import type { PopoverData } from './Popover';
import { isUser, Popover } from './Popover';
import { UserPopover } from './UserPopover';
import { useFullScreen } from './use-full-screen';
import { World } from './world';
import type { GeoJSONCityData } from './world/objects/capital';
import type { GeoJSONCountriesData } from './world/objects/country';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { axiosRequest } from 'src/utils/axiosRequest';
import { UserType } from 'types/user.type';

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

const getCountriesAndCapitals = async () => {
  const [countriesResponse, capitalResponse] = await Promise.all([
    axiosRequest({
      method: 'GET',
      baseURL: '',
      url: '/earth/countries.geo.json',
    }),
    axiosRequest({
      method: 'GET',
      baseURL: '',
      url: '/earth/capitals.geo.json',
    }),
  ]);
  return {
    countries: countriesResponse.error ? [] : (countriesResponse.data as GeoJSONCountriesData).features,
    capitals: capitalResponse.error ? [] : (capitalResponse.data as GeoJSONCityData).features,
  };
};

const WorldMap = () => {
  const router = useRouter();
  const { village, selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const { users } = useVillageUsers();
  const [useLeafletFallback] = React.useState(() => !isWebGLAvailable());

  // -- 3D world --
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [world, setWorld] = React.useState<World | null>(null);
  const [mouseStyle, setMouseStyle] = React.useState<React.CSSProperties['cursor']>('default');
  const [popoverPos, setPopoverPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [popoverData, setPopoverData] = React.useState<PopoverData | null>(null);
  const { containerRef, fullScreenButton } = useFullScreen();
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { data: countriesAndCapitals } = useQuery(['3d-world-countries-and-capitals'], getCountriesAndCapitals);
  const selectedPhaseRef = React.useRef(selectedPhase);
  React.useEffect(() => {
    if (useLeafletFallback) {
      return () => {};
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {};
    }
    const newWorld = new World(canvas, setMouseStyle, setPopoverData, selectedPhaseRef.current);
    let animationFrame: number | null = null;
    const render = (time: number) => {
      newWorld.render(time);
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);
    setWorld(newWorld);
    return () => {
      newWorld.dispose();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [useLeafletFallback]);
  React.useEffect(() => {
    if (world && countriesAndCapitals) {
      world.addCountriesAndCapitals(countriesAndCapitals);
    }
  }, [world, countriesAndCapitals]);
  React.useEffect(() => {
    if (world) {
      world.addUsers(users.filter((u) => u.type === UserType.TEACHER));
    }
  }, [world, users]);
  React.useEffect(() => {
    if (world) {
      world.changeView(selectedPhase === 3 ? 'pelico' : 'earth');
    }
  }, [world, selectedPhase]);

  // -- Leaflet(2D) fallback --
  const leafletRef = React.useRef<HTMLDivElement | null>(null);
  const leafletMapRef = React.useRef<L.Map | null>(null);
  React.useEffect(() => {
    if (!leafletRef.current) {
      return () => {};
    }
    const map = L.map(leafletRef.current, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft',
      },
    }).setView([51.505, -0.09], 2);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ecMNwc4xNgcrvp2RH6cr', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution:
        '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
      crossOrigin: true,
    }).addTo(map);
    leafletMapRef.current = map;
    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [useLeafletFallback]);
  React.useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) {
      return;
    }
    users
      .filter((u) => u.type === UserType.TEACHER)
      .forEach((u) => {
        const marker = L.marker(u.position, {
          icon: new L.Icon({
            iconUrl: '/marker.svg',
            iconSize: [25, 41],
            iconAnchor: [13.5, 41],
          }),
        }).addTo(map);
        const $div = document.createElement('div');
        ReactDOM.render(<UserPopover user={u} />, $div, () => {
          marker.bindPopup($div.innerHTML);
        });
      });
  }, [users]);
  if (useLeafletFallback) {
    return <div ref={leafletRef} style={{ position: 'relative', height: '100%', width: '100%', maxHeight: 'calc(100vh - 90px)' }}></div>;
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '100%', width: '100%', maxHeight: 'calc(100vh - 90px)' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', backgroundColor: 'black', cursor: mouseStyle }}
        onClick={() => {
          if (world && popoverData !== null && isUser(popoverData) && popoverData.data.mascotteId) {
            world.resetHoverState();
            router.push(`/activite/${popoverData.data.mascotteId}`);
          } else if ((!village || village.activePhase < 3) && world && world.getHoveredObjectName() === 'pelico') {
            world.resetHoverState();
            setShowSuccess(true);
          } else if (world) {
            if (world.getHoveredObjectName() === 'pelico') {
              setSelectedPhase(3);
            }
            if (world.getHoveredObjectName() === 'earth' && selectedPhase === 3) {
              setSelectedPhase(2);
            }
            world.onClick.bind(world)();
          }
        }}
        onMouseMove={(event) => {
          if (world !== null) {
            world.onMouseMove.bind(world)(event);
            setPopoverPos({
              x: event.clientX - world.canvasRect.left,
              y: event.clientY - world.canvasRect.top + 20,
            });
          }
        }}
      ></canvas>
      {popoverData !== null && <Popover {...popoverPos} {...popoverData} />}
      {showSuccess && (
        <div
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, padding: '2rem' }}
          onClick={() => {
            setShowSuccess(false);
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '600px',
              margin: 'auto',
              maxHeight: '100%',
              overflow: 'scroll',
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                borderBottom: '1px solid gray',
                padding: '0.4rem 1rem',
              }}
            >
              <Typography variant="h2">Énigme résolue!</Typography>
              <IconButton
                aria-label="delete"
                size="large"
                onClick={() => {
                  setShowSuccess(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div style={{ padding: '2rem' }}>
              <Typography style={{ marginBottom: '0.2rem' }}>{"Bravo, vous avez résolu l'énigme et trouvé le village idéal."}</Typography>
              <Typography>{'La suite de l\'aventure se poursuivera dès que la phase 3 - "Imaginer votre village idéal" sera active!'}</Typography>
            </div>
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', left: '0.5rem', top: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        <ButtonGroup
          orientation="vertical"
          sx={{
            '& .MuiButtonGroup-grouped:hover': {
              borderColor: '#c5c5c5',
            },
          }}
        >
          {world && (
            <>
              <Button
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  border: '1px solid #c5c5c5',
                  padding: '5px',
                  minWidth: 0,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
                onClick={() => {
                  world.onZoom(-20);
                }}
              >
                <AddIcon />
              </Button>
              <Button
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  border: '1px solid #c5c5c5',
                  padding: '5px',
                  minWidth: 0,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
                onClick={() => {
                  world.onZoom(20);
                }}
              >
                <RemoveIcon />
              </Button>
            </>
          )}
          {fullScreenButton}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default WorldMap;
