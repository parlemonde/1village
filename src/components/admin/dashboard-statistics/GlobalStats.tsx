import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Grid, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import TabPanel from './TabPanel';
import TeamComments from './TeamComments';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows, createFloatingAccountsRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders, FloatingAccountsHeaders } from './utils/tableHeaders';
import { useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import type { OneVillageTableRow } from 'types/statistics.type';


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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <TeamComments />
      <DashboardWorldMap />
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" />
        <Tab label="En famille" />
      </Tabs>
      <TabPanel value={value} index={0}>
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
      </TabPanel>
      <TabPanel value={value} index={1}>
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
      </TabPanel>
    </>
  );
};

export default GlobalStats;
