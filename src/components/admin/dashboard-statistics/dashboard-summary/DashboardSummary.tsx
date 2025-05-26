import React, { useState } from 'react';

import { Tab, Tabs } from '@mui/material';

import TabPanel from '../TabPanel';
import DashboardClassroomTab from './DashboardClassroomTab';
import DashboardFamilyTab from './DashboardFamilyTab';
import { DashboardSummaryTab } from 'types/dashboard.type';
import type { DashboardSummaryData } from 'types/dashboard.type';

interface DashboardSummaryProps {
  data: DashboardSummaryData;
  barChartTitle?: string;
}

const DashboardSummary = ({ data, barChartTitle }: DashboardSummaryProps) => {
  const [tabValue, setTabValue] = useState<DashboardSummaryTab>(DashboardSummaryTab.CLASSROOM);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: DashboardSummaryTab) => {
    setTabValue(newValue);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab value={DashboardSummaryTab.CLASSROOM} label="En classe" />
        <Tab value={DashboardSummaryTab.FAMILY} label="En famille" />
      </Tabs>
      <TabPanel value={tabValue} index={DashboardSummaryTab.CLASSROOM}>
        <DashboardClassroomTab data={data} barChartTitle={barChartTitle} />
      </TabPanel>
      <TabPanel value={tabValue} index={DashboardSummaryTab.FAMILY}>
        <DashboardFamilyTab data={data} />
      </TabPanel>
    </>
  );
};

export default DashboardSummary;
