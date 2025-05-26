import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AverageStatsCard from '../cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from '../cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from '../cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from '../cards/StatsCard/StatsCard';
import BarCharts from '../charts/BarCharts';
import PhaseDetails from '../menu/PhaseDetails';
import { AverageStatsProcessingMethod } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

export interface DashboardClassroomTabProps {
  data: DashboardSummaryData;
  barChartTitle?: string;
}

const DashboardClassroomTab = ({ data, barChartTitle }: DashboardClassroomTabProps) => {
  return (
    <>
      <div className="statistic--container">
        <StatsCard data={data.registeredClassroomsCount}>Nombre de classes inscrites</StatsCard>
        <StatsCard data={data.connectedClassroomsCount}>Nombre de classes connectées</StatsCard>
        <StatsCard data={data.contributedClassroomsCount}>Nombre de classes contributrices</StatsCard>
      </div>
      <div className="statistic__average--container">
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
        <AverageStatsCard
          data={{
            min: data.minConnections ? data.minConnections : 0,
            max: data.maxConnections ? data.maxConnections : 0,
            average: data.averageConnections ? data.averageConnections : 0,
            median: data.medianConnections ? data.medianConnections : 0,
          }}
          icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
        >
          Nombre de connexions moyen par classe
        </AverageStatsCard>
      </div>
      {data.barChartData && (
        <div className="statistic--container">
          <BarCharts dataByMonth={data.barChartData} title={barChartTitle} />
        </div>
      )}
      <div className="statistic__average--container">
        <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
        <ClassesContributionCard />
      </div>
      {data && data.phases && (
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
      )}
    </>
  );
};

export default DashboardClassroomTab;
