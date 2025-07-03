import React, { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid';

import { getCommentCount, getPublicationCount, getVideoCount } from '../../StatisticsUtils';
import CountryActivityPhaseAccordion from '../CountryActivityPhaseAccordion';
import AverageStatsCard from '../cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from '../cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from '../cards/StatsCard/StatsCard';
import BarCharts from '../charts/BarCharts';
import ContributionBarChart from '../charts/ContributionBarChart';
import PieCharts from '../charts/PieCharts';
import styles from '../styles/charts.module.css';
import ClassroomsToMonitorTable from '../tables/ClassroomsToMonitorTable';
import { AverageStatsProcessingMethod, DashboardType } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

const ENGAGEMENT_BAR_CHAR_TITLE = 'Évolution des connexions';
const CONTRIBUTION_BAR_CHAR_TITLE = 'Contribution des classes';

export interface DashboardClassroomTabProps {
  dashboardSummaryData: DashboardSummaryData;
  dashboardType: DashboardType;
  selectedCountry?: string;
  selectedPhase?: number;
}

const DashboardClassroomTab = ({ dashboardSummaryData, dashboardType, selectedCountry, selectedPhase = 0 }: DashboardClassroomTabProps) => {
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const videoCount = getVideoCount(dashboardSummaryData);
  const commentCount = getCommentCount(dashboardSummaryData);
  const publicationCount = getPublicationCount(dashboardSummaryData);

  // Extract barChartData for better readability
  const barChartData = dashboardSummaryData.barChartData || [];

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

        <Grid item xs={12} lg={6}>
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
        </Grid>
        {dashboardType === DashboardType.ONE_VILLAGE_PANEL ? (
          <Grid item xs={12} lg={12}>
            <BarCharts className={styles.midContainer} dataByMonth={barChartData} title={ENGAGEMENT_BAR_CHAR_TITLE} />
          </Grid>
        ) : (
          <>
            {dashboardSummaryData.engagementStatusData && (
              <Grid item xs={12} lg={6}>
                <PieCharts className={styles.minContainer} engagementStatusData={dashboardSummaryData.engagementStatusData} />
              </Grid>
            )}

            <Grid item xs={12} lg={6}>
              <BarCharts className={styles.midContainer} dataByMonth={barChartData} title={ENGAGEMENT_BAR_CHAR_TITLE} />
            </Grid>
          </>
        )}
        <Grid container spacing={2} alignItems="stretch" style={{ paddingLeft: '32px', paddingTop: '32px', display: 'flex' }}>
          <Grid item xs={12} md={6} style={{ display: 'flex' }}>
            <ClassesExchangesCard totalPublications={publicationCount} totalComments={commentCount} totalVideos={videoCount} />
          </Grid>
          <Grid item xs={12} md={6} style={{ paddingLeft: '32px', display: 'flex' }}>
            <ContributionBarChart dataByStep={dashboardSummaryData.contributionsBarChartData} title={CONTRIBUTION_BAR_CHAR_TITLE} />
          </Grid>
        </Grid>

        {/* Accordéons par phase */}
        {selectedCountry &&
          (selectedPhase === 0 ? (
            [1, 2, 3].map((phase) => (
              <Grid item xs={12} lg={12} key={phase}>
                <CountryActivityPhaseAccordion
                  phaseId={phase}
                  countryCode={selectedCountry}
                  open={openPhases[phase]}
                  onClick={() =>
                    setOpenPhases((prev) => ({
                      ...prev,
                      [phase]: !prev[phase],
                    }))
                  }
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12} lg={12}>
              <CountryActivityPhaseAccordion
                phaseId={selectedPhase}
                countryCode={selectedCountry}
                open={openPhases[selectedPhase]}
                onClick={() =>
                  setOpenPhases((prev) => ({
                    ...prev,
                    [selectedPhase]: !prev[selectedPhase],
                  }))
                }
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default DashboardClassroomTab;
