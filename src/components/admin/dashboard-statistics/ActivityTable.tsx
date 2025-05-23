import React from 'react';

import { Box } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { countryToFlag } from 'src/utils';
import type { Country } from 'types/country.type';

type CountryStatus = 'active' | 'observer' | 'ghost' | 'absent';

const countriesToText = (countries: Country[]) => {
  return countries.map((c) => `${countryToFlag(c.isoCode)} ${c.name}`).join(' - ');
};

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

// Même structure de données que dans la table villages-mondes (manage/villages)

const fakeData = [
  {
    id: 1,
    countries: [
      {
        isoCode: 'FR',
        name: 'France',
      },
      {
        isoCode: 'LU',
        name: 'Luxembourg',
      },
    ],
    totalConnections: 240,
    totalActivities: 853,
    status: 'active',
  },
  {
    id: 2,
    countries: [
      {
        isoCode: 'FR',
        name: 'France',
      },
      {
        isoCode: 'US',
        name: 'United States',
      },
    ],
    totalConnections: 35,
    totalActivities: 140,
    status: 'observer',
  },
  {
    id: 3,
    countries: [
      {
        isoCode: 'FR',
        name: 'France',
      },
      {
        isoCode: 'GB',
        name: 'United Kingdom',
      },
    ],
    totalConnections: 56,
    totalActivities: 593,
    status: 'ghost',
  },
];

// On prépare les données déjà formatées pour l'affichage
const tableData = fakeData.map((row) => {
  return {
    id: row.id,
    countries: countriesToText(row.countries),
    totalConnections: row.totalConnections,
    totalActivities: row.totalActivities,
    status: <span style={{ color: getCountryColor(row.status as CountryStatus), fontSize: 24 }}>●</span>,
  };
});

const ActivityTable = () => {
  return (
    <Box sx={{ overflow: 'auto', marginTop: 2 }}>
      <OneVillageTable
        admin
        emptyPlaceholder="Aucune donnée disponible"
        footerElementsLabel="village"
        data={tableData}
        columns={[
          { key: 'countries', label: 'Pays', sortable: true },
          { key: 'totalConnections', label: 'Total connexions', sortable: true },
          { key: 'totalActivities', label: 'Total activités', sortable: true },
          { key: 'status', label: 'Statut', sortable: true },
        ]}
      />
    </Box>
  );
};

export default ActivityTable;
