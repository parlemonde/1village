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
  activeTab?: DashboardSummaryTab;
}

const DashboardSummary = ({
  dashboardSummaryData,
  dashboardType = DashboardType.COMPLETE,
  selectedCountry,
  selectedPhase,
  activeTab = DashboardSummaryTab.CLASSROOM,
}: DashboardSummaryProps) => {
  return (
    dashboardSummaryData && (
      <>
        <TabPanel value={activeTab} index={DashboardSummaryTab.CLASSROOM}>
          <DashboardClassroomTab
            dashboardSummaryData={dashboardSummaryData}
            dashboardType={dashboardType}
            selectedCountry={selectedCountry}
            selectedPhase={selectedPhase}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={DashboardSummaryTab.FAMILY}>
          <DashboardFamilyTab dashboardSummaryData={dashboardSummaryData} />
        </TabPanel>
      </>
    )
  );
};

export default DashboardSummary;
