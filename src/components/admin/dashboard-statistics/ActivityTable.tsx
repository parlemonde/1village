import type { JSX } from 'react';

import { Box } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { getCountryColor } from './utils/colorMapper';
import { countryToFlag } from 'src/utils';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';

type FormatedVillageActivity = {
  countries: JSX.Element;
  dominantStatus: JSX.Element;
  id: number;
  totalConnections: number;
  totalActivities: number;
};

const mapCountriesToText = (
  villageActivity: VillageInteractionsActivity,
  onVillageSelect?: (villageId: number, selectedCountry?: string) => void,
) => {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
      {villageActivity.countries.map((country, index) => (
        <span key={country.isoCode}>
          <span
            onClick={() => onVillageSelect?.(villageActivity.villageId, country.isoCode)}
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            {countryToFlag(country.isoCode)} {country.name}
          </span>
          {index < villageActivity.countries.length - 1 && <span> - </span>}
        </span>
      ))}
    </div>
  );
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
    countries: mapCountriesToText(villageActivity, onVillageSelect),
    dominantStatus: (
      <span key={villageActivity.id} style={{ color: getCountryColor(villageActivity.dominantStatus), fontSize: 24 }}>
        ●
      </span>
    ),
  }));
}
