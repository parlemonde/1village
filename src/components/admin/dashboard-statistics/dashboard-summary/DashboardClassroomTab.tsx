import React, { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid';

import CountryActivityPhaseAccordion from '../CountryActivityPhaseAccordion';
import AverageStatsCard from '../cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from '../cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from '../cards/StatsCard/StatsCard';
import BarCharts from '../charts/BarCharts';
import PieCharts from '../charts/PieCharts';
import PhaseDetails from '../menu/PhaseDetails';
import styles from '../styles/charts.module.css';
import { AverageStatsProcessingMethod, DashboardType } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

// To delete when pie chart data is done
const mockPieChartData = {
  data: [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ],
};

const ENGAGEMENT_BAR_CHAR_TITLE = 'Évolution des connexions';
const CONTRIBUTION_BAR_CHAR_TITLE = 'Contribution des classes';

export interface DashboardClassroomTabProps {
  data: DashboardSummaryData;
  dashboardType: DashboardType;
  selectedCountry?: string;
  selectedPhase?: number;
}

const DashboardClassroomTab = ({ data, dashboardType, selectedCountry, selectedPhase = 0 }: DashboardClassroomTabProps) => {
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  return (
    <>
      <Grid container spacing={4} direction={{ xs: 'column', md: 'row' }}>
        <Grid item xs={12} lg={4}>
          <StatsCard data={data.registeredClassroomsCount}>Nombre de classes inscrites</StatsCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <StatsCard data={data.connectedClassroomsCount}>Nombre de classes connectées</StatsCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <StatsCard data={data.contributedClassroomsCount}>Nombre de classes contributrices</StatsCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <AverageStatsCard
            data={{
              min: data.minDuration,
              max: data.maxDuration,
              average: data.averageDuration,
              median: data.medianDuration,
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
              min: data.minConnections,
              max: data.maxConnections,
              average: data.averageConnections,
              median: data.medianConnections,
            }}
            icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
          >
            Nombre de connexions moyen par classe
          </AverageStatsCard>
        </Grid>
        {dashboardType === DashboardType.ONE_VILLAGE_PANEL ? (
          <Grid item xs={12} lg={12}>
            <BarCharts className={styles.midContainer} dataByMonth={data.barChartData} title={ENGAGEMENT_BAR_CHAR_TITLE} />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} lg={6}>
              <PieCharts className={styles.minContainer} pieChartData={mockPieChartData} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <BarCharts className={styles.midContainer} dataByMonth={data.barChartData} title={ENGAGEMENT_BAR_CHAR_TITLE} />
            </Grid>
          </>
        )}
        <Grid item xs={12} lg={12}>
          <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
        </Grid>
        <Grid item xs={12} lg={12}>
          <BarCharts dataByMonth={data.barChartData} title={CONTRIBUTION_BAR_CHAR_TITLE} />
        </Grid>

        {data && data.phases && (
          <Grid item xs={12} lg={12}>
            <div className="statistic__phase--container">
              <div>
                <PhaseDetails phase={1} data={data.phases[0].data} />
              </div>
              <div className="statistic__phase">
                <PhaseDetails phase={2} data={data.phases[1].data} />
              </div>
              <div className="statistic__phase">
                <PhaseDetails phase={3} data={data.phases[1].data} />
              </div>
            </div>
          </Grid>
        )}
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
