import React from 'react';

import { Box } from '@mui/material';

import { OneVillageTable } from '../../OneVillageTable';
import StatsCard from '../cards/StatsCard/StatsCard';
import styles from '../styles/charts.module.css';
import { createFamiliesWithoutAccountRows, createFloatingAccountsRows } from '../utils/tableCreator';
import { FamiliesWithoutAccountHeaders, FloatingAccountsHeaders } from '../utils/tableHeader';
import type { DashboardSummaryData } from 'types/dashboard.type';

export interface DashboardFamilyTabProps {
  data: DashboardSummaryData;
}

const DashboardFamilyTab = ({ data }: DashboardFamilyTabProps) => {
  const familiesWithoutAccountRows = createFamiliesWithoutAccountRows(data.familiesWithoutAccount);
  const floatingAccountsRows = createFloatingAccountsRows(data.floatingAccounts);

  return (
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
        <StatsCard data={data.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
        <StatsCard data={data.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
        <StatsCard data={data.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
      </Box>
    </>
  );
};

export default DashboardFamilyTab;
