import React, { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import ClassroomStats from './ClassroomStats';
import CountryStats from './CountryStats';
import DataDetailsStats from './DataDetailsStats';
import GlobalStats from './GlobalStats';
import VillageStats from './VillageStats';
import { UserContext } from 'src/contexts/userContext';
import { UserType } from 'types/user.type';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

enum StatisticsDashboardTabType {
  GLOBAL,
  COUNTRY,
  VILLAGE,
  CLASSROOM,
  DATA,
}

const DashboardStatsNav = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedVillage, setSelectedVillage] = useState<number | undefined>();
  const [selectedClassroom, setSelectedClassroom] = useState<number | undefined>();
  const { user } = useContext(UserContext);

  const handleChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  const handleClassroomSelectFromList = (villageId?: number, countryCode?: string, classroomId?: number) => {
    setSelectedCountry(countryCode);
    setSelectedVillage(villageId);
    setSelectedClassroom(classroomId);
    setSelectedTab(StatisticsDashboardTabType.CLASSROOM);
  };
  // Callback passé à CountryStats (optionnel, utilisé seulement si clic village-monde)
  const handleVillageSelectFromList = (villageId: number, countryCode?: string) => {
    setSelectedVillage(villageId);
    setSelectedCountry(countryCode);
    setSelectedTab(StatisticsDashboardTabType.VILLAGE);
  };

  const handleCountrySelectFromList = (countryCode?: string) => {
    setSelectedCountry(countryCode);
    setSelectedTab(StatisticsDashboardTabType.COUNTRY);
  };

  const resetVillageFilters = () => {
    setSelectedCountry(undefined);
    setSelectedVillage(undefined);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, marginBottom: 2, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="Dashboard Statistics Navigation">
          <Tab label="1Village" {...a11yProps(StatisticsDashboardTabType.GLOBAL)} />
          <Tab label="Pays" {...a11yProps(StatisticsDashboardTabType.COUNTRY)} />
          <Tab label="Village-monde" {...a11yProps(StatisticsDashboardTabType.VILLAGE)} />
          {user?.type !== UserType.OBSERVATOR && <Tab label="Classe" {...a11yProps(StatisticsDashboardTabType.CLASSROOM)} />}
          {user?.type !== UserType.OBSERVATOR && <Tab label="Données" {...a11yProps(StatisticsDashboardTabType.DATA)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={selectedTab} index={StatisticsDashboardTabType.GLOBAL}>
        <GlobalStats handleCountrySelectFromList={handleCountrySelectFromList} onVillageSelect={handleVillageSelectFromList} />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={StatisticsDashboardTabType.COUNTRY}>
        <CountryStats onVillageSelect={handleVillageSelectFromList} selectedCountryFilter={selectedCountry} />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={StatisticsDashboardTabType.VILLAGE}>
        <VillageStats
          selectedCountry={selectedCountry}
          selectedVillage={selectedVillage}
          onResetFilters={resetVillageFilters}
          handleClassroomSelectFromList={handleClassroomSelectFromList}
        />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={StatisticsDashboardTabType.CLASSROOM}>
        <ClassroomStats classroomId={selectedClassroom} villageId={selectedVillage} countryId={selectedCountry} />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={StatisticsDashboardTabType.DATA}>
        <DataDetailsStats />
      </CustomTabPanel>
    </Box>
  );
};

export default DashboardStatsNav;
