import React from 'react';

import TabPanel from '../TabPanel';
import DashboardClassroomTab from './DashboardClassroomTab';
import DashboardFamilyTab from './DashboardFamilyTab';
import { DashboardSummaryTab, DashboardType } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

interface DashboardSummaryProps {
  data: DashboardSummaryData;
  dashboardType?: DashboardType;
  selectedCountry?: string;
  selectedPhase?: number;
  activeTab?: DashboardSummaryTab;
}

const DashboardSummary = ({
  data,
  dashboardType = DashboardType.COMPLETE,
  selectedCountry,
  selectedPhase,
  activeTab = DashboardSummaryTab.CLASSROOM,
}: DashboardSummaryProps) => {
  if (!data) {
    return null;
  }

  return (
    <>
      <TabPanel value={activeTab} index={DashboardSummaryTab.CLASSROOM}>
        <DashboardClassroomTab data={data} dashboardType={dashboardType} selectedCountry={selectedCountry} selectedPhase={selectedPhase} />
      </TabPanel>
      <TabPanel value={activeTab} index={DashboardSummaryTab.FAMILY}>
        <DashboardFamilyTab data={data} />
      </TabPanel>
    </>
  );
};

export default DashboardSummary;
