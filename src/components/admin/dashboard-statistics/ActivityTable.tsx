import type { JSX } from 'react';

import { Box } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { getCountryColor } from './utils/colorMapper';
import { countryToFlag } from 'src/utils';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import type { Country } from 'types/country.type';

type FormatedVillageActivity = {
  countries: JSX.Element;
  dominantStatus: JSX.Element;
  id: number;
  totalConnections: number;
  totalActivities: number;
};

const countriesToText = (countries: Country[]) => {
  return countries.map((country) => `${countryToFlag(country.isoCode)} ${country.name}`).join(' - ');
};

type Props = {
  activityTableData: VillageInteractionsActivity[];
  onVillageSelect?: (villageId: number, selectedCountry?: string) => void;
};

const ActivityTable = ({ activityTableData, onVillageSelect }: Props) => {
  const tableData = formatVillagesData(activityTableData, onVillageSelect);
  return (
    <Box sx={{ overflow: 'auto', marginTop: 2 }}>
      <OneVillageTable
        admin
        emptyPlaceholder="Aucune donnée disponible"
        data={tableData}
        usePagination={false}
        showElementCount={false}
        columns={[
          { key: 'countries', label: 'Pays', sortable: true },
          { key: 'totalConnections', label: 'Total connexions', sortable: true },
          { key: 'totalActivities', label: 'Total activités', sortable: true },
          { key: 'dominantStatus', label: 'Statut', sortable: true },
        ]}
      />
    </Box>
  );
};

export default ActivityTable;

function formatVillagesData(
  activityData: VillageInteractionsActivity[],
  onVillageSelect?: (villageId: number, selectedCountry?: string) => void,
): FormatedVillageActivity[] {
  return activityData.map((villageActivity) => ({
    ...villageActivity,
    countries: (
      <span
        key={villageActivity.countries.map((c) => c.isoCode).join('-')}
        onClick={() => onVillageSelect?.(villageActivity.id, villageActivity.countries[0]?.isoCode)}
        style={{ cursor: 'pointer' }}
      >
        {countriesToText(villageActivity.countries)}
      </span>
    ),
    dominantStatus: (
      <span key={villageActivity.id} style={{ color: getCountryColor(villageActivity.dominantStatus), fontSize: 24 }}>
        ●
      </span>
    ),
  }));
}
