import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import TeamComments from './TeamComments';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import styles from './styles/charts.module.css';
import { useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import { formatDate } from 'src/utils';
import type { FamiliesWithoutAccount, FloatingAccount, OneVillageTableRow } from 'types/statistics.type';

function createFamiliesWithoutAccountRows(data: Array<FamiliesWithoutAccount>): Array<OneVillageTableRow> {
  return data.map((row) => {
    return {
      id: row.student_id,
      student: `${row.student_firstname} ${row.student_lastname}`,
      vm: row.village_name,
      classroom: row.classroom_name,
      country: row.classroom_country,
      creationDate: row.student_creation_date ? formatDate(row.student_creation_date) : 'Donnée non disponible',
    };
  });
}
function createFloatingAccountsRows(data: Array<FloatingAccount>): Array<OneVillageTableRow> {
  return data.map((row) => {
    return {
      id: row.id,
      family: `${row.firstname} ${row.lastname}`,
      language: row.language,
      email: row.email,
      creationDate: row.createdAt ? formatDate(row.createdAt) : 'Donnée non disponible',
    };
  });
}
const FamiliesWithoutAccountHeaders = [
  { key: 'student', label: 'Nom Prénom Enfant', sortable: true },
  { key: 'vm', label: 'Village-Monde', sortable: true },
  { key: 'classroom', label: 'Classe', sortable: true },
  { key: 'country', label: 'Pays', sortable: true },
  { key: 'creationDate', label: 'Date de création identifiant', sortable: true },
];
const FloatingAccountsHeaders = [
  { key: 'family', label: 'Nom Prénom Famille', sortable: true },
  { key: 'language', label: 'Langue', sortable: true },
  { key: 'email', label: 'Mail', sortable: true },
  { key: 'creationDate', label: 'Date de création compte', sortable: true },
];
const GlobalStats = () => {
  const [value, setValue] = React.useState(0);
  const sessionsStats = useGetSessionsStats(null);
  const oneVillageStats = useGetOneVillageStats();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = React.useState<Array<OneVillageTableRow>>([]);
  const [floatingAccountsRows, setFloatingAccountsRows] = React.useState<Array<OneVillageTableRow>>([]);
  React.useEffect(() => {
    if (oneVillageStats.data?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows([]);
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(oneVillageStats.data?.familiesWithoutAccount));
    }
    if (oneVillageStats.data?.floatingAccounts) {
      setFloatingAccountsRows([]);
      setFloatingAccountsRows(createFloatingAccountsRows(oneVillageStats.data?.floatingAccounts));
    }
  }, [oneVillageStats.data?.familiesWithoutAccount, oneVillageStats.data?.floatingAccounts]);

  if (sessionsStats.isError) return <p>Error!</p>;
  if (sessionsStats.isLoading || sessionsStats.isIdle) return <p>Loading...</p>;
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && (
          <Box sx={{ p: 0 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // eslint-disable-next-line no-console
  console.log('Sessions stats', sessionsStats.data);

  return (
    <>
      <TeamComments />
      <DashboardWorldMap />
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" {...a11yProps(0)} />
        <Tab label="En famille" {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={4} direction={{ xs: 'column', md: 'row' }}>
          <Grid item xs={12} lg={4}>
            <StatsCard data={10}>
              Nombre de classes <br />
              inscrites
            </StatsCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <StatsCard data={10}>
              Nombre de classes <br /> connectées
            </StatsCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <StatsCard data={10}>
              Nombre de classes <br /> contributrices
            </StatsCard>
          </Grid>
          <Grid item xs={12} lg={6}>
            <AverageStatsCard
              data={{
                min: Math.floor(sessionsStats.data.minDuration / 60),
                max: Math.floor(sessionsStats.data.maxDuration / 60),
                average: Math.floor(sessionsStats.data.averageDuration / 60),
                median: Math.floor(sessionsStats.data.medianDuration / 60),
              }}
              unit="min"
              icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
            >
              Temps de connexion moyen par classe
            </AverageStatsCard>
          </Grid>
          <Grid item xs={12} lg={6}>
            <AverageStatsCard
              data={{
                min: sessionsStats.data.minConnections,
                max: sessionsStats.data.maxConnections,
                average: sessionsStats.data.averageConnections,
                median: sessionsStats.data.medianConnections,
              }}
              icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
            >
              Nombre de connexions moyen par classe
            </AverageStatsCard>
          </Grid>
          <Grid item xs={12} lg={6}>
            <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
          </Grid>
          {/* <div>
          <PhaseDetails
            phase={1}
            data={[
              { name: 'test', connections: 2 },
              { name: 'test 2', connections: 12 },
            ]}
          />
        </div>
        <div>
          <PhaseDetails
            phase={2}
            data={[
              { name: 'test', connections: 2, allo: 'fds' },
              { name: 'dest 2', connections: 12, allo: 'ads' },
            ]}
          />
        </div>
        <div>
          <PhaseDetails
            phase={3}
            data={[
              { name: 'test ff', connections: 15, allo: 'fdjjjjjjjs' },
              { name: 'dest 2', connections: 1, allo: 'fdsfsqds' },
            ]}
          />
        </div> */}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <>
          <OneVillageTable
            admin={false}
            emptyPlaceholder={<p>{'Pas de données'}</p>}
            data={familiesWithoutAccountRows}
            columns={FamiliesWithoutAccountHeaders}
            titleContent={`À surveiller : comptes non créés (${familiesWithoutAccountRows.length})`}
          />
          <OneVillageTable
            admin={false}
            emptyPlaceholder={<p>{'Pas de données'}</p>}
            data={floatingAccountsRows}
            columns={FloatingAccountsHeaders}
            titleContent={`À surveiller : comptes flottants (${floatingAccountsRows.length})`}
          />
          <Box
            className={styles.classroomStats}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              gap: 2,
            }}
          >
            <StatsCard data={oneVillageStats.data?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
            <StatsCard data={oneVillageStats.data?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
            <StatsCard data={oneVillageStats.data?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
          </Box>
        </>
      </CustomTabPanel>
    </>
  );
};

export default GlobalStats;
