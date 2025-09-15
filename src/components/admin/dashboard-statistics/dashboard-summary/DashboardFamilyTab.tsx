import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box } from '@mui/material';

import { OneVillageTable } from '../../OneVillageTable';
import AverageStatsCard from '../cards/AverageStatsCard/AverageStatsCard';
import StatsCard from '../cards/StatsCard/StatsCard';
import BarCharts from '../charts/BarCharts';
import { mockDataByMonth } from '../mocks/mocks';
import styles from '../styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from '../utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from '../utils/tableHeader';
import type { DashboardSummaryData } from 'types/dashboard.type';
import { AverageStatsProcessingMethod } from 'types/dashboard.type';

const ENGAGEMENT_BAR_CHAR_TITLE = 'Évolution des connexions';

export interface DashboardFamilyTabProps {
  dashboardSummaryData: DashboardSummaryData;
}

const DashboardFamilyTab = ({ dashboardSummaryData }: DashboardFamilyTabProps) => {
  const familyData = dashboardSummaryData.family;

  if (!familyData) {
    return null;
  }

  const familiesWithoutAccountRows = createFamiliesWithoutAccountRows(familyData.familiesWithoutAccount);

  return (
    <>
      <OneVillageTable
        admin={false}
        emptyPlaceholder={<p>{'Pas de données'}</p>}
        data={familiesWithoutAccountRows}
        columns={FamiliesWithoutAccountHeaders}
        titleContent={`À surveiller : comptes non créés (${familiesWithoutAccountRows.length})`}
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
        <StatsCard data={familyData.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
        <StatsCard data={familyData.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
        <StatsCard data={familyData.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
      </Box>

      <div className="statistic__average--container">
        <AverageStatsCard
          data={{
            min: familyData.minDuration,
            max: familyData.maxDuration,
            average: familyData.averageDuration,
            median: familyData.medianDuration,
          }}
          unit="min"
          processingMethod={AverageStatsProcessingMethod.BY_MIN}
          icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
        >
          Temps de connexion moyen par classe
        </AverageStatsCard>
        <AverageStatsCard
          data={{
            min: familyData.minConnections,
            max: familyData.maxConnections,
            average: familyData.averageConnections,
            median: familyData.medianConnections,
          }}
          icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
        >
          Nombre de connexions moyen par classe
        </AverageStatsCard>
      </div>

      <div className="statistic--container">
        <BarCharts className={styles.midContainer} dataByMonth={mockDataByMonth} title={ENGAGEMENT_BAR_CHAR_TITLE} />
      </div>
    </>
  );
};

export default DashboardFamilyTab;
