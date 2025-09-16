import type { JSX } from 'react';

import { Box } from '@mui/material';

import type { Country } from '../../../../types/country.type';
import { OneVillageTable } from '../OneVillageTable';
import { countryToFlag } from 'src/utils';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { EngagementStatus, EngagementStatusColor } from 'types/statistics.type';

type FormatedVillageActivity = {
  countries: string;
  status: JSX.Element;
  id: number;
  totalConnections: number;
  totalActivities: number;
};

const countriesToText = (countries: Country[]) => {
  return countries.map((country) => `${countryToFlag(country.isoCode)} ${country.name}`).join(' - ');
};

const getCountryColor = (status: EngagementStatus): EngagementStatusColor | string => {
  switch (status) {
    case EngagementStatus.ACTIVE:
      return EngagementStatusColor.ACTIVE;
    case EngagementStatus.OBSERVER:
      return EngagementStatusColor.OBSERVER;
    case EngagementStatus.GHOST:
      return EngagementStatusColor.GHOST;
    default:
      return EngagementStatusColor.DEFAULT;
  }
};

const ActivityTable = ({ activityTableData }: { activityTableData: VillageInteractionsActivity[] }) => {
  const tableData = formatVillagesData(activityTableData);
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
