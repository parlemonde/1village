import React from 'react';

import PhaseDetails from '../menu/PhaseDetails';
import type { DashboardSummaryData, DashboardSummaryFilters } from 'types/dashboard.type';

interface DashboardPhaseDetailsProps {
  data: DashboardSummaryData;
  filters: DashboardSummaryFilters;
}

const DashboardPhaseDetails = ({ data, filters }: DashboardPhaseDetailsProps) => {
  if (!data || !data.activityCountDetails) {
    return null;
  }

  const getDataForPhase = (phase: number): Record<string, string | number>[] => {
    return data.activityCountDetails
      .map((activityDetails) => {
        const phaseData = activityDetails.phaseDetails.find((phaseDetails) => {
          return phaseDetails.phaseId === phase;
        });
        if (phaseData === undefined) {
          return {};
        }

        const { phaseId: _, ...rest } = phaseData;

        return {
          villageName: activityDetails.villageName,
          ...rest,
        };
      })
      .filter((details) => details !== {});
  };

  const getPhaseIds = () => {
    if (filters.phase !== undefined && filters.phase !== 0) {
      return [filters.phase];
    }

    return [1, 2, 3];
  };

  return (
    <div className="statistic__phase--container">
      {getPhaseIds().map((phaseId) => {
        return (
          <div key={phaseId}>
            <PhaseDetails phase={phaseId} data={getDataForPhase(phaseId)} />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardPhaseDetails;
