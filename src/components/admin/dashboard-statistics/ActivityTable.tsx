import type { JSX } from 'react';

import { Box } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { getCountryColor } from './utils/colorMapper';
import { countryToFlag } from 'src/utils';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import type { Country } from 'types/country.type';

type FormatedVillageActivity = {
  countries: string;
  status: JSX.Element;
  id: number;
  totalConnections: number;
  totalActivities: number;
};

const countriesToText = (countries: Country[]) => {
  return countries.map((c) => `${countryToFlag(c.isoCode)} ${c.name}`).join(' - ');
};

const ActivityTable = ({ activityTableData }: { activityTableData: VillageInteractionsActivity[] }) => {
  const tableData = formatVillagesData(activityTableData);
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

function formatVillagesData(activityData: VillageInteractionsActivity[]): FormatedVillageActivity[] {
  return activityData.map((villageActivity) => ({
    ...villageActivity,
    countries: countriesToText(villageActivity.countries),
    status: (
      <span key={villageActivity.status} style={{ color: getCountryColor(villageActivity.status), fontSize: 24 }}>
        ●
      </span>
    ),
  }));
}
