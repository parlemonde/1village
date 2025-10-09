import React, { useState } from 'react';

import Grid from '@mui/material/Grid';

import ClassesExchangesCard from '../cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from '../cards/StatsCard/StatsCard';
import BarChartWithMonthSelector from '../charts/BarChartWithMonthSelector';
import ContributionBarChart from '../charts/ContributionBarChart';
import PieCharts from '../charts/PieCharts';
import ClassroomsToMonitorTable from '../tables/ClassroomsToMonitorTable';
import { DashboardType } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

export interface DashboardClassroomTabProps {
  dashboardSummaryData: DashboardSummaryData;
  dashboardType: DashboardType;
  selectedCountry?: string;
  selectedPhase?: number;
}

const DashboardClassroomTab = ({ dashboardSummaryData, dashboardType, selectedCountry }: DashboardClassroomTabProps) => {
  const totalActivitiesCounts = dashboardSummaryData?.totalActivityCounts;

  return (
    <>
      <ClassroomsToMonitorTable countryId={selectedCountry} />
      <br />
      <Grid container spacing={4} direction={{ xs: 'column', md: 'row' }}>
        <Grid item xs={12} lg={4}>
          <StatsCard data={dashboardSummaryData.registeredClassroomsCount}>Nombre de classes inscrites</StatsCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <StatsCard data={dashboardSummaryData.connectedClassroomsCount}>Nombre de classes connectées</StatsCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <StatsCard data={dashboardSummaryData.contributedClassroomsCount}>Nombre de classes contributrices</StatsCard>
        </Grid>
        {/* VIL-824 : invisibiliser ces éléments dans le dashboard */}
        {/* <Grid item xs={12} lg={6}>
          <AverageStatsCard
            data={{
              min: dashboardSummaryData.minDuration,
              max: dashboardSummaryData.maxDuration,
              average: dashboardSummaryData.averageDuration,
              median: dashboardSummaryData.medianDuration,
            }}
            unit="min"
            processingMethod={AverageStatsProcessingMethod.BY_MIN}
            icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
          >
            Temps de connexion moyen par classe
          </AverageStatsCard>
        </Grid>
        <Grid item xs={12} lg={6}>
          <AverageStatsCard
            data={{
              min: dashboardSummaryData.minConnections,
              max: dashboardSummaryData.maxConnections,
              average: dashboardSummaryData.averageConnections,
              median: dashboardSummaryData.medianConnections,
            }}
            icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
          >
            Nombre de connexions moyen par classe
          </AverageStatsCard>
        </Grid> */}
        {dashboardType !== DashboardType.ONE_VILLAGE_PANEL && dashboardSummaryData.engagementStatusData && (
          <Grid item xs={12} lg={4}>
            <PieCharts engagementStatusData={dashboardSummaryData.engagementStatusData} />
          </Grid>
        )}
        <Grid item xs={12} lg={dashboardType === DashboardType.ONE_VILLAGE_PANEL ? 12 : 8}>
          <BarChartWithMonthSelector data={dashboardSummaryData.dailyConnectionsCountsByMonth} title="Évolution des connexions" />
        </Grid>
        <Grid container spacing={2} alignItems="stretch" style={{ paddingLeft: '32px', paddingTop: '32px', display: 'flex' }}>
          <Grid item xs={12} md={6} style={{ display: 'flex' }}>
            <ClassesExchangesCard
              totalPublications={totalActivitiesCounts?.totalPublications || 0}
              totalComments={totalActivitiesCounts?.totalComments || 0}
              totalVideos={totalActivitiesCounts?.totalVideos || 0}
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ paddingLeft: '32px', display: 'flex' }}>
            <ContributionBarChart dataByStep={dashboardSummaryData.contributionsBarChartData} title="Contribution des classes" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardClassroomTab;
