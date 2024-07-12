import { geoPath, geoMercator } from 'd3-geo';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import { useQuery } from 'react-query';

import styles from './CountryMap.module.css';

interface CountryMapProps {
  countryIso2: string;
}

const CountryMap = ({ countryIso2 }: CountryMapProps) => {
  const getSvgPath = async () => {
    const response = await fetch('/earth/countries.geo.json');
    const geojson: FeatureCollection = await response.json();

    const country = geojson.features.find((feature) => feature.properties && feature.properties.iso2 === countryIso2);

    if (country) {
      const projection = geoMercator().fitSize([800, 600], country);
      const pathGenerator = geoPath().projection(projection);
      const svgPath = pathGenerator(country);

      return svgPath;
    }

    return undefined;
  };

  const { data, isIdle, isLoading, isError } = useQuery('svg-coutry-path', getSvgPath);

  if (isIdle || isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error !</p>;

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 900 700" width="75%" height="75%">
        <path d={data ? data : ''} fill="#DAD7FE" x="50%" y="50%" />
      </svg>
    </div>
  );
};

export default CountryMap;
