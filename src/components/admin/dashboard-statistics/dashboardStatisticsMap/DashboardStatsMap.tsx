import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import CircleIcon from '@mui/icons-material/Circle';

import styles from './DashboardStatsMap.module.css';
import TooltipMouseTracker from 'src/components/TooltipMouseTracker/TooltipMouseTracker';

const DashboardStatsMap = () => {
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
  const [tooltipData, setTooltipData] = React.useState('');

  return (
    <div className={styles.mapContainer}>
      <ComposableMap style={{ flex: '3', border: '1px solid #000', height: 'fit-content' }}>
        <ZoomableGroup center={[0, 0]} zoom={0.9}>
          <Geographies geography="/simpleWorldMap.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  onMouseEnter={(e) => {
                    setTooltipPosition({ x: e.clientX, y: e.clientY });
                    setIsTooltipVisible(true);
                    setTooltipData(geo.rsmKey);
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
                      strokeWidth: '.25',
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: 'white',
                      stroke: '#000',
                      strokeWidth: '.25',
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {isTooltipVisible && <TooltipMouseTracker>{tooltipData}</TooltipMouseTracker>}
      <div className={styles.legendContainer}>
        <h2>Légende:</h2>
        <ul>
          <li>
            <p style={{ verticalAlign: 'middle' }}>
              <CircleIcon fontSize="small" sx={{ color: '#4CC64A', verticalAlign: 'middle' }} /> <span>Actif</span>: la majorité des classes ont posté
              ces 3 dernières semaines
            </p>
          </li>
          <li>
            <p>
              <CircleIcon fontSize="small" sx={{ color: '#6082FC', verticalAlign: 'middle' }} /> <span>Observateur</span>: la majorité des classes ont
              pas posté depuis 3 semaines
            </p>
          </li>
          <li>
            <p>
              <CircleIcon fontSize="small" sx={{ color: '#FFD678', verticalAlign: 'middle' }} /> <span>Fantôme</span>: la majorité des classes ne se
              sont pas connectées depuis 3 semaines
            </p>
          </li>
          <li>
            <p>
              <CircleIcon fontSize="small" sx={{ color: '#D11818', verticalAlign: 'middle' }} /> <span>Absent</span>: la majorité des classes ne se
              sont jamais connectées
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardStatsMap;