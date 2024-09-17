import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import CircleIcon from '@mui/icons-material/Circle';
import { Grid } from '@mui/material';

import TooltipMouseTracker from '../TooltipMouseTracker/TooltipMouseTracker';

const DashboardWorldMap = () => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
  const [tooltipData, setTooltipData] = React.useState('');

  return (
    <Grid container width="100%">
      <Grid item xs={12} lg={8}>
        <ComposableMap style={{ flex: '3', border: '1px solid #000', height: 'fit-content' }}>
          <ZoomableGroup center={[0, 0]} zoom={0.9}>
            <Geographies geography="/earth/countries.geo.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    onMouseOver={() => {
                      setTooltipData(geo.properties.name);
                      setIsTooltipVisible(true);
                    }}
                    onMouseLeave={() => setIsTooltipVisible(false)}
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: '#FFF',
                        stroke: '#000',
                        strokeWidth: '.2',
                        outline: 'none',
                        transition: 'ease .2s',
                      },
                      hover: {
                        fill: '#edf2fb',
                        stroke: '#000',
                        strokeWidth: '.2',
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: 'white',
                        stroke: '#000',
                        strokeWidth: '.2',
                        outline: 'none',
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <TooltipMouseTracker isVisible={isTooltipVisible}>{tooltipData}</TooltipMouseTracker>
      </Grid>
      <Grid container direction="row" alignItems="flex-start" item xs={12} lg={4} pl={2} spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <p style={{ verticalAlign: 'middle' }}>
            <CircleIcon fontSize="small" sx={{ color: '#4CC64A', verticalAlign: 'middle' }} /> <span style={{ fontWeight: 600 }}>Actif</span>: la
            majorité des classes ont posté ces 3 dernières semaines
          </p>
        </Grid>
        <Grid item xs={12} sm={6} lg={12}>
          <p>
            <CircleIcon fontSize="small" sx={{ color: '#6082FC', verticalAlign: 'middle' }} /> <span style={{ fontWeight: 600 }}>Observateur</span>:
            la majorité des classes ont pas posté depuis 3 semaines
          </p>
        </Grid>
        <Grid item xs={12} sm={6} lg={12}>
          <p>
            <CircleIcon fontSize="small" sx={{ color: '#FFD678', verticalAlign: 'middle' }} /> <span style={{ fontWeight: 600 }}>Fantôme</span>: la
            majorité des classes ne se sont pas connectées depuis 3 semaines
          </p>
        </Grid>
        <Grid item xs={12} sm={6} lg={12}>
          <p>
            <CircleIcon fontSize="small" sx={{ color: '#D11818', verticalAlign: 'middle' }} /> <span style={{ fontWeight: 600 }}>Absent</span>: la
            majorité des classes ne se sont jamais connectées
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardWorldMap;
