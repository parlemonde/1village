import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import CircleIcon from '@mui/icons-material/Circle';
import { useQuery } from 'react-query';
import TooltipMouseTracker from '../TooltipMouseTracker/TooltipMouseTracker';
import { countryToFlag } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import styles from './DashboardWorldMap.module.css';

type CountryStatus = 'active' | 'observer' | 'ghost' | 'absent';

interface CountryData {
  iso2: string;
  status: CountryStatus;
}

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

const fetchCountriesStatus = async (): Promise<{ statuses: CountryData[] }> => {
  const response = await axiosRequest({
    method: 'GET',
    baseURL: '/api',
    url: '/statistics/countries/status',
  });
  return response.data;
};

const DashboardWorldMap = () => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
  const [tooltipData, setTooltipData] = React.useState<React.ReactNode>('');

  const { data: countriesData, isLoading } = useQuery(['countries-status'], fetchCountriesStatus);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={styles.mapContainer}>
      <ComposableMap style={{ flex: '3', border: '1px solid #000', height: 'fit-content' }}>
        <ZoomableGroup center={[0, 0]} zoom={0.9}>
          <Geographies geography="/earth/countries.geo.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryData = countriesData?.statuses?.find((data) => data.iso2 === geo.properties.iso2);
                return (
                  <Geography
                    onMouseOver={() => {
                      const countryName = geo.properties.nameFR || geo.properties.name;
                      const flag = countryToFlag(geo.properties.iso2);
                      const status = countryData ? getStatusLabel(countryData.status) : '';
                      setTooltipData(
                        <div>
                          {flag} {countryName}
                          {status && (
                            <>
                              <br />
                              <strong>{status}</strong>
                            </>
                          )}
                        </div>,
                      );
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
