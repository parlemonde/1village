import 'maplibre-gl/dist/maplibre-gl.css';
import { useRouter } from 'next/router';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, ButtonGroup } from '@mui/material';

import type { PopoverData } from './Popover';
import { isUser, Popover } from './Popover';
import { useFullScreen } from './use-full-screen';
import { World } from './world';
import type { GeoJSONCityData } from './world/objects/capital';
import type { GeoJSONCountriesData } from './world/objects/country';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { axiosRequest } from 'src/utils/axiosRequest';
import { UserType } from 'types/user.type';

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
  const { users } = useVillageUsers();

  // -- 3D world --
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [world, setWorld] = useState<World | null>(null);
  const [mouseStyle, setMouseStyle] = useState<CSSProperties['cursor']>('default');
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [popoverData, setPopoverData] = useState<PopoverData | null>(null);
  const { containerRef, fullScreenButton } = useFullScreen();
  const { data: countriesAndCapitals } = useQuery(['3d-world-countries-and-capitals'], getCountriesAndCapitals);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {};
    }
    const prevent = (event: Event) => {
      event.preventDefault();
    };
    canvas.addEventListener('mousewheel', prevent);
    canvas.addEventListener('wheel', prevent);
    const newWorld = new World(canvas, setMouseStyle, setPopoverData);
    let animationFrame: number | null = null;
    const render = (time: number) => {
      newWorld.render(time);
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);
    setWorld(newWorld);
    return () => {
      canvas.removeEventListener('mousewheel', prevent);
      canvas.removeEventListener('wheel', prevent);
      newWorld.dispose();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
  useEffect(() => {
    if (world && countriesAndCapitals) {
      world.addCountriesAndCapitals(countriesAndCapitals);
    }
  }, [world, countriesAndCapitals]);
  useEffect(() => {
    if (world) {
      world.addUsers(users.filter((u) => u.type === UserType.TEACHER));
    }
  }, [world, users]);
  useEffect(() => {
    if (world) {
      world.changeView('earth');
    }
  }, [world]);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '100%', width: '100%', maxHeight: 'calc(100vh - 90px)' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', backgroundColor: 'black', cursor: mouseStyle }}
        onClick={() => {
          if (world) {
            world.onClick.bind(world)();
            if (popoverData && isUser(popoverData) && popoverData.data?.mascotteId) {
              world.resetHoverState();
              router.push(`/activite/${popoverData.data.mascotteId}`);
            }
          }
        }}
        onMouseMove={(event) => {
          if (world) {
            world.onMouseMove.bind(world)(event);
            setPopoverPos({
              x: event.clientX - world.canvasRect.left,
              y: event.clientY - world.canvasRect.top + 20,
            });
          }
        }}
      ></canvas>
      {popoverData !== null && <Popover {...popoverPos} {...popoverData} />}
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
                sx={(theme) => ({
                  [theme.breakpoints.only('xs')]: {
                    display: 'none',
                  },
                  color: (theme) => theme.palette.text.primary,
                  border: '1px solid #c5c5c5',
                  padding: '5px',
                  minWidth: 0,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                })}
                onClick={() => {
                  world.onZoom(-20);
                }}
              >
                <AddIcon />
              </Button>
              <Button
                color="inherit"
                sx={(theme) => ({
                  [theme.breakpoints.only('xs')]: {
                    display: 'none',
                  },
                  color: (theme) => theme.palette.text.primary,
                  border: '1px solid #c5c5c5',
                  borderRadius: '0',
                  padding: '5px',
                  minWidth: 0,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                })}
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
