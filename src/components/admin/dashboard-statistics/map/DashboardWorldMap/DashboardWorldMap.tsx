import React, { useState } from 'react';

import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import CircleIcon from '@mui/icons-material/Circle';
import TooltipMouseTracker from '../TooltipMouseTracker/TooltipMouseTracker';
import styles from './DashboardWorldMap.module.css';
import { countryToFlag } from 'src/utils';

type CountryStatus = 'active' | 'observer' | 'ghost' | 'absent';

interface CountryData {
  iso2: string;
  status: CountryStatus;
}

// Même structure de données que dans la table villages-mondes (manage/villages)
const testData: CountryData[] = [
  { iso2: 'FR', status: 'active' },
  { iso2: 'DE', status: 'observer' },
  { iso2: 'ES', status: 'ghost' },
  { iso2: 'IT', status: 'absent' },
  { iso2: 'GB', status: 'active' },
  { iso2: 'PT', status: 'observer' },
  { iso2: 'GR', status: 'ghost' },
  { iso2: 'BE', status: 'active' },
];

const getCountryColor = (status: CountryStatus) => {
  switch (status) {
    case 'active':
      return '#4CC64A';
    case 'observer':
      return '#6082FC';
    case 'ghost':
      return '#FFD678';
    case 'absent':
      return '#D11818';
    default:
      return '#FFF';
  }
};

const getStatusLabel = (status: CountryStatus) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'observer':
      return 'Observateur';
    case 'ghost':
      return 'Fantôme';
    case 'absent':
      return 'Absent';
    default:
      return '';
  }
};

const DashboardWorldMap = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<React.ReactNode>('');

  return (
    <div className={styles.mapContainer}>
      <ComposableMap style={{ flex: '3', border: '1px solid #000', height: 'fit-content' }}>
        <ZoomableGroup center={[0, 0]} zoom={0.9}>
          <Geographies geography="/earth/countries.geo.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryData = testData.find((data) => data.iso2 === geo.properties.iso2);

                const tooltipContent = () => {
                  return (
                    <div>
                      {countryToFlag(geo.properties.iso2)} {geo.properties.nameFR || geo.properties.name}
                      {countryData && (
                        <>
                          <br />
                          <strong>{getStatusLabel(countryData.status)}</strong>
                        </>
                      )}
                    </div>
                  );
                };

                return (
                  <Geography
                    onMouseOver={() => {
                      setTooltipData(tooltipContent);
                      setIsTooltipVisible(true);
                    }}
                    onMouseLeave={() => setIsTooltipVisible(false)}
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: countryData ? getCountryColor(countryData.status) : '#FFF',
                        stroke: '#000',
                        strokeWidth: '.2',
                        outline: 'none',
                        transition: 'ease .2s',
                      },
                      hover: {
                        fill: countryData ? getCountryColor(countryData.status) : '#edf2fb',
                        stroke: '#000',
                        strokeWidth: '.2',
                        outline: 'none',
                        cursor: 'pointer',
                        opacity: 0.8,
                      },
                      pressed: {
                        fill: countryData ? getCountryColor(countryData.status) : 'white',
                        stroke: '#000',
                        strokeWidth: '.2',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <TooltipMouseTracker isVisible={isTooltipVisible}>{tooltipData}</TooltipMouseTracker>
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

export default DashboardWorldMap;
