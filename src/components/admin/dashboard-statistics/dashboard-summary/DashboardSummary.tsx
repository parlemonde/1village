import React, { useState } from 'react';

import { Tab, Tabs } from '@mui/material';

import TabPanel from '../TabPanel';
import DashboardClassroomTab from './DashboardClassroomTab';
import DashboardFamilyTab from './DashboardFamilyTab';
import { DashboardSummaryTab, DashboardType } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

interface DashboardSummaryProps {
  dashboardSummaryData: DashboardSummaryData;
  dashboardType?: DashboardType;
  selectedCountry?: string;
  selectedPhase?: number;
}

const DashboardSummary = ({
  dashboardSummaryData,
  dashboardType = DashboardType.COMPLETE,
  selectedCountry,
  selectedPhase,
}: DashboardSummaryProps) => {
  const [tabValue, setTabValue] = useState<DashboardSummaryTab>(DashboardSummaryTab.CLASSROOM);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: DashboardSummaryTab) => {
    setTabValue(newValue);
  };

  if (!dashboardSummaryData) {
    return null;
  }

  return (
    <>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ py: 3 }}>
        <Tab value={DashboardSummaryTab.CLASSROOM} label="En classe" />
        <Tab value={DashboardSummaryTab.FAMILY} label="En famille" />
      </Tabs>
      <TabPanel value={tabValue} index={DashboardSummaryTab.CLASSROOM}>
        <DashboardClassroomTab
          dashboardSummaryData={dashboardSummaryData}
          dashboardType={dashboardType}
          selectedCountry={selectedCountry}
          selectedPhase={selectedPhase}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={DashboardSummaryTab.FAMILY}>
        <DashboardFamilyTab dashboardSummaryData={dashboardSummaryData} />
      </TabPanel>
    </>
  );
};

export default DashboardSummary;
