import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

import CircleIcon from '@mui/icons-material/Circle';

import TooltipMouseTracker from '../TooltipMouseTracker/TooltipMouseTracker';
import styles from './DashboardWorldMap.module.css';
import type { GeoJSONCountryData } from 'src/components/WorldMap/world/objects/country';
import type { CountryEngagementStatus } from 'types/statistics.type';
import { EngagementStatus, EngagementStatusColor } from 'types/statistics.type';

interface DashboardWorldMapProps {
  countriesEngagementStatuses: CountryEngagementStatus[];
}

const DashboardWorldMap = ({ countriesEngagementStatuses }: DashboardWorldMapProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<GeoJSONCountryData | null>(null);

  return (
    <div className={styles.mapContainer}>
      <ComposableMap style={{ flex: '3', border: '1px solid #000', height: 'fit-content' }}>
        <ZoomableGroup center={[0, 0]} zoom={0.9}>
          <Geographies geography="/earth/countries.geo.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  onMouseOver={() => {
                    setTooltipData(geo);
                    setIsTooltipVisible(true);
                  }}
                  onMouseLeave={() => setIsTooltipVisible(false)}
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: getCountryEngagementColor(countriesEngagementStatuses, geo),
                      stroke: '#000',
                      strokeWidth: '.2',
                      outline: 'none',
                      transition: 'ease .2s',
                    },
                    hover: {
                      fill: getCountryEngagementColor(countriesEngagementStatuses, geo),
                      stroke: '#000',
                      strokeWidth: '.9',
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
      {tooltipData && (
        <TooltipMouseTracker isVisible={isTooltipVisible}>
          <>
            {tooltipData?.properties.nameFR}
            {getCountryEngagementColor(countriesEngagementStatuses, tooltipData) !== '#FFF' && (
              <CircleIcon
                fontSize="small"
                sx={{
                  color: getCountryEngagementColor(countriesEngagementStatuses, tooltipData),
                  verticalAlign: 'middle',
                  marginLeft: '.3rem',
                  paddingBottom: '.125rem',
                }}
              />
            )}
          </>
        </TooltipMouseTracker>
      )}
      <div className={styles.legendContainer}>
        <h2>Légende:</h2>
        <ul>
          <li>
            <div style={{ verticalAlign: 'middle', display: 'inline' }}>
              <CircleIcon fontSize="small" sx={{ color: EngagementStatusColor.ACTIVE, verticalAlign: 'middle' }} /> <span>Actif</span>: la majorité
              des classes ont posté ces 3 dernières semaines
            </div>
          </li>
          <li>
            <div style={{ verticalAlign: 'middle', display: 'inline' }}>
              <CircleIcon fontSize="small" sx={{ color: EngagementStatusColor.OBSERVER, verticalAlign: 'middle' }} /> <span>Observateur</span>: la
              majorité des classes ont pas posté depuis 3 semaines
            </div>
          </li>
          <li>
            <div style={{ verticalAlign: 'middle', display: 'inline' }}>
              <CircleIcon fontSize="small" sx={{ color: EngagementStatusColor.GHOST, verticalAlign: 'middle' }} /> <span>Fantôme</span>: la majorité
              des classes ne se sont pas connectées depuis 3 semaines
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardWorldMap;

function getCountryEngagementColor(countriesData: CountryEngagementStatus[], geography: GeoJSONCountryData): EngagementStatusColor | string {
  const countryToColor = countriesData.find((country) => country.countryCode === geography.properties.iso2);

  if (!countryToColor) return '#FFF';
  const countryStatusKey = (Object.keys(EngagementStatus) as Array<keyof typeof EngagementStatus>).find(
    (key) => EngagementStatus[key] === countryToColor.status,
  );

  return countryStatusKey ? EngagementStatusColor[countryStatusKey] : '#FFF';
}
