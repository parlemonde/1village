
import { Box } from '@mui/material';
import { OneVillageTable } from '../OneVillageTable';
import { countryToFlag } from 'src/utils';

type CountryStatus = 'active' | 'observer' | 'ghost' | 'absent';

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

const fakeData = [
  { id: 1, country1iso: 'FR', country2iso: 'LU', totalConnections: 240, totalActivities: 853, status: 'active' },
  { id: 2, country1iso: 'FR', country2iso: 'US', totalConnections: 35, totalActivities: 140, status: 'observer' },
  { id: 3, country1iso: 'FR', country2iso: 'GB', totalConnections: 56, totalActivities: 593, status: 'ghost' },
  { id: 4, country1iso: 'FR', country2iso: 'ES', totalConnections: 98, totalActivities: 349, status: 'absent' },
  { id: 5, country1iso: 'FR', country2iso: 'MA', totalConnections: 24, totalActivities: 249, status: 'active' },
  { id: 6, country1iso: 'FR', country2iso: 'LB', totalConnections: 20, totalActivities: 99, status: 'observer' },
  { id: 7, country1iso: 'FR', country2iso: 'RO', totalConnections: 10, totalActivities: 45, status: 'ghost' },
  { id: 8, country1iso: 'GB', country2iso: 'FJ', totalConnections: 10, totalActivities: 35, status: 'absent' },
];

// Utilitaire pour obtenir le nom du pays à partir du code ISO
const getCountryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code);
  } catch {
    return code;
  }
};

// On prépare les données déjà formatées pour l'affichage
const tableData = fakeData.map((row) => ({
  id: row.id,
  countries: (
    <>
      <span>
        {getCountryName(row.country1iso)} {countryToFlag(row.country1iso)}
      </span>
      {' - '}
      <span>
        {getCountryName(row.country2iso)} {countryToFlag(row.country2iso)}
      </span>
    </>
  ),
  totalConnexion: row.totalConnections,
  totalActivities: row.totalActivities,
  status: <span style={{ color: getCountryColor(row.status as CountryStatus), fontSize: 24 }}>●</span>,
}));

const ActivityTable = () => {
  return (
    <Box sx={{ overflow: 'auto', marginTop: 2 }}>
      <OneVillageTable
        admin
        emptyPlaceholder={
          <>
            {"Aucune donnée disponible"}
          </>
        }
        footerElementsLabel="village"
        data={tableData}
        columns={[
          { key: 'countries', label: 'Pays', sortable: true },
          { key: 'totalConnexion', label: 'Total connexions', sortable: true },
          { key: 'totalActivities', label: 'Total activités', sortable: true },
          { key: 'status', label: 'Statut', sortable: true },
        ]}
      />
    </Box>
  );
};

export default ActivityTable;
